package com.avtoanalytics.avtoanalytics.service;

import com.avtoanalytics.avtoanalytics.entity.Ad;
import com.avtoanalytics.avtoanalytics.entity.Favorite;
import com.avtoanalytics.avtoanalytics.entity.User;
import com.avtoanalytics.avtoanalytics.exception.BadRequestException;
import com.avtoanalytics.avtoanalytics.exception.ResourceNotFoundException;
import com.avtoanalytics.avtoanalytics.repository.AdRepository;
import com.avtoanalytics.avtoanalytics.repository.FavoriteRepository;
import com.avtoanalytics.avtoanalytics.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final AdRepository adRepository;
    private final FavoriteRepository favoriteRepository;

    public User getUserById(Long id) {
        return userRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));
    }

    public User getCurrentUser(Long userId) {
        return getUserById(userId);
    }

    @Transactional
    public User updateUser(Long userId, User updatedUser) {
        User user = getUserById(userId);
        user.setFullName(updatedUser.getFullName());
        user.setPrivateSeller(updatedUser.isPrivateSeller());
        return userRepository.save(user);
    }

    // ===== FAVORITES =====
    @Transactional
    public void addFavorite(Long userId, Long adId) {
        // ✅ Проверяем, что userId и adId не null
        if (userId == null) {
            throw new BadRequestException("User ID cannot be null");
        }
        if (adId == null) {
            throw new BadRequestException("Ad ID cannot be null");
        }
        
        User user = getUserById(userId);
        Ad ad = adRepository.findById(adId)
            .orElseThrow(() -> new ResourceNotFoundException("Ad not found with id: " + adId));
        
        // Проверка: уже в избранном?
        if (favoriteRepository.existsByUserIdAndAdId(userId, adId)) {
            throw new BadRequestException("Ad already in favorites");
        }
        
        Favorite favorite = new Favorite();
        favorite.setUser(user);
        favorite.setAd(ad);
        favoriteRepository.save(favorite);
    }

    @Transactional
    public void removeFavorite(Long userId, Long adId) {
        Favorite favorite = favoriteRepository.findByUserIdAndAdId(userId, adId)
            .orElseThrow(() -> new ResourceNotFoundException("Favorite not found"));
        favoriteRepository.delete(favorite);
    }

    public List<Ad> getFavorites(Long userId) {
        return favoriteRepository.findAdsByUserId(userId);
    }

    public boolean isFavorite(Long userId, Long adId) {
        return favoriteRepository.existsByUserIdAndAdId(userId, adId);
    }
}