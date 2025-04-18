package com.hivemind.mapper;

import com.hivemind.controller.request.UserRequest;
import com.hivemind.controller.response.PublicUserResponse;
import com.hivemind.controller.response.UserResponse;
import com.hivemind.entity.User;
import lombok.experimental.UtilityClass;

@UtilityClass
public class UserMapper {

    public static User toUser(UserRequest user) {
        return User.builder()
                .name(user.name())
                .email(user.email())
                .password(user.password())
                .build();
    }

    public static UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .publicKey(user.getPublicKey())
                .privateKey(user.getPrivateKey())
                .build();
    }

    public static PublicUserResponse toPublicUserResponse(User user) {
        return PublicUserResponse.builder()
                .name(user.getName())
                .publicKey(user.getPublicKey())
                .build();
    }
}
