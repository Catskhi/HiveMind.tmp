package com.hivemind.mapper;

import com.hivemind.controller.response.ContactResponse;
import com.hivemind.entity.Contact;

public class ContactMapper {

    public static ContactResponse toContactResponse(Contact contact) {
        return ContactResponse.builder()
                .contact(UserMapper.toPublicUserResponse(contact.getContact()))
                .lastMessageAt(contact.getLastMessageAt())
                .build();
    }
}
