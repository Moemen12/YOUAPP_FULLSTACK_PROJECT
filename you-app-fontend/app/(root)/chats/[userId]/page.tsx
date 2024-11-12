"use client";
import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { io, Socket } from "socket.io-client";
import ChatScreen from "@/components/ChatScreen";
import { ChatMessages } from "@/types";

export default function ChatPage() {
  const params = useParams();
  const router = useRouter();
  const receiverId = params.userId as string;
  const [chatMessages, setChatMessages] = useState<ChatMessages>({
    allMessages: [],
    profileImage: null,
    receiver: "",
  });
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  // Use a ref to keep socket instance across re-renders
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize socket if not already done
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:1234", {
        auth: {
          token: localStorage.getItem("access_token") || "",
        },
      });

      const socket = socketRef.current;

      socket.emit("join_chat", receiverId);

      socket.on("connect_error", (err) => {
        console.error("Connection Error:", err.message);
      });

      socket.on("auth_error", (message) => {
        console.error("Authentication Error:", message);
        localStorage.removeItem("access_token");
        router.push("/auth/login");
        socket.disconnect();
        socketRef.current = null;
      });

      socket.on("chat_history", (chatHistory: ChatMessages) => {
        setChatMessages(chatHistory);
      });

      socket.on("message_sent", (message) => {
        setChatMessages((prev) => ({
          ...prev,
          allMessages: [...prev.allMessages, message],
        }));
      });

      socket.on("new_message", (message) => {
        setChatMessages((prev) => ({
          ...prev,
          allMessages: [...prev.allMessages, message],
        }));
      });

      socket.on("user_typing", ({ userId }) => {
        if (userId === receiverId) {
          setIsTyping(true);
        }
      });

      socket.on("user_stop_typing", ({ userId }) => {
        if (userId === receiverId) {
          setIsTyping(false);
        }
      });
    }

    return () => {
      // Cleanup listeners and socket on component unmount
      if (socketRef.current) {
        socketRef.current.off("message_sent");
        socketRef.current.off("new_message");
        socketRef.current.off("chat_history");
        socketRef.current.off("auth_error");
        socketRef.current.off("connect_error");
        socketRef.current.off("user_typing");
        socketRef.current.off("user_stop_typing");
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [router, receiverId]);

  const handleMessageChange = (value: string) => {
    setNewMessage(value);

    // Clear existing timeout
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    // Emit typing event
    socketRef.current?.emit("typing", receiverId);

    // Set new timeout to emit stop typing
    const timeout = setTimeout(() => {
      socketRef.current?.emit("stop_typing", receiverId);
    }, 1000);

    setTypingTimeout(timeout);
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      socketRef.current?.emit("send_message", {
        receiverId,
        content: newMessage,
      });
      setNewMessage("");
      socketRef.current?.emit("stop_typing", receiverId);
    }
  };

  return (
    <ChatScreen
      receiverId={receiverId}
      selectedUser={{
        username: chatMessages.receiver,
        profileImage: chatMessages.profileImage,
      }}
      messages={chatMessages.allMessages}
      newMessage={newMessage}
      onNewMessageChange={handleMessageChange}
      onSendMessage={handleSendMessage}
      onBack={() => router.push("/chats")}
      isTyping={isTyping}
    />
  );
}
