"use client";
import React, { useState } from "react";
import { FormLevel, InterestedIdea } from "@/types";
import { BiEditAlt } from "react-icons/bi";
import { interestedIdeas } from "@/lib/constants";
import { Skeleton } from "@/components/ui/skeleton";

interface InterestFormProps {
  savedTags: string[];
  interestTags: InterestedIdea[];
  editable: FormLevel;
  setEditable: (newState: FormLevel) => void;
  onSaveTags: (tags: string) => void; // Change to accept a string
  isLoading: boolean;
}

const InterestForm: React.FC<InterestFormProps> = ({
  editable,
  setEditable,
  interestTags,
  onSaveTags,
  isLoading,
}): JSX.Element => {
  const [inputValue, setInputValue] = useState("");
  const [tags, setTags] = useState<string[]>([]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputValue.trim()) {
      addTag(inputValue.trim());
    }
  };

  const addTag = (tag: string) => {
    if (!tags.includes(tag)) {
      const newTags = [...tags, tag];
      setTags(newTags);
      // Send tags as a comma-separated string
      onSaveTags(newTags.join(",")); // Update this line
    }
    setInputValue("");
  };

  const removeTag = (tag: string) => {
    const newTags = tags.filter((t) => t !== tag);
    setTags(newTags);
    // Send tags as a comma-separated string
    onSaveTags(newTags.join(",")); // Update this line
  };

  // Filter suggestions based on inputValue
  const filteredSuggestions = interestedIdeas.filter((idea) =>
    idea.toLowerCase().includes(inputValue.toLowerCase())
  );

  return (
    <>
      {editable.interestEdit ? (
        <div className="flex flex-col mt-24 gap-2 px-2">
          <h2 className="bg-special-gold text-lg text-transparent bg-clip-text font-semibold">
            Tell everyone about yourself
          </h2>
          <p className="text-lg text-white font-semibold">
            What interests you?
          </p>

          <div className="flex flex-wrap items-center bg-second-card border-none rounded-md px-4 py-2 mt-4 gap-1">
            {tags.map((tag) => (
              <span
                style={{ overflowWrap: "anywhere" }}
                key={tag}
                className="text-white bg-[#374C51] rounded px-2 py-1 text-sm font-semibold cursor-pointer"
                onClick={() => removeTag(tag)}
              >
                {tag} ✕
              </span>
            ))}

            <input
              value={inputValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              placeholder={tags.length === 0 ? "Start typing..." : ""}
              className="bg-second-card outline-none text-white h-8 w-full placeholder:text-sm px-2"
            />
          </div>

          {inputValue && filteredSuggestions.length > 0 && (
            <div className="suggestions mt-2 grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-1">
              {filteredSuggestions.map((suggestion) => (
                <div
                  key={suggestion}
                  className="cursor-pointer bg-custom-gradient border-white text-white border p-2 mt-1 text-sm"
                  onClick={() => addTag(suggestion)}
                >
                  {suggestion}
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="rounded-3xl bg-second-card mt-4 flex flex-col justify-center items-center pt-3 pb-8">
          <div className="text-white flex items-center justify-between w-[85%] pb-6">
            <span className="text-base font-bold">Interest</span>
            <BiEditAlt
              onClick={() =>
                setEditable({
                  profileEdit: editable.profileEdit,
                  interestEdit: true,
                })
              }
              size="1.3rem"
              className="text-sm font-bold cursor-pointer"
            />
          </div>

          {isLoading ? (
            <Skeleton className="h-9 bg-slate-800 w-[85%]" />
          ) : (
            <div className="w-[85%] flex items-center gap-2 flex-wrap">
              {interestTags?.length > 0 ? (
                interestTags?.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="text-white bg-[#374C51] rounded-3xl py-2 px-3 text-sm font-semibold cursor-pointer"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <p className="text-slate-500 text-base font-medium">
                  Add in your interest to find a better match
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default InterestForm;
