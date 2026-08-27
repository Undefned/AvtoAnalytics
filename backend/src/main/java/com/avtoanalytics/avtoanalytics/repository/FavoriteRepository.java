package com.avtoanalytics.avtoanalytics.repository;

import com.avtoanalytics.avtoanalytics.entity.Ad;
import com.avtoanalytics.avtoanalytics.entity.Favorite;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FavoriteRepository extends JpaRepository<Favorite, Long> {
    Optional<Favorite> findByUserIdAndAdId(Long userId, Long adId);
    boolean existsByUserIdAndAdId(Long userId, Long adId);

    @Query("SELECT f.ad FROM Favorite f WHERE f.user.id = :userId")
    List<Ad> findAdsByUserId(@Param("userId") Long userId);
}