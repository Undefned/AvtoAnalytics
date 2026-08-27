package com.avtoanalytics.avtoanalytics.service;

import com.avtoanalytics.avtoanalytics.dto.request.LoginRequest;
import com.avtoanalytics.avtoanalytics.dto.request.RegisterRequest;
import com.avtoanalytics.avtoanalytics.dto.response.JwtResponse;
import com.avtoanalytics.avtoanalytics.entity.User;
import com.avtoanalytics.avtoanalytics.exception.BadRequestException;
import com.avtoanalytics.avtoanalytics.repository.UserRepository;
import com.avtoanalytics.avtoanalytics.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public JwtResponse register(RegisterRequest request) {
        // Проверка, существует ли пользователь
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("User with this email already exists");
        }

        // Создание пользователя
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setFullName(request.getFullName());
        user.setPhone(request.getPhone());
        user.setPrivateSeller(request.isPrivateSeller());
        user.setActive(true);
        user.setRole(User.Role.USER);

        User savedUser = userRepository.save(user);

        // Генерация токена
        String token = jwtTokenProvider.generateToken(savedUser);

        return new JwtResponse(
            token,
            savedUser.getId(),
            savedUser.getEmail(),
            savedUser.getFullName(),
            savedUser.getRole().name()
        );
    }

    public JwtResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);

        User user = (User) authentication.getPrincipal();
        String token = jwtTokenProvider.generateToken(user);

        return new JwtResponse(
            token,
            user.getId(),
            user.getEmail(),
            user.getFullName(),
            user.getRole().name()
        );
    }
}