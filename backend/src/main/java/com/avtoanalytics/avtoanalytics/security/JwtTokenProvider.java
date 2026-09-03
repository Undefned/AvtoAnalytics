package com.avtoanalytics.avtoanalytics.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.time.Instant;
import java.util.Date;

@Component
public class JwtTokenProvider {

    private final SecretKey key;
    private final long expiration;

    public JwtTokenProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration}") long expiration
    ) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expiration = expiration;
    }

    // ✅ subject = userId (Long), а email идёт в claim
    public String generateToken(Long userId, String email, String fullName, Role role) {
        Instant now = Instant.now();
        Instant exp = now.plusMillis(expiration);

        return Jwts.builder()
                .subject(userId.toString())              // ← userId в subject
                .claim("email", email)                  // ← email в claim
                .claim("fullName", fullName)
                .claim("role", role.name())
                .issuedAt(Date.from(now))
                .expiration(Date.from(exp))
                .signWith(key)
                .compact();
    }

    public JwtPayload parse(String token) {
        var claims = Jwts.parser()
                .verifyWith(key)
                .build()
                .parseSignedClaims(token)
                .getPayload();

        long userId = Long.parseLong(claims.getSubject());  // ← userId из subject
        String email = claims.get("email", String.class);
        String fullName = claims.get("fullName", String.class);
        Role role = Role.valueOf(claims.get("role", String.class));

        return new JwtPayload(userId, email, fullName, role);
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(token);
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String getEmailFromToken(String token) {
        return parse(token).email();
    }

    public Long getUserIdFromToken(String token) {
        return parse(token).userId();   // ← теперь возвращает Long
    }

    public record JwtPayload(long userId, String email, String fullName, Role role) {}
}