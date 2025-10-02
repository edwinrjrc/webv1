import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

export class ValidacionesPropias {

  /**
   * Validador que verifica si el valor de un control no es igual a '0'.
   * Útil para selects donde la opción "Seleccione..." tiene el valor 0.
   */
  static notZero(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      // Convertir el valor a número si no lo es, para asegurar la comparación.
      // Si el valor es null, undefined, o una cadena vacía, no se considera '0'
      // a menos que también se use Validators.required.
      const value = Number(control.value);

      // Si el valor es estrictamente 0, es inválido.
      if (value === 0) {
        return { 'notZero': true }; // Devuelve un objeto de error si es inválido
      }
      return null; // Devuelve null si es válido
    };
  }
  // Puedes añadir otros validadores personalizados aquí si los necesitas
  // static customPattern(regex: RegExp): ValidatorFn { ... }
}