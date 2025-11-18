package com.eventcraft.EventCraft.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

<<<<<<< HEAD
/**
 * Security configuration for EventCraft application
 * Configures Spring Security settings including password encoding and HTTP security
 */
=======
>>>>>>> 42ef6a0c448ed3252c41770b1af0e6e95107e0f9
@Configuration
@EnableWebSecurity
public class SecurityConfig {

<<<<<<< HEAD
    /**
     * Bean for password encoding using BCrypt
     * @return BCryptPasswordEncoder instance
     */
=======
>>>>>>> 42ef6a0c448ed3252c41770b1af0e6e95107e0f9
    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

<<<<<<< HEAD
    /**
     * Configures HTTP security filter chain
     * Currently allows all requests without authentication
     * @param http HttpSecurity instance
     * @return Configured SecurityFilterChain
     * @throws Exception if configuration fails
     */
=======
>>>>>>> 42ef6a0c448ed3252c41770b1af0e6e95107e0f9
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authz -> authz
                .anyRequest().permitAll()
            );
        
        return http.build();
    }
}