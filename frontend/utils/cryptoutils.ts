interface EncryptedPayload {
    encryptedMessage: string;
    encryptedKeySender: string;
    encryptedKeyRecipient: string;
    iv: string;
    signature?: string;
}  

// This converts ArrayBuffer to Base64
export const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
    const bytes = new Uint8Array(buffer)
    return btoa(String.fromCharCode(... bytes));
}

// This converts Base64 to ArrayBuffer
export const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length)
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
}

export const importPublicKey = async (base64PublicKey: string): Promise<CryptoKey> => {
    const publicKeyBuffer = base64ToArrayBuffer(base64PublicKey);
    return await crypto.subtle.importKey(
        "spki",
        publicKeyBuffer,
        { name: "RSA-OAEP", hash: "SHA-256" },
        true,
        ["encrypt"]
    )
}


export const encryptMessage = async (
    message: string,
    senderPublicKeyBase64: string,
    recipientPublicKeyBase64: string
): Promise<EncryptedPayload> => {
    try {

        const senderPublicKey = await importPublicKey(senderPublicKeyBase64);
        const recipientPublicKey = await importPublicKey(recipientPublicKeyBase64);

        const aesKey = await crypto.subtle.generateKey(
            { name: 'AES-GCM', length: 256 },
            true,
            ["encrypt", "decrypt"]
        )

        const encoder = new TextEncoder()
        const encodedMessage = encoder.encode(message)

        const iv = crypto.getRandomValues(new Uint8Array(12));

        const encryptedMessage = await crypto.subtle.encrypt(
            { name: "AES-GCM", iv },
            aesKey,
            encodedMessage
        );

        const rawAesKey = await crypto.subtle.exportKey("raw", aesKey)

        const encryptedKeySender = await crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            senderPublicKey,
            rawAesKey
        );

        const encryptedKeyReceiver = await crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            recipientPublicKey,
            rawAesKey
        );

        return {
            encryptedMessage: arrayBufferToBase64(encryptedMessage),
            encryptedKeySender: arrayBufferToBase64(encryptedKeySender),
            encryptedKeyRecipient: arrayBufferToBase64(encryptedKeyReceiver),
            iv: arrayBufferToBase64(iv.buffer)
        }
    } catch (error) {
        console.error("An error occurred on encryption: ", error);
        throw error;
    }
}

export const decryptMessage = async (
    encryptedMessageBase64: string,
    encryptedKeyBase64: string,
    ivBase64: string,
    privateKeyString: string
): Promise<string> => {
    try {
        const privateKey = await crypto.subtle.importKey(
            "pkcs8",
            base64ToArrayBuffer(privateKeyString),
            { name: "RSA-OAEP", hash: "SHA-256" },
            true,
            ["decrypt"]
        );
        const encryptedMessage = base64ToArrayBuffer(encryptedMessageBase64);
        const encryptedKey = base64ToArrayBuffer(encryptedKeyBase64);
        const iv = base64ToArrayBuffer(ivBase64);

        const aesKeyBuffer = await crypto.subtle.decrypt(
            { name: "RSA-OAEP" },
            privateKey,
            encryptedKey
        )

        const aesKey = await crypto.subtle.importKey(
            "raw",
            aesKeyBuffer,
            { name: "AES-GCM" },
            true,
            ["decrypt"]
        )

        const decrypted = await crypto.subtle.decrypt(
            { name: "AES-GCM", iv },
            aesKey,
            encryptedMessage
        )

        return new TextDecoder().decode(decrypted)
    } catch (error) {
        console.error("An error occurred on decryption: " + error);
        throw error;
    }
}

export const verifyPrivateKey = async (
    privateKeyBase64: string,
    publicKeyBase64: string
): Promise<boolean> => {
    try {
        const publicKey = await importPublicKey(publicKeyBase64);
        const privateKey = await crypto.subtle.importKey(
            'pkcs8',
            base64ToArrayBuffer(privateKeyBase64),
            { name: 'RSA-OAEP', hash: 'SHA-256' },
            true,
            ["decrypt"]
        );
        const testData = crypto.getRandomValues(new Uint8Array(190));
        const encrypted = await crypto.subtle.encrypt(
            { name: "RSA-OAEP" },
            publicKey,
            testData
        );
        const decrypted = await crypto.subtle.decrypt(
            { name: "RSA-OAEP" },
            privateKey,
            encrypted
        );
        return arrayBufferToBase64(testData) === arrayBufferToBase64(decrypted);
    } catch (error) {
        console.error("Private key verification failed:", error);
        return false;
    }
}