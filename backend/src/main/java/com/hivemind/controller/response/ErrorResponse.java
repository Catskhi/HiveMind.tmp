package com.hivemind.controller.response;

import lombok.Builder;

@Builder
public record ErrorResponse(String error, String message) {
}
