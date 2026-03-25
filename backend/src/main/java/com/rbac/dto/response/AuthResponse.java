package com.rbac.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Response DTO returned after successful authentication.
 * Contains the JWT token and basic user information.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "Authentication response containing JWT token and user details")
public class AuthResponse {

    @Schema(description = "JWT Bearer token", example = "eyJhbGciOiJIUzI1NiJ9...")
    private String token;

    @Schema(description = "Token type", example = "Bearer")
    private String tokenType;

    @Schema(description = "User ID", example = "1")
    private Long id;

    @Schema(description = "User full name", example = "Jane Doe")
    private String name;

    @Schema(description = "User email", example = "jane@example.com")
    private String email;

    @Schema(description = "User role", example = "USER")
    private String role;
}
