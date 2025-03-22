package com.hivemind.controller.response;

public record PrivateChatMessage(String sender, String recipient, String message, String timestamp) {}