import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function passwStrenthValidators(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
        const valor = control.value;
        if (!valor) {
            return null;
        }

        const hasUpperCase = /[A-Z]+/.test(valor);
        const hasLowerCase = /[a-z]+/.test(valor);
        const hasNumber = /[0-9]+/.test(valor);
        const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=]+/.test(valor);

        const passwValido = hasUpperCase && hasLowerCase && hasNumber && hasSpecial;

        return passwValido ? null : { passwordStrength: true };
    }
}