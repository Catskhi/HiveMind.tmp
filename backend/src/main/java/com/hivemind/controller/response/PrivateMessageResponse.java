package com.hivemind.controller.response;

public record PrivateMessageResponse(
        String sender,
        String encryptedKeySender,
        String recipient,
        String encryptedKeyRecipient,
        String iv,
        String encryptedMessage,
        String timestamp
) {}
