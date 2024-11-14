"use client";
import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { RiArrowLeftSLine } from "react-icons/ri";
import { BiEditAlt } from "react-icons/bi";
import { BsPlusLg } from "react-icons/bs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import DatePicker from "react-datepicker";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Form } from "@/components/ui/form";
import { gender, ProfileValues } from "@/lib/constants";
import { ProfileParams, ProfileSchema } from "@/lib/validation";
import {
  formatDateToISO,
  getChineseZodiacSign,
  getWesternZodiacSign,
  handleImageUpload,
} from "@/lib/utils";

import SharedInput from "@/components/shared/Input";
import Image from "next/image";
import toast from "react-hot-toast";

import { useMutation, useQuery } from "react-query";
import { fetchProfile } from "@/lib/react-query/main.query";
import { updateProfile } from "@/lib/react-query/main.mutation";
import { AxiosError } from "axios";
import { ErrorShape, FormLevel, InterestedIdea, ProfileData } from "@/types";
import UpdatedFormCard from "./(root-details)/UpdatedFormCard";
import { queryClient } from "@/components/shared/providers/QueryWrapper";
import UpdatingModal from "@/components/shared/UpdatingModal";
import RootHead from "./(root-details)/RootHead";
import InterestForm from "./(root-details)/InterestForm";
import clsx from "clsx";
import NotificationsBanner from "@/components/shared/NotificationsBanner";

