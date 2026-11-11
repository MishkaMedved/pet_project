package ru.mixail.webresume;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.context.properties.ConfigurationPropertiesScan;

@SpringBootApplication
@ConfigurationPropertiesScan
public class WebResumeApplication {

    public static void main(String[] args) {
        SpringApplication.run(WebResumeApplication.class, args);
    }

}
