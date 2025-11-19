package com.evaluacion.productosapi.configuration;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
 
@Configuration
public class SecurityConfig {
 
	@Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable()) // desactiva CSRF en general para simplificar
            .authorizeHttpRequests(auth -> auth
                .anyRequest().permitAll() // TODO: luego puedes cambiar a authenticated()
            )
            .headers(headers -> headers
                .frameOptions(frame -> frame.sameOrigin()) // necesario para H2
            );

        return http.build();
    }
}