package com.rbac.controller;

import com.rbac.dto.response.ApiResponse;
import com.rbac.dto.response.UserResponse;
import com.rbac.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

/**
 * Demonstrates RBAC endpoint access rules:
 *
 *   GET /api/public   → anyone (no token required)
 *   GET /api/user     → USER role OR ADMIN role
 *   GET /api/admin    → ADMIN role only
 *
 * Additional endpoints are provided for richer dashboard data.
 */
@RestController
@RequiredArgsConstructor
@Tag(name = "Resources", description = "Role-protected content endpoints")
public class ResourceController {

    private final AuthService authService;

    // ─────────────────────────────────────────────
    // PUBLIC  — no authentication required
    // ─────────────────────────────────────────────

    @GetMapping("/api/public")
    @Operation(summary = "Public content", description = "Accessible by anyone without a token")
    public ResponseEntity<ApiResponse<Map<String, String>>> publicContent() {
        return ResponseEntity.ok(ApiResponse.success(
                "Public content retrieved",
                Map.of(
                    "message", "Welcome! This is publicly accessible content.",
                    "info",    "No authentication is required to see this."
                )
        ));
    }

    // ─────────────────────────────────────────────
    // USER  — USER or ADMIN role required
    // ─────────────────────────────────────────────

    @GetMapping("/api/user")
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "User content", description = "Accessible by USER and ADMIN roles")
    public ResponseEntity<ApiResponse<Map<String, Object>>> userContent(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(ApiResponse.success(
                "User content retrieved",
                Map.of(
                    "message",  "Hello, " + userDetails.getUsername() + "! This is user-level content.",
                    "features", List.of(
                        "View your profile",
                        "Browse available items",
                        "Submit requests"
                    ),
                    "accessLevel", "USER"
                )
        ));
    }

    // ─────────────────────────────────────────────
    // ADMIN — ADMIN role only
    // ─────────────────────────────────────────────

    @GetMapping("/api/admin")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Admin content", description = "Accessible by ADMIN role only")
    public ResponseEntity<ApiResponse<Map<String, Object>>> adminContent(
            @AuthenticationPrincipal UserDetails userDetails) {

        return ResponseEntity.ok(ApiResponse.success(
                "Admin content retrieved",
                Map.of(
                    "message",     "Welcome, Admin " + userDetails.getUsername() + "!",
                    "permissions", List.of(
                        "Manage all users",
                        "View system analytics",
                        "Configure roles and permissions",
                        "Access audit logs"
                    ),
                    "accessLevel", "ADMIN",
                    "warning",     "This area contains sensitive system information."
                )
        ));
    }

    // ─────────────────────────────────────────────
    // ADMIN — list all users
    // ─────────────────────────────────────────────

    @GetMapping("/api/admin/users")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "List all users", description = "Returns all registered users — ADMIN only")
    public ResponseEntity<ApiResponse<List<UserResponse>>> getAllUsers() {
        List<UserResponse> users = authService.getAllUsers();
        return ResponseEntity.ok(ApiResponse.success("Users retrieved", users));
    }
}
