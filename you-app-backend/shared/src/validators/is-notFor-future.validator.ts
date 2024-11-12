import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { parseISO } from "date-fns";

@ValidatorConstraint({ name: "isPastDate", async: false })
export class IsPastDateConstraint implements ValidatorConstraintInterface {
  validate(value: any, _args: ValidationArguments) {
    // Return true if value is undefined/null (handle this with @IsOptional if needed)
    if (value === undefined || value === null) {
      return true;
    }

    try {
      const date = parseISO(value);
      return date <= new Date();
    } catch (error) {
      return false;
    }
  }

  defaultMessage(_args: ValidationArguments) {
    return "Date must be in the past";
  }
}
