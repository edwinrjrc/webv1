import { Injectable } from '@angular/core';
import { JSEncrypt } from 'jsencrypt';

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
  async encryptData(data: any): Promise<string> {
    if (data === undefined || data === null || data === '') {
      return '';
    }

    try {
      // 2. Tu Llave Pública Real (Debe ser el formato PEM: con las cabeceras BEGIN/END)
      const publicKey = `-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAsBaqxa2tR57S2ZCJgswf
PiaTTI9xVXKa68ulC59jyRiJCqD0Qe76HuFAbekWHUtJvXf1UZEKlN6YwXWp4InB
X874aKF0H093OsNw8qa94ajtRbe4ELxByipiFl0VFz859C0IfsjjvgCESrTg/mUT
eUdpk+dM2+zhV9lpLpetfNBmOhmK3b5GZLnnH7kAWh8HkQM6S4fg9eN496iRQpWZ
brA2iyoHW2ooPWCQkNUhfac6GycgNGwcl1mrwJZuCk5jgXy/DW3zVs5X4F7nBlMd
qMojQzzRdtvILDQIse8PpOVTdkkeXsvTXocjntlLbJrAhClTJIHkE39kuQY77Hi4
OQIDAQAB
-----END PUBLIC KEY-----`;

      // 3. DECLARACIÓN Y ACCIÓN
      let cifradoFinal: string | false = '';

      // Creamos la instancia del encriptador
      const encryptor = new JSEncrypt();

      // Le asignamos tu llave pública
      encryptor.setPublicKey(publicKey);

      // ¡AQUÍ OCURRE EL TRABAJO! Transformamos el dato en el "paquete sellado"
      cifradoFinal = encryptor.encrypt(data.toString());

      // 4. RETORNO SEGURO
      if (cifradoFinal) {
        return cifradoFinal; // Esto devolverá una cadena larga en Base64
      } else {
        throw new Error('No se pudo cifrar el dato, revisa la llave pública.');
      }
    } catch (error) {
      console.error('Error en el proceso de cifrado asimétrico:', error);
      throw error;
    }
  }

  /**
   * 2. SIMÉTRICA: Desencripta la respuesta que viene del Backend
   */
  async decryptData(encryptedData: string): Promise<string> {
    try {
      console.log('Datos cifrados recibidos del Backend:', encryptedData);

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
