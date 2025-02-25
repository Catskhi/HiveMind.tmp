package com.hivemind.controller.request;

import com.hivemind.validation.ValidPassword;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UserRequest(

        @NotBlank(message = "Username is required.")
        @Size(min = 3, max = 75, message = "The username must be between 3 and 75 characters")
        String name,

        @Email
        @NotBlank(message = "Email is required.")
        String email,

        @NotBlank(message = "Password is required.")
        @ValidPassword
        String password) {
}
