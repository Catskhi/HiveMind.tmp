package com.hivemind.controller.response;

import lombok.Builder;

@Builder
public record GlobalMessageResponse(String username, String message, String timestamp) {
}
