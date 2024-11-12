import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { interestedIdeas } from "../constants";
import { InterestedIdea } from "../types/index";

@ValidatorConstraint({ name: "ValidateInterestedValues", async: false })
export class ValidateInterestedValues implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments): boolean {
    // Handle undefined/null case
    if (value === undefined || value === null) {
      args.object[args.property] = [];
      return true;
    }

    // Handle empty string case
    if (value === "") {
      args.object[args.property] = [];
      return true;
    }

    // Handle array input
    if (Array.isArray(value)) {
      const isValid = value.every(
        (item) =>
          typeof item === "string" &&
          interestedIdeas.includes(item as InterestedIdea)
      );

      if (isValid) {
        args.object[args.property] = value;
        return true;
      }
      return false;
    }

    // Handle string input
    if (typeof value !== "string") {
      return false;
    }

    try {
      const valuesArray: any[] = value
        .split(",")
        .map((item: string) => item.trim())
        .filter((item: string) => item.length > 0);

      // Validate each value
      const isValid = valuesArray.every((item) =>
        interestedIdeas.includes(item as InterestedIdea)
      );

      if (isValid) {
        args.object[args.property] = valuesArray;
        return true;
      }

      return false;
    } catch (error) {
      console.error("Validation error:", error);
      return false;
    }
  }

  defaultMessage(args: ValidationArguments): string {
    return `Invalid interested values. Allowed values are: ${interestedIdeas.join(
      ", "
    )}`;
  }
}
