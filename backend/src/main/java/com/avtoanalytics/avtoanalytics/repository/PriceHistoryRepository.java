package com.avtoanalytics.avtoanalytics.repository;

import com.avtoanalytics.avtoanalytics.entity.Ad;
import com.avtoanalytics.avtoanalytics.entity.PriceHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PriceHistoryRepository extends JpaRepository<PriceHistory, Long> {
    List<PriceHistory> findByAdOrderByRecordedAtAsc(Ad ad);
    List<PriceHistory> findByAd(Ad ad);
}