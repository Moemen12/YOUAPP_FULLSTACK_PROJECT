import { Transform } from "class-transformer";
import {
  IsIn,
  IsISO8601,
  IsNotEmpty,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
  MinLength,
  Validate,
} from "class-validator";
import {
  HOROSCOPE_SIGNS,
  HoroscopeSign,
  // InterestedIdea,
  uniqueChineseZodiacAnimals,
  Zodiac,
} from "../constants";
import { IsPastDateConstraint } from "../validators/is-notFor-future.validator";
import { IsFile, MaxFileSize, HasMimeType } from "nestjs-form-data";
import { MemoryStoredFile } from "nestjs-form-data";
import { ValidateInterestedValues } from "../validators/interested-values-validator.validator";

export class UserProfileDto {
  @MinLength(5, { message: "Username must be at least 5 characters long" })
  @MaxLength(15, { message: "Username must be at most 15 characters long" })
  @Matches(/^[a-z0-9]+$/, {
    message: "Username must only contain alphabetic characters and numbers",
  })
  username: string;

  @IsIn(["Male", "Female"], {
    message: "Gender must be either Male or Female",
  })
  gender: "Male" | "Female";

  @Validate(IsPastDateConstraint)
  @IsISO8601(
    { strict: true },
    { message: "Birthday must be a valid date in the format YYYY-MM-DD" }
  )
  @IsNotEmpty()
  birthday: string;

  @IsIn(HOROSCOPE_SIGNS, {
    message: "Zodiac must be a valid astrological sign",
  })
  zodiac: Zodiac;

  @IsIn(uniqueChineseZodiacAnimals, {
    message: "Horoscope must be a valid Chinese zodiac animal",
  })
  horoscope: HoroscopeSign;

  @Max(250, { message: "Height can't exceed 250 cm" })
  @Min(50, { message: "Height must be at least 50 cm" })
  @Transform(({ value }) => parseFloat(value))
  height: number;

  @Max(300, { message: "Weight can't exceed 300 kg" })
  @Min(20, { message: "Weight must be at least 20 kg" })
  @Transform(({ value }) => parseFloat(value))
  weight: number;

  @IsFile()
  @MaxFileSize(5 * 1024 * 1024) // 1MB
  @HasMimeType(["image/jpeg", "image/png"])
  profile_image: MemoryStoredFile;

  @Validate(ValidateInterestedValues)
  @IsString()
  interestedIdeas: string[];
}
