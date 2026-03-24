// components/crypto/keyManager.ts
import { Platform } from 'react-native';
import * as Crypto from 'expo-crypto';
import nacl from 'tweetnacl';

// Conditionally load SecureStore (only on native)
let SecureStore: any = null;
if (Platform.OS !== 'web') {
  SecureStore = require('expo-secure-store');
}

const PRIVATE_KEY_STORAGE = 'user_private_key';
const PUBLIC_KEY_STORAGE = 'user_public_key';
const USER_NAME_STORAGE = 'user_display_name';

// Helper: Uint8Array to Base64 (works on web and React Native)
function uint8ArrayToBase64(bytes: Uint8Array): string {
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

// Cross-platform storage getter
async function getItem(key: string): Promise<string | null> {
  if (Platform.OS === 'web') {
    return localStorage.getItem(key);
  } else {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`Failed to get ${key} from SecureStore`, error);
      return null;
    }
  }
}

// Cross-platform storage setter
async function setItem(key: string, value: string): Promise<void> {
  if (Platform.OS === 'web') {
    localStorage.setItem(key, value);
  } else {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`Failed to set ${key} in SecureStore`, error);
    }
  }
}

export async function generateAndStoreKeys() {
  // Generate random seed and key pair
  const seed = await Crypto.getRandomBytesAsync(32);
  const { publicKey, secretKey } = nacl.sign.keyPair.fromSeed(seed);

  // Convert to Base64
  const publicKeyBase64 = uint8ArrayToBase64(publicKey);
  const privateKeyBase64 = uint8ArrayToBase64(secretKey);

  // Store keys
  await setItem(PRIVATE_KEY_STORAGE, privateKeyBase64);
  await setItem(PUBLIC_KEY_STORAGE, publicKeyBase64);

  return { publicKey: publicKeyBase64, privateKey: privateKeyBase64 };
}

export async function getPublicKey(): Promise<string | null> {
  return await getItem(PUBLIC_KEY_STORAGE);
}

export async function getPrivateKey(): Promise<string | null> {
  return await getItem(PRIVATE_KEY_STORAGE);
}

export async function getUserName(): Promise<string | null> {
  return await getItem(USER_NAME_STORAGE);
}

export async function setUserName(name: string): Promise<void> {
  await setItem(USER_NAME_STORAGE, name);
}

export async function keysExist(): Promise<boolean> {
  const pub = await getPublicKey();
  return pub !== null;
}