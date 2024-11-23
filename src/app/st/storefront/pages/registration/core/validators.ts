import {AbstractControl, ValidationErrors} from "@angular/forms";

export const STRONG_PASSWORD_PATTERN =
  /^(?!.*(.)\1)(?=.*?[A-Z])(?=.*?\d)(?=.*?[!@#$%^*()_\-+{};:.,]).{6,}$/;
export const CONSECUTIVE_CHARACTERS = /(.)\1+/;

export class StValidators {
  static strongPasswordValidator(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.value as string;

    return password &&
    (!password.length || password.match(STRONG_PASSWORD_PATTERN))
      ? null
      : { cxInvalidPassword: true };
  }

  static noConsecutiveCharacters(
    control: AbstractControl
  ): ValidationErrors | null {
    const password = control.value as string;

    return password &&
    (!password.length || password.match(CONSECUTIVE_CHARACTERS))
      ? { cxNoConsecutiveCharacters: true }
      : null;
  }
}
