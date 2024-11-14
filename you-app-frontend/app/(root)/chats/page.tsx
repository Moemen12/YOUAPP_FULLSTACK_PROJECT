"use client";

import ChatList from "@/components/ChatList";
import { ConnectedUser } from "@/types";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

const ChatsPage: React.FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState<ConnectedUser[]>([]); // Assuming `ConnectedUser` is your type for users

  useEffect(() => {
    if (!socket) {
      socket = io("http://localhost:1234", {
        auth: {
          token: localStorage.getItem("access_token") || "",
        },
      });

      socket.on("connected_users", (receivedUsers) => {
        setUsers(receivedUsers);
      });

      socket.on("connect_error", (err) => {
        console.error("Connection Error:", err.message);
      });

      socket.on("auth_error", (message) => {
        console.error("Authentication Error:", message);
        localStorage.removeItem("access_token");
        router.push("/auth/login");
        socket?.disconnect();
        socket = null; // Clean up socket instance on auth error
      });
    }

    // Clean up on unmount
    return () => {
      socket?.disconnect();
      socket = null;
    };
  }, [router]);

  return (
    <div className="max-w-md mx-auto">
      <ChatList users={users} />
    </div>
  );
};

export default ChatsPage;
