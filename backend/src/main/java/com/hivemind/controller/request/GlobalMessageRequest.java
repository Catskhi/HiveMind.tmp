package com.hivemind.controller.request;

import jakarta.validation.constraints.Size;

public record GlobalMessageRequest(
        @Size(max = 500, message = "Message must not exceed 500 characters")
        String message) {
}
