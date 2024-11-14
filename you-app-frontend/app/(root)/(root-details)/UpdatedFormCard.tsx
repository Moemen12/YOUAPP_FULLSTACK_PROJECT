import { Label } from "@/components/ui/label";
import { formatDateAndCalculateAge } from "@/lib/utils";
import { ProfileData } from "@/types";
import React from "react";

const UpdatedFormCard: React.FC<{ profile: ProfileData }> = ({
  profile,
}: {
  profile: ProfileData;
}): JSX.Element => {
  const { day, year, month, age } = formatDateAndCalculateAge(
    profile?.birthday
  );
  return (
    <div className="w-[85%] flex flex-col gap-3">
      {profile?.isUpdated && (
        <>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="birthday"
              className="text-slate-500 text-base font-medium"
            >
              Birthday:
            </Label>
            <p className="text-white text-sm font-medium">
              {`${day} / ${month} / ${year} (Age ${age})`}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="horoscope"
              className="text-slate-500 text-base font-medium"
            >
              Horoscope:
            </Label>
            <p className="text-white text-sm font-medium">
              {profile.horoscope}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="zodiac"
              className="text-slate-500 text-base font-medium"
            >
              Zodiac:
            </Label>
            <p className="text-white text-sm font-medium">{profile.zodiac}</p>
          </div>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="height"
              className="text-slate-500 text-base font-medium"
            >
              Height:
            </Label>
            <p className="text-white text-sm font-medium">
              {profile.height} cm
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Label
              htmlFor="weight"
              className="text-slate-500 text-base font-medium"
            >
              Weight:
            </Label>
            <p className="text-white text-sm font-medium">
              {profile.weight} kg
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default UpdatedFormCard;
