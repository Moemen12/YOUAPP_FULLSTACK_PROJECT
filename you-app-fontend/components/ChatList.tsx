import { CombinedAxiosError, ConnectedUser, RegisteredUsers } from "@/types";
import { Search, UserPlus, Users } from "lucide-react";
import { BiCheckDouble } from "react-icons/bi";
import { useState } from "react";
import { useMutation, useQuery } from "react-query";
import { IoIosSend } from "react-icons/io";
import {
  getRegisteredUsers,
  inviteUser,
} from "@/lib/react-query/main.mutation";
import Image from "next/image";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface ChatListProps {
  users: ConnectedUser[];
}

const MessageStatus = ({ isRead }: { isRead: boolean }) => (
  <div className="flex">
    <BiCheckDouble
      className={`w-5 h-5 -mr-1 ${isRead ? "text-blue-500" : "text-gray-400"}`}
    />
  </div>
);

const ChatList: React.FC<ChatListProps> = ({ users }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const router = useRouter();

  const { data: suggestedUsers, refetch } = useQuery<
    unknown,
    unknown,
    RegisteredUsers[]
  >("get-registered-users", getRegisteredUsers);

  const filteredUsers = suggestedUsers?.filter((user) =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const mutation = useMutation((receiver: string) => inviteUser(receiver), {
    onSuccess: () => {
      refetch();
    },
    onError: (error: CombinedAxiosError) => {
      toast.error(error.response?.data.message);
    },
  });

  const handleUserSelect = (user: ConnectedUser) => {
    router.push(`/chats/${user._id}`);
  };

  return (
    <div className="h-screen bg-white">
      <div className="p-4 bg-gray-100 flex items-center justify-between">
        <h1 className="text-xl font-bold">Chats</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            {users.length > 0 ? <UserPlus className="cursor-pointer" /> : null}
          </DialogTrigger>
          <DialogContent className="w-[95%]">
            <DialogHeader>
              <DialogTitle>Invite Team Members</DialogTitle>
              <DialogDescription>
                Start a conversation by inviting team members to your chat
              </DialogDescription>
            </DialogHeader>

            <div className="relative mt-4 mb-6">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name or email..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {filteredUsers?.map((user: RegisteredUsers) => (
                <div
                  key={user._id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <Image
                      width={40}
                      height={40}
                      src={
                        user.imageUrl ||
                        "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/768px-Default_pfp.svg.png"
                      }
                      alt={user.username}
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {user.username}
                      </h3>
                    </div>
                  </div>
                  {user.isInvited ? (
                    <Button
                      variant="outline"
                      size="sm"
                      disabled
                      className="w-20 flex items-center gap-1 cursor-not-allowed"
                    >
                      Invited
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-20 flex items-center gap-1"
                      onClick={() => mutation.mutate(user.receiver)}
                    >
                      <IoIosSend />
                      Invite
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {users.length === 0 ? (
        <div className="p-6 flex flex-col items-center justify-center h-[calc(100vh-64px)]">
          <div className="bg-gray-50 p-4 rounded-full mb-4">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            No chats yet
          </h2>
          <p className="text-gray-500 text-center mb-6 max-w-sm">
            Get started by inviting team members to chat with
          </p>
          <Button className="gap-2" onClick={() => setIsDialogOpen(true)}>
            <UserPlus className="w-4 h-4" />
            Invite People
          </Button>
        </div>
      ) : (
        <div className="divide-y">
          {users.map((user) => (
            <div
              role="navigation"
              key={user._id}
              className="flex p-4 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleUserSelect(user)}
            >
              <Image
                priority
                src={
                  user.profileImage ||
                  "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/768px-Default_pfp.svg.png"
                }
                alt={user.username}
                className="w-12 h-12 rounded-full mr-4 object-cover"
                width={48}
                height={48}
              />
              <div className="flex-grow">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold">{user.username}</h2>
                  <div className="flex items-center gap-1">
                    <span className="text-xs text-gray-500">
                      {user.lastMessage?.time}
                    </span>
                    {user.lastMessage && (
                      <MessageStatus isRead={user.lastMessage.isRead} />
                    )}
                  </div>
                </div>
                <p className="text-sm text-gray-600 truncate">
                  {user.lastMessage?.content || "No messages yet"}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatList;
