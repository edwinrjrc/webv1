import { Directive, HostListener, ElementRef } from '@angular/core';

@Directive({
  selector: '[appDirNumeros]',
  standalone: true,
})
export class DirNumerosDirective {
  constructor(private el: ElementRef) {}

  @HostListener('input', ['$event']) onInput(event: KeyboardEvent) {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, ''); // Reemplaza todo lo que no sea un número
    input.value = value;
  }
}
