package com.eventcraft.EventCraft.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.client.RestTemplate;

<<<<<<< HEAD
/**
 * Application configuration class
 * Defines common beans used across the application
 */
@Configuration
public class AppConfig {

    /**
     * RestTemplate bean for making HTTP requests
     * Used for external API calls (e.g., Google Gemini API)
     * @return RestTemplate instance
     */
=======
@Configuration
public class AppConfig {

>>>>>>> 42ef6a0c448ed3252c41770b1af0e6e95107e0f9
    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
