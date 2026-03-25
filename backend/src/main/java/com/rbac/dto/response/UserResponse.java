package com.rbac.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * Response DTO exposing safe user information (never exposes password).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "User profile information")
public class UserResponse {

    @Schema(description = "User ID", example = "1")
    private Long id;

    @Schema(description = "Full name", example = "Jane Doe")
    private String name;

    @Schema(description = "Email address", example = "jane@example.com")
    private String email;

    @Schema(description = "Assigned role", example = "USER")
    private String role;

    @Schema(description = "Account creation timestamp")
    private LocalDateTime createdAt;
}
