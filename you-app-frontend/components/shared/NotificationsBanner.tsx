import React, { useEffect, useMemo, useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "../ui/scroll-area";
import * as VisuallyHidden from "@radix-ui/react-visually-hidden";
import { month, weekday } from "@/lib/constants";
import { Button } from "../ui/button";
import { Bell, Check, X, InboxIcon } from "lucide-react";
import Image from "next/image";
import { useMutation, useQuery } from "react-query";
import { getInvitationNotifications } from "@/lib/react-query/main.query";
import {
  CombinedAxiosError,
  InvitationInfo,
  ReceivedInvitation,
} from "@/types";
import { respondToUserInvitation } from "@/lib/react-query/main.mutation";
import toast from "react-hot-toast";

interface NotificationsBannerProps {
  onClick: () => void;
}

const NotificationSkeleton = () => (
  <div className="flex items-center gap-3 p-3 rounded-xl bg-gray-800 animate-pulse">
    <div className="w-12 h-12 rounded-full bg-slate-700" />
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-slate-700 rounded w-3/4" />
      <div className="h-3 bg-slate-700 rounded w-1/4" />
    </div>
    <div className="flex gap-2">
      <div className="w-10 h-10 rounded-full bg-slate-700" />
      <div className="w-10 h-10 rounded-full bg-slate-700" />
    </div>
  </div>
);

const EmptyState = () => (
  <div className="flex flex-col items-center justify-center py-12 text-center">
    <div className="bg-slate-800 p-4 rounded-full mb-4">
      <InboxIcon className="w-12 h-12 text-slate-400" />
    </div>
    <h3 className="text-xl font-semibold text-white mb-2">
      No notifications yet
    </h3>
    <p className="text-slate-400 max-w-sm">
      When you receive new invitation or messages, they&apos;ll show up here
    </p>
  </div>
);

const NotificationsBanner: React.FC<NotificationsBannerProps> = ({
  onClick,
}) => {
  const [time, setTime] = useState<Date>(new Date());

  const mutation = useMutation(
    ({ receiver, respond }: InvitationInfo) =>
      respondToUserInvitation({ receiver, respond }),
    {
      onSuccess: () => {
        refetch();
      },
      onError: (error: CombinedAxiosError) => {
        toast.error(error.response?.data.message || "An error occurred");
      },
    }
  );

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getMinutes() !== time.getMinutes()) {
        setTime(now);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [time]);

  const formattedTime = useMemo(() => {
    return `${time.getHours()}:${time
      .getMinutes()
      .toString()
      .padStart(2, "0")}`;
  }, [time]);

  const formattedDate = useMemo(() => {
    return time.getDate().toString().padStart(2, "0");
  }, [time]);

  const {
    data: invitation,
    isLoading,
    refetch,
  } = useQuery("get-invitation-notifications", getInvitationNotifications);

  const hasNotifications: boolean = invitation && invitation.length > 0;

  return (
    <Sheet onOpenChange={onClick}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-6 w-6" />
          {hasNotifications && (
            <span className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-red-500 text-xs text-white flex items-center justify-center">
              {invitation.length}
            </span>
          )}
        </Button>
      </SheetTrigger>
      <SheetContent side={"top"} className="bg-slate-900 border-transparent">
        <VisuallyHidden.Root>
          <SheetTitle>Menu</SheetTitle>
        </VisuallyHidden.Root>

        <SheetHeader>
          <SheetDescription asChild>
            <>
              <div className="flex items-center font-mono justify-around">
                <p className="text-white w-fit text-5xl">{formattedTime}</p>
                <div className="text-base text-slate-400">
                  <p>{`${weekday[time.getDay()]}, ${formattedDate}`}</p>
                  <p>{month[time.getMonth()]}</p>
                </div>
              </div>
              <ScrollArea className="h-full pt-6">
                <div className="space-y-2 py-4">
                  {isLoading ? (
                    <>
                      <NotificationSkeleton />
                      <NotificationSkeleton />
                      <NotificationSkeleton />
                    </>
                  ) : !hasNotifications ? (
                    <EmptyState />
                  ) : (
                    invitation.map((invitation: ReceivedInvitation) => (
                      <div
                        key={invitation._id}
                        className="flex items-center gap-3 p-3 rounded-xl bg-gray-50"
                      >
                        <Image
                          src={
                            invitation.profileImage ||
                            "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/Default_pfp.svg/768px-Default_pfp.svg.png"
                          }
                          alt="user profile"
                          className="w-12 h-12 rounded-full"
                          width={48}
                          height={48}
                        />
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">
                            {invitation.username}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {invitation.createdAt}
                          </span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600 rounded-full w-10 h-10 p-0"
                            onClick={() =>
                              mutation.mutate({
                                receiver: invitation._id,
                                respond: true,
                              })
                            }
                          >
                            <Check className="h-5 w-5" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="rounded-full w-10 h-10 p-0"
                            onClick={() =>
                              mutation.mutate({
                                receiver: invitation._id,
                                respond: false,
                              })
                            }
                          >
                            <X className="h-5 w-5" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </ScrollArea>
            </>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  );
};

export default NotificationsBanner;
