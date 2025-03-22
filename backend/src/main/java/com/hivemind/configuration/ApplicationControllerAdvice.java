package com.hivemind.configuration;

import com.hivemind.controller.response.ErrorResponse;
import com.hivemind.exception.DuplicateEntryException;
import com.hivemind.exception.InvalidUsernameOrPasswordException;
import com.hivemind.exception.UserNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class ApplicationControllerAdvice {

    @ExceptionHandler(DuplicateEntryException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse alreadyExistsException(DuplicateEntryException exception) {
        return new ErrorResponse("Duplicated entry", exception.getMessage());
    }

    @ExceptionHandler(InvalidUsernameOrPasswordException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleInvalidUsernameOrPasswordException(InvalidUsernameOrPasswordException exception) {
        return new ErrorResponse("Invalid Credentials", exception.getMessage());
    }

    @ExceptionHandler(UserNotFoundException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public ErrorResponse handleUserNotFound(UserNotFoundException exception) {
        return new ErrorResponse("User not found", exception.getMessage());
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    public Map<String, String> handleArgumentNotValidException(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new HashMap<>();
        exception.getBindingResult().getAllErrors().forEach((error) -> {
            errors.put(((FieldError) error).getField(), error.getDefaultMessage());
        });
        return errors;
    }
}
