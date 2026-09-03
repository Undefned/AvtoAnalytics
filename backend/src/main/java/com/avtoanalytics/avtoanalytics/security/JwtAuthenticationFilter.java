package com.avtoanalytics.avtoanalytics.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getServletPath();

        // Публичные эндпоинты — пропускаем без токена
        return path.startsWith("/api/auth/")
                || path.startsWith("/api/ads/")
                || path.startsWith("/api/cars/")
                || path.startsWith("/api/analytics/")
                || path.startsWith("/api/compare/")
                || path.startsWith("/swagger-ui/")
                || path.equals("/swagger-ui.html")
                || path.startsWith("/v3/api-docs/")
                || path.startsWith("/swagger-resources/")
                || path.startsWith("/webjars/");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain
    ) throws ServletException, IOException {

        String header = request.getHeader(HttpHeaders.AUTHORIZATION);
        log.debug("Authorization header: {}", header != null ? "present" : "missing");

        if (header == null || !header.startsWith("Bearer ")) {
            log.debug("No Bearer token found");
            chain.doFilter(request, response);
            return;
        }

        String token = header.substring("Bearer ".length()).trim();

        if (token.isEmpty()) {
            log.debug("Empty token");
            chain.doFilter(request, response);
            return;
        }

        try {
            if (jwtTokenProvider.validateToken(token)) {
                JwtTokenProvider.JwtPayload payload = jwtTokenProvider.parse(token);
                log.debug("Parsed token for user: {}, role: {}", payload.email(), payload.role());

                UserDetails userDetails = userDetailsService.loadUserByUsername(payload.email());

                var auth = new UsernamePasswordAuthenticationToken(
                    userDetails,
                    null,
                    userDetails.getAuthorities()
            );
            SecurityContextHolder.getContext().setAuthentication(auth);
                log.debug("Authentication set in SecurityContext");
            }
        } catch (Exception e) {
            log.error("Failed to parse token: {}", e.getMessage());
            // Токен не валиден — пропускаем без аутентификации
        }

        chain.doFilter(request, response);
    }
}