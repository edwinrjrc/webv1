import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

/**
 * Validador personalizado que verifica si el valor cumple con el formato de correo electrónico.
 * @returns Un objeto de error si la validación falla ({ 'emailInvalid': true }), o null si es válido.
 */
export function emailValidator(): ValidatorFn {
  // Expresión regular de ejemplo para un formato de correo común (puede ser más o menos estricta)
  const emailRegEx = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    // Si el campo está vacío, no aplica la validación (debe combinarse con Validators.required)
    if (!value) {
      return null;
    }

    // Comprueba si el valor coincide con la expresión regular
    const isValid = emailRegEx.test(value);

    // Si no es válido, retorna el objeto de error.
    return isValid ? null : { 'emailInvalid': true };
  };
}