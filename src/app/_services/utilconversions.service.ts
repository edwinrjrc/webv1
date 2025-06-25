import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root',
})
export class UtilconversionsService {
  chapa = 'P@s$W0(Contr3n@)';
  salt = 'mysalt';

  constructor() {}

  async encryptData(data: string): Promise<string> {
    try {
      const encoder = new TextEncoder();
      const keyBuffer = await crypto.subtle.importKey(
        'raw',
        encoder.encode(this.chapa),
        { name: 'AES-GCM' },
        true,
        ['encrypt', 'decrypt']
      );
      // Encryption logic
      const iv = crypto.getRandomValues(new Uint8Array(12));
      const encodedData = encoder.encode(data);
      const encryptedData = await crypto.subtle.encrypt(
        { name: 'AES-GCM', iv: iv },
        keyBuffer,
        encodedData
      );
      const resultArray = new Uint8Array(
        iv.length + new Uint8Array(encryptedData).length
      );
      resultArray.set(iv);
      resultArray.set(new Uint8Array(encryptedData), iv.length);
      return btoa(String.fromCharCode(...resultArray));
    } catch (error) {
      console.error('Encryption failed:', error);
      throw error; // Rethrow the error for the caller to handle
    }
  }
}
