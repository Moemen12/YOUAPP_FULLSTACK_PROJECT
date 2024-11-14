"use client";
import React, { useState } from "react";
import { ChevronLeft, MoreVertical, Send } from "lucide-react";
import { CombinedAxiosError, Message } from "@/types";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useMutation } from "react-query";
import { clearChat, deleteUser } from "@/lib/react-query/main.mutation";
import toast from "react-hot-toast";

interface ChatScreenProps {
  receiverId: string;
  selectedUser: {
    username: string;
    profileImage: string | null;
  };
  messages: Message[];
  newMessage: string;
  onNewMessageChange: (value: string) => void;
  onSendMessage?: () => void;
  onBack: () => void;
  isTyping: boolean;
}

const ChatScreen: React.FC<ChatScreenProps> = ({
  selectedUser,
  messages,
  newMessage,
  onNewMessageChange,
  onSendMessage,
  receiverId,
  isTyping,
}) => {
  const [isAlertOpened, setIsAlertOpened] = useState<boolean>(false);
  const router = useRouter();

  const openDeleteModel = () => {
    setIsAlertOpened(true);
  };

  const removeUserMutation = useMutation({
    mutationFn: (targetId: string) => deleteUser(targetId),
    onSuccess: () => {
      router.push("/chats");
    },
    onError: (error: CombinedAxiosError) => {
      toast.error(error.response?.data.message || "An error occurred");
    },
  });

  const clearChatMutation = useMutation({
    mutationFn: (targetId: string) => clearChat(targetId),
    onSuccess: () => {
      router.push("/chats");
    },
    onError: (error: CombinedAxiosError) => {
      toast.error(error.response?.data.message || "An error occurred");
    },
  });

  return (
    <div className="h-screen bg-white flex flex-col">
      {isAlertOpened ? (
        <AlertDialog open={isAlertOpened}>
          <AlertDialogContent className="w-11/12">
            <AlertDialogHeader>
              <AlertDialogTitle>
                Are you sure you want to delete {selectedUser.username}&apos;s
                account?
              </AlertDialogTitle>
              <AlertDialogDescription>
                Deleting the account will permanently remove all chats between
                you and{" "}
                <b className="text-slate-800">{selectedUser.username}</b>, and
                any invites will no longer be available. This action cannot be
                undone
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setIsAlertOpened(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={() => removeUserMutation.mutate(receiverId)}
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      ) : null}

      <div className="bg-gray-100 p-4 flex items-center">
        <ChevronLeft
          className="mr-4 cursor-pointer"
          onClick={() => router.push("/chats")}
        />
        <Image
          src={
            selectedUser.profileImage ||
            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/768px-Default_pfp.svg.png"
          }
          alt={selectedUser.username}
          className="w-10 h-10 rounded-full mr-3"
          width={40}
          height={40}
        />
        <div className="flex-grow">
          <h2 className="font-semibold">{selectedUser.username}</h2>
          <p className="text-xs text-gray-600">{isTyping ? "Typing..." : ""}</p>
        </div>
        <div className="flex space-x-4">
          {/* <Phone className="text-gray-600" />
          <Video className="text-gray-600" /> */}

          <DropdownMenu>
            <DropdownMenuTrigger>
              <MoreVertical className="text-gray-600" />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={openDeleteModel}
              >
                Delete Account
              </DropdownMenuItem>
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => clearChatMutation.mutate(receiverId)}
              >
                Clear chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="flex-grow overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`flex flex-col
               ${msg.senderId === receiverId ? "items-start" : "items-end"}
              `}
          >
            <div
              className={`max-w-[70%] p-3 rounded-xl ${
                msg.senderId === receiverId
                  ? "bg-gray-200 text-black"
                  : "bg-blue-500 text-white"
              }`}
            >
              {msg.content}
            </div>
            <span className="text-xs text-gray-500 mt-1">{msg.time}</span>
          </div>
        ))}
        {isTyping && (
          <div className="flex items-start">
            <div className="bg-gray-200 text-black p-3 rounded-xl">
              <div className="flex space-x-1">
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.2s]"></div>
                <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:0.4s]"></div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="bg-gray-100 p-4 flex items-center">
        <input
          type="text"
          placeholder="Type a message"
          value={newMessage}
          onChange={(e) => onNewMessageChange(e.target.value)}
          className="flex-grow p-2 bg-white rounded-full mr-2"
        />
        <button
          onClick={onSendMessage}
          className="bg-blue-500 text-white p-2 rounded-full"
        >
          <Send size={20} />
        </button>
      </div>
    </div>
  );
};

export default ChatScreen;
