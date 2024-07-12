import { FormGroup } from "@angular/forms";

export function notEqualsValidator() {
    return (group: FormGroup) => {
        const passwN = group.controls['passwN'];
        const passwR = group.controls['passwR'];
        if (passwR.errors && !passwR.errors['notEquals']) {
            return;
        }
        if (passwN.value !== passwR.value) {
            passwR.setErrors({ notEquals: true })
        } else {
            passwR.setErrors(null);
        }
    }
}