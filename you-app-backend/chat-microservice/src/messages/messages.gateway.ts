import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { HeaderData } from '@shared/types';
import { MessagesService } from './messages.service';
import { Types } from 'mongoose';

interface SocketWithAuth extends Socket {
  userId?: string;
  username?: string;
}

@WebSocketGateway(1234, {
  cors: {
    origin: '*',
    credentials: true,
  },
})
export class MessagesGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private userSocketMap = new Map<string, string>();

  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly messagesService: MessagesService,
  ) {}

  async handleConnection(@ConnectedSocket() client: SocketWithAuth) {
    try {
      const token = client.handshake.auth.token;

      if (!token) {
        client.emit('auth_error', 'Authorization token is missing');
        client.disconnect();
        return;
      }

      const payload: HeaderData = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get<string>('JWT_SOCKET_TOKEN'),
      });

      // Store user info directly on socket instance
      client.userId = payload.userId;
      client.username = payload.username;

      this.userSocketMap.set(payload.userId, client.id);
      client.join(`user_${payload.userId}`);

      try {
        const connectedUsers = await this.messagesService.getConnectedUsers(
          payload.userId,
        );

        const unreadCounts = await this.messagesService.getUnreadMessageCounts(
          payload.userId,
        );

        const usersWithUnread = connectedUsers.map((user) => ({
          ...user,
          unreadCount:
            unreadCounts.find((count) => count._id.equals(user._id))?.count ||
            0,
        }));

        client.emit('connected_users', usersWithUnread);
      } catch (error) {
        console.error('Error fetching connected users:', error);
        client.emit('auth_error', 'Error fetching connected users');
        client.disconnect();
        return;
      }
    } catch (error) {
      client.emit('auth_error', 'Invalid token, disconnecting');
      client.disconnect();
    }
  }

  handleDisconnect(client: SocketWithAuth) {
    if (client.userId) {
      this.userSocketMap.delete(client.userId);
    }
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join_chat')
  async handleJoinChat(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() receiverId: string,
  ) {
    if (!client.userId) return;

    try {
      const messages = await this.messagesService.getChatHistory(
        client.userId,
        receiverId,
      );

      client.emit('chat_history', messages);
    } catch (error) {
      console.error('Error fetching chat history:', error);
      client.emit('error', 'Error fetching chat history');
    }
  }

  @SubscribeMessage('send_message')
  async handleSendMessage(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() message: { receiverId: string; content: string },
  ) {
    if (!client.userId) return;

    try {
      const savedMessage = await this.messagesService.saveMessage({
        senderId: new Types.ObjectId(client.userId),
        receiverId: new Types.ObjectId(message.receiverId),
        content: message.content,
        isRead: false,
        senderUsername: client.username,
      });

      // Emit the message to the sender
      client.emit('message_sent', savedMessage);

      // Broadcast the message to the receiver
      const receiverSocketId = this.userSocketMap.get(message.receiverId);
      if (receiverSocketId) {
        this.server.to(receiverSocketId).emit('new_message', {
          ...savedMessage,
          sender: {
            _id: client.userId,
            username: client.username,
          },
        });
      }

      // Emit the updated unread count to the receiver
      const unreadCount = await this.messagesService.getUnreadMessageCounts(
        message.receiverId,
      );
      this.server
        .to(`user_${message.receiverId}`)
        .emit('unread_count_update', unreadCount);
    } catch (error) {
      console.error('Error sending message:', error);
      client.emit('error', 'Error sending message');
    }
  }

  @SubscribeMessage('typing')
  handleTyping(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() receiverId: string,
  ) {
    if (!client.userId || !client.username) return;

    const receiverSocketId = this.userSocketMap.get(receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('user_typing', {
        userId: client.userId,
        username: client.username,
      });
    }
  }

  @SubscribeMessage('stop_typing')
  handleStopTyping(
    @ConnectedSocket() client: SocketWithAuth,
    @MessageBody() receiverId: string,
  ) {
    if (!client.userId) return;

    const receiverSocketId = this.userSocketMap.get(receiverId);
    if (receiverSocketId) {
      this.server.to(receiverSocketId).emit('user_stop_typing', {
        userId: client.userId,
      });
    }
  }
}
