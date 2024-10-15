import { keys } from '@libp2p/crypto';
import { openDB } from 'idb';
import { Buffer } from 'buffer';

async function getDB() {
    return openDB('boxpeerKeys', 1, {
        upgrade(db) {
            db.createObjectStore('keys')
        },
    });
}

async function saveKey(privateKeyHex: string) {
    const db = getDB();
    (await db).put('keys', privateKeyHex, 'pKey');
}

async function loadKey() {
    const db = getDB();
    return (await db).get('keys', 'pKey');
}

export async function getPrivateKey() {
    let privateKey;
    try {
      const privateKeyHex = await loadKey();
      if (privateKeyHex) {
        const privateKeyBuffer = Buffer.from(privateKeyHex, 'hex');
        privateKey = await keys.privateKeyFromProtobuf(privateKeyBuffer);
      } else {

        // Generate a new private key if none exists
        const keyPair = await keys.generateKeyPair('Ed25519');
        console.log("KeyPair ",keyPair)
        privateKey = keyPair;

        const privateKeyHex = Buffer.from(privateKey.raw).toString('hex');
        await saveKey(privateKeyHex);
      }

      return privateKey;
    } catch (error: any) {
      console.error("Error getting private key:", error);
      throw new Error("Failed to retrieve or generate a private key.");
    }
  }
