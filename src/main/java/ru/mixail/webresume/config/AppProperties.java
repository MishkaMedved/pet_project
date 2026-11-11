package ru.mixail.webresume.config;

import org.springframework.boot.context.properties.ConfigurationProperties;

import java.nio.file.Path;
import java.time.Duration;

@ConfigurationProperties(prefix = "app")
public record AppProperties(Admin admin, Jwt jwt, Path uploadDir) {

    public record Admin(String username, String password) {
    }

    public record Jwt(String secret, Duration ttl) {
    }
}
