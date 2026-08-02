import { ElementRef } from '@angular/core';
import { DirNumerosDirective } from './dir-numeros.directive';

describe('DirNumerosDirective', () => {
  it('should create an instance', () => {
    const directive = new DirNumerosDirective(
      new ElementRef(document.createElement('input')),
    );
    expect(directive).toBeTruthy();
  });
});
