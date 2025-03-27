package com.hivemind.controller.response;

import lombok.Builder;

@Builder
public record PublicUserResponse(String name, String publicKey) {
}
