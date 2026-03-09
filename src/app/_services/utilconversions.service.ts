import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilconversionsService {
  // Llave pública RSA proporcionada por el Backend (formato SPKI Base64)
  private readonly publicKeyPem = `MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA...`;

  // "Chapa" para desencriptar la respuesta simétrica del Backend
  private readonly chapaSimetrica = 'P@s$W0(Contr3n@)';

  constructor() {}

  /**
   * 1. ASIMÉTRICA: Encripta datos para enviar al Backend
   */
  async encryptData(data: string): Promise<string> {
    const encoder = new TextEncoder();
    const dataBuffer = encoder.encode(data);

    const keyBuffer = this.str2ab(atob(this.publicKeyPem));
    const publicKey = await crypto.subtle.importKey(
      'spki',
      keyBuffer,
      { name: 'RSA-OAEP', hash: 'SHA-256' },
      true,
      ['encrypt'],
    );

    const encrypted = await crypto.subtle.encrypt(
      { name: 'RSA-OAEP' },
      publicKey,
      dataBuffer,
    );
    return btoa(String.fromCharCode(...new Uint8Array(encrypted)));
  }

  /**
   * 2. SIMÉTRICA: Desencripta la respuesta que viene del Backend
   */
  async decryptData(encryptedData: string): Promise<string> {
    try {
      const dataBuffer = Uint8Array.from(atob(encryptedData), (c) =>
        c.charCodeAt(0),
      );
      const iv = dataBuffer.slice(0, 12);
      const encryptedContent = dataBuffer.slice(12);

      const keyBuffer = await crypto.subtle.importKey(
        'raw',
        new TextEncoder().encode(this.chapaSimetrica),
        { name: 'AES-GCM' },
        true,
        ['decrypt'],
      );

      const decryptedData = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        keyBuffer,
        encryptedContent,
      );
      return new TextDecoder().decode(decryptedData);
    } catch (error) {
      console.error('Error al desencriptar respuesta simétrica:', error);
      throw error;
    }
  }

  private str2ab(str: string) {
    const buf = new ArrayBuffer(str.length);
    const bufView = new Uint8Array(buf);
    for (let i = 0; i < str.length; i++) bufView[i] = str.charCodeAt(i);
    return buf;
  }
}