const ProfileComponent = () => {
  const router = useRouter();
  const [initialGender, setInitialGender] = useState<string | null>(null);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [isThreePointClicked, setIsThreePointClicked] =
    useState<boolean>(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [editable, setEditable] = useState<FormLevel>({
    profileEdit: false,
    interestEdit: false,
  });
  const [tags, setTags] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const submitRef = useRef<HTMLButtonElement | null>(null);

  const {
    data: profile,
    isLoading,
    // error,
  } = useQuery<ProfileData>(["profile"], fetchProfile);

  const updateProfileMutation = useMutation(updateProfile, {
    onSuccess: (data) => {
      queryClient.invalidateQueries(["profile"]);
      toast.success(data.message);
    },
    onError: (error: AxiosError<ErrorShape>) => {
      if (error.response) {
        const errorMessage = error.response.data.message || "An error occurred";
        toast.error(errorMessage);
      }
    },
  });

  const form = useForm<ProfileParams>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: ProfileValues,
    mode: "onChange",
  });

  const selectFile = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };
  const handleClick = () => {
    setIsThreePointClicked((prev) => !prev); // Toggle the state
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      form.setValue("profile_image", file);
      form.clearErrors("profile_image"); // Clear error after selecting the image
    }
  };

  useEffect(() => {
    if (profile) {
      form.reset({
        ...profile,
        zodiac: profile.zodiac || form.getValues("zodiac"), // retain filled zodiac
        horoscope: profile.horoscope || form.getValues("horoscope"), // retain filled horoscope
      });
      setInitialGender(profile.gender || null);
      setStartDate(profile.birthday ? new Date(profile.birthday) : null);
      setTags(profile.interestedIdeas || []);
    }
  }, [profile, form]);

  const onSubmit = async (values: ProfileParams) => {
    console.log(values); // Log the form values

    let compressedImage: File | undefined;

    if (values.profile_image instanceof File) {
      compressedImage = await handleImageUpload(values.profile_image);
    }

    const formData = new FormData();

    // Append other form fields
    Object.keys(values).forEach((key) => {
      // Only append profile_image once, either the compressed version or the original
      if (key === "profile_image") {
        if (compressedImage) {
          formData.append("profile_image", compressedImage); // Append the compressed image
        } else if (values.profile_image) {
          formData.append("profile_image", values.profile_image); // Append the original image
        }
      } else {
        formData.append(key, values[key as keyof ProfileParams]);
      }
    });

    for (const pair of formData.entries()) {
      console.log(pair);
    }

    updateProfileMutation.mutate(formData);
  };

  const fillZodiacAndHoroscope = (date: Date) => {
    const westernZodiac = getWesternZodiacSign(date);
    const chineseZodiac = getChineseZodiacSign(date);

    form.setValue("zodiac", westernZodiac);
    form.setValue("horoscope", chineseZodiac);
    // You can log these values to ensure they are correctly computed
    console.log(
      "Western Zodiac:",
      westernZodiac,
      "Chinese Horoscope:",
      chineseZodiac
    );
  };

  const updateZodiacAndHoroscope = (date: Date | null) => {
    setStartDate(date);
    if (date) {
      fillZodiacAndHoroscope(date);
      form.setValue("birthday", formatDateToISO(date));
      // Ensure form state is updated
      form.trigger(["zodiac", "horoscope"]);
    }
  };

  const renderField = (
    label: string,
    name: keyof ProfileParams,
    type: "text" | "number" | "date" = "text",
    disabled = false
  ) => (
    <>
      <Label htmlFor={name} className="text-slate-500 text-sm font-medium">
        {label}:
      </Label>
      {isLoading ? (
        <Skeleton className="w-full h-9 bg-slate-800" />
      ) : (
        <SharedInput<ProfileParams>
          form={form.control}
          name={name}
          type={type}
          className="bg-card-back placeholder:text-right text-right text-white pr-4"
          placeholder={`Add ${label.toLowerCase()}`}
          disabled={disabled}
        />
      )}
    </>
  );

  const updateUserProfile = (): void => {
    if (submitRef && submitRef.current) {
      submitRef.current.click();
    }
  };

  const handleSaveTags = (tags: string) => {
    console.log(tags);

    const updatedTags = tags.split(",");
    setTags(updatedTags);
    form.setValue("interestedIdeas", updatedTags);
  };

  return (
    <>
      <UpdatingModal isSubmitting={updateProfileMutation.isLoading} />

      <div
        className={`min-h-svh flex flex-col ${clsx({
          "blur-sm": isThreePointClicked,
        })} ${
          !editable.interestEdit
            ? "bg-root-back px-3"
            : "bg-custom-gradient px-5"
        }`}
      >
        {/* Header */}
        <div className="mt-6 flex justify-between items-center flex-wrap text-white">
          <button
            className="flex items-center text-sm focus-visible:outline-none"
            onClick={() => router.back()}
          >
            <RiArrowLeftSLine color="white" size="1.5rem" />
            Back
          </button>

          {editable.interestEdit && (
            <button
              type="button"
              className="bg-special-blue bg-clip-text text-transparent"
              onClick={() => {
                // Update editable state
                setEditable({
                  profileEdit: editable.profileEdit,
                  interestEdit: false,
                });

                if (submitRef.current) {
                  submitRef.current.click();
                  setEditable({
                    profileEdit: true,
                    interestEdit: false,
                  });
                }
              }}
            >
              save
            </button>
          )}
          {!editable.interestEdit ? (
            <>
              <div className="w-[141px] h-[24px] text-center">
                {isLoading ? (
                  <Skeleton className="w-full h-full bg-slate-800 rounded-full" />
                ) : (
                  <span className="text-sm font-semibold">
                    @{profile?.username}
                  </span>
                )}
              </div>
              <NotificationsBanner onClick={handleClick} />
            </>
          ) : null}
        </div>

        {/* Profile Head */}

        {!editable.interestEdit ? (
          <RootHead
            profile={profile}
            isLoading={isLoading}
            isUpdated={profile?.isUpdated}
          />
        ) : null}

        <div
          className={clsx(
            "rounded-3xl bg-second-card mt-6 flex flex-col justify-center items-center pt-3 pb-8",
            { hidden: editable.interestEdit }
          )}
        >
          <div className="text-white flex items-center justify-between w-[85%] pb-8">
            <span className="text-base font-bold">About</span>
            {editable.profileEdit ? (
              <button
                className="text-sm bg-special-gold bg-clip-text text-transparent"
                disabled={updateProfileMutation.isLoading}
                onClick={updateUserProfile}
              >
                Save & Update
              </button>
            ) : (
              <BiEditAlt
                onClick={() =>
                  setEditable({
                    profileEdit: true,
                    interestEdit: editable.interestEdit,
                  })
                }
                size="1.3rem"
                className="text-sm font-bold cursor-pointer"
              />
            )}
          </div>

          <div className="w-[85%] flex flex-col">
            <div className={clsx({ hidden: !editable.profileEdit })}>
              <div className="text-white flex items-center gap-3">
                {imagePreview ? (
                  <Image
                    width={52}
                    height={52}
                    src={imagePreview}
                    alt="Preview"
                    className="object-cover rounded-xl h-14 w-14"
                  />
                ) : (
                  <span className="p-3 rounded-xl inline-block bg-card-back cursor-pointer">
                    <BsPlusLg size="1.7rem" />
                  </span>
                )}

                <p className="text-sm cursor-pointer" onClick={selectFile}>
                  Add Image
                </p>

                <Input
                  type="file"
                  name="profile_image"
                  className="hidden"
                  ref={inputRef}
                  onChange={handleFileChange}
                />
              </div>

              {form.formState.errors.profile_image && (
                <p
                  id=":r5:-form-item-message"
                  className="text-[0.8rem] font-medium text-destructive mt-2"
                >
                  {form.formState.errors.profile_image.message}
                </p>
              )}

              <Form {...form}>
                <div
                  className={clsx(
                    "transition-all duration-500 ease-in-out",
                    editable.profileEdit
                      ? "max-h-screen opacity-100"
                      : "max-h-0 opacity-0"
                  )}
                >
                  {/* Other form elements go here */}
                </div>

                <form
                  className="grid grid-cols-2 pt-8 gap-y-2"
                  onSubmit={form.handleSubmit(onSubmit, (errors) =>
                    console.log(errors)
                  )}
                >
                  {renderField("Display name", "username")}

                  <Label
                    htmlFor="gender"
                    className="text-slate-500 text-sm font-medium"
                  >
                    Gender:
                  </Label>
                  {isLoading ? (
                    <Skeleton className="w-full h-9 bg-slate-800" />
                  ) : (
                    <div>
                      <Select
                        onValueChange={(value) => {
                          setInitialGender(value);
                          form.setValue("gender", value as "Male" | "Female");
                          form.clearErrors("gender"); // Clear error when a gender is selected
                        }}
                      >
                        <SelectTrigger
                          className={clsx(
                            "bg-card-back border-slate-600 justify-end pr-2",
                            !initialGender ? "text-[#737373]" : "text-white"
                          )}
                        >
                          <SelectValue
                            placeholder={initialGender || "Select Gender"}
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-card-back border-slate-400">
                          <SelectGroup>
                            {gender.map((type: string) => (
                              <SelectItem key={type} value={type}>
                                {type}
                              </SelectItem>
                            ))}
                          </SelectGroup>
                        </SelectContent>
                      </Select>

                      {form.formState.errors.gender && (
                        <p
                          id=":r5:-form-item-message"
                          className="text-[0.8rem] font-medium text-destructive mt-2"
                        >
                          {form.formState.errors.gender.message}
                        </p>
                      )}
                    </div>
                  )}

                  <Label
                    htmlFor="birthday"
                    className="text-slate-500 text-sm font-medium"
                  >
                    Birthday:
                  </Label>
                  {isLoading ? (
                    <Skeleton className="w-full h-9 bg-slate-800" />
                  ) : (
                    <div className="relative w-full bg-card-back rounded-md border-slate-600 border">
                      <DatePicker
                        withPortal
                        showYearDropdown
                        disabledKeyboardNavigation
                        id="birthday"
                        placeholderText="DD MM YYYY"
                        name="birthday"
                        dateFormat={"dd MM yyyy"}
                        selected={startDate}
                        onChange={(date) => {
                          updateZodiacAndHoroscope(date);
                          form.clearErrors("birthday"); // Clear error when a date is picked
                        }}
                        className="placeholder:text-right placeholder:text-[#737373] text-white pr-4 text-right bg-card-back focus-visible:outline-none w-full text-sm py-2"
                      />
                    </div>
                  )}

                  {renderField("Horoscope", "horoscope", "text", true)}
                  {renderField("Zodiac", "zodiac", "text", true)}
                  {renderField("Height", "height", "number")}
                  {renderField("Weight", "weight", "number")}

                  <button
                    type="submit"
                    className="hidden"
                    role="button"
                    ref={submitRef}
                  >
                    Save Changes
                  </button>
                </form>
              </Form>
            </div>

            {isLoading ? (
              <Skeleton className="w-full h-9 bg-slate-800" />
            ) : !editable.profileEdit && !profile?.isUpdated ? (
              <p className="text-slate-500 text-base font-medium">
                Add in your to help others know you better
              </p>
            ) : null}
          </div>

          {!editable.profileEdit && profile?.isUpdated && (
            <UpdatedFormCard profile={profile} />
          )}
        </div>

        <InterestForm
          interestTags={profile?.interestedIdeas as InterestedIdea[]}
          savedTags={tags}
          editable={editable}
          setEditable={setEditable}
          onSaveTags={handleSaveTags}
          isLoading={isLoading}
        />
      </div>
    </>
  );
};

export default ProfileComponent;
