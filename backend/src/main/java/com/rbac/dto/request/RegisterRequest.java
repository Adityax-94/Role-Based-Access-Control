package com.rbac.dto.request;

import com.rbac.entity.Role;
import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO for incoming registration requests.
 * Bean Validation annotations enforce input constraints.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Payload for user registration")
public class RegisterRequest {

    @NotBlank(message = "Name is required")
    @Size(min = 2, max = 60, message = "Name must be between 2 and 60 characters")
    @Schema(description = "Full name of the user", example = "Jane Doe")
    private String name;

    @NotBlank(message = "Email is required")
    @Email(message = "Must be a valid email address")
    @Schema(description = "Unique email address", example = "jane@example.com")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 8, message = "Password must be at least 8 characters")
    @Pattern(
        regexp = "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).*$",
        message = "Password must contain at least one uppercase letter, one lowercase letter, and one digit"
    )
    @Schema(description = "Password (min 8 chars, upper, lower, digit)", example = "Secret@123")
    private String password;

    @NotNull(message = "Role is required")
    @Schema(description = "User role: USER or ADMIN", example = "USER")
    private Role role;
}
