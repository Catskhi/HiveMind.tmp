package com.hivemind.controller.request;

public record PrivateMessageRequest(String recipient, String encryptedKeySender, String encryptedKeyRecipient, String encryptedMessage, String iv) {
}
