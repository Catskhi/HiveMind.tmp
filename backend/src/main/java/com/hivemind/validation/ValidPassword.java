package com.hivemind.validation;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import java.lang.annotation.*;

@Documented
@Constraint(validatedBy = PasswordValidator.class)
@Target({ ElementType.FIELD, ElementType.PARAMETER })
@Retention(RetentionPolicy.RUNTIME)
public @interface ValidPassword {
    String message() default "Password need at least 8 character, including a capital letter, one number and a especial character.";
    Class<?>[] groups() default {};
    Class<? extends Payload>[] payload() default {};
}
