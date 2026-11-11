package ru.mixail.webresume.security;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import ru.mixail.webresume.config.AppProperties;

/**
 * Creates the admin account from configuration on the first start.
 * Later password changes are made from the admin panel and stored in the database.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class AdminUserInitializer implements ApplicationRunner {

    private final AdminUserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final AppProperties properties;

    @Override
    public void run(ApplicationArguments args) {
        if (repository.count() > 0) {
            return;
        }
        AppProperties.Admin admin = properties.admin();
        repository.save(new AdminUser(admin.username(), passwordEncoder.encode(admin.password())));
        log.info("Created admin user '{}'", admin.username());
    }
}
