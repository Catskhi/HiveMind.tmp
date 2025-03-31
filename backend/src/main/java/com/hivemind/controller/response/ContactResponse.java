package com.hivemind.controller.response;

import lombok.Builder;

import java.time.ZonedDateTime;

@Builder
public record ContactResponse (PublicUserResponse contact, int unreadMessagesCount, ZonedDateTime lastMessageAt) {
}
