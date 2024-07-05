import { encrypt, decrypt } from '../../../src/utils/cryptApiKey';

describe('API Key Encryption and Decryption', () => {
  const apiKey = 'CjEeHtAcSYsL43pcVnWbAr3z6nmVVqvQDtG4SfS7';

  it('should correctly encrypt and decrypt the specified API key', () => {
    const encrypted = encrypt(apiKey);
    const decrypted = decrypt(encrypted);

    expect(decrypted).toBe(apiKey);
    expect(encrypted).not.toBe(apiKey);
    expect(encrypted.split(':').length).toBe(2); // IV:encrypted format
  });

  it('should produce different ciphertexts for the same API key', () => {
    const encrypted1 = encrypt(apiKey);
    const encrypted2 = encrypt(apiKey);

    expect(encrypted1).not.toBe(encrypted2);
    expect(decrypt(encrypted1)).toBe(apiKey);
    expect(decrypt(encrypted2)).toBe(apiKey);
  });
});
