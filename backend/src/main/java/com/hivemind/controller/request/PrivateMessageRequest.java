package com.hivemind.controller.request;

import jakarta.validation.constraints.Size;

public record PrivateMessageRequest(
        String recipient,
        String encryptedKeySender,
        String encryptedKeyRecipient,
        @Size(max = 500, message = "Message must not exceed 500 characters")
        String encryptedMessage,
        String iv) {
}
