package com.rbac.config;

import io.swagger.v3.oas.annotations.OpenAPIDefinition;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeIn;
import io.swagger.v3.oas.annotations.enums.SecuritySchemeType;
import io.swagger.v3.oas.annotations.info.Contact;
import io.swagger.v3.oas.annotations.info.Info;
import io.swagger.v3.oas.annotations.info.License;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.security.SecurityScheme;
import io.swagger.v3.oas.annotations.servers.Server;
import org.springframework.context.annotation.Configuration;

/**
 * OpenAPI / Swagger UI configuration.
 * - Defines API metadata
 * - Registers JWT Bearer auth scheme so Swagger UI can send authenticated requests
 */
@Configuration
@OpenAPIDefinition(
    info = @Info(
        title = "RBAC Authentication API",
        version = "1.0.0",
        description = "Full Stack Authentication and Role-Based Access Control System",
        contact = @Contact(
            name = "RBAC System",
            email = "admin@rbac.com"
        ),
        license = @License(name = "MIT")
    ),
    servers = {
        @Server(url = "http://localhost:8080", description = "Local Development Server")
    },
    security = @SecurityRequirement(name = "bearerAuth")
)
@SecurityScheme(
    name = "bearerAuth",
    description = "JWT Bearer token. Obtain it from /api/auth/login, then click 'Authorize' and enter: Bearer <token>",
    scheme = "bearer",
    type = SecuritySchemeType.HTTP,
    bearerFormat = "JWT",
    in = SecuritySchemeIn.HEADER
)
public class OpenApiConfig {
    // Config provided entirely through annotations
}
