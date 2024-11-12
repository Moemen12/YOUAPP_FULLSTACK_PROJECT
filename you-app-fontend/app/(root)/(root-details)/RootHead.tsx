import { Skeleton } from "@/components/ui/skeleton";
import { formatDateAndCalculateAge } from "@/lib/utils";
import { ProfileData } from "@/types";
import React from "react";

const RootHead: React.FC<{
  profile?: ProfileData;
  isLoading: boolean;
  isUpdated?: boolean;
}> = ({
  profile,
  isLoading,
  isUpdated,
}: {
  profile?: ProfileData;
  isLoading: boolean;
  isUpdated?: boolean;
}): JSX.Element => {
  const { age } = formatDateAndCalculateAge(profile?.birthday as string);
  return (
    <div
      className="w-[98%] mx-auto rounded-3xl min-h-[12rem] h-auto bg-card-back mt-6 relative overflow-hidden transition-all duration-500 ease-in-out bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage:
          profile?.profileImage && !isLoading
            ? `url("${profile?.profileImage}")`
            : "none",
      }}
    >
      {isLoading ? (
        <Skeleton className="w-full h-full min-h-[12rem] bg-slate-800 rounded-3xl" />
      ) : (
        <>
          {isUpdated ? (
            <div className="absolute text-white bottom-3 left-3 flex flex-col gap-1">
              <b className="text-base">
                @{profile?.username}, {age}
              </b>
              <span className="text-sm">{profile?.gender}</span>
              <div className="flex gap-1 items-center flex-wrap">
                <span className="bg-[#1f2524] py-1 px-4 rounded-2xl font-medium">
                  {profile?.horoscope}
                </span>
                <span className="bg-[#1f2524] py-1 px-4 rounded-2xl font-medium">
                  {profile?.zodiac}
                </span>
              </div>
            </div>
          ) : (
            <div className="absolute text-white bottom-3 left-3 flex flex-col gap-2">
              <b className="text-base">@{profile?.username},</b>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RootHead;
