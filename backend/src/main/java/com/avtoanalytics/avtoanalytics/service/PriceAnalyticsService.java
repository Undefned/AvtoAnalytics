package com.avtoanalytics.avtoanalytics.service;

import com.avtoanalytics.avtoanalytics.dto.response.PriceAnalyticsResponse;
import com.avtoanalytics.avtoanalytics.entity.Ad;
import com.avtoanalytics.avtoanalytics.entity.PriceHistory;
import com.avtoanalytics.avtoanalytics.repository.AdRepository;
import com.avtoanalytics.avtoanalytics.repository.PriceHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class PriceAnalyticsService {

    private final AdRepository adRepository;
    private final PriceHistoryRepository priceHistoryRepository;
    private final AdService adService;

    public PriceAnalyticsResponse getAnalyticsForAd(Long adId) {
        Ad ad = adService.getAdById(adId);

        PriceAnalyticsResponse response = new PriceAnalyticsResponse();
        response.setAdId(adId);
        response.setCurrentPrice(ad.getPrice());

        // 1. Средняя цена по модели
        Double averagePrice = adRepository.findAveragePriceByCarId(ad.getCar().getId());
        if (averagePrice != null) {
            response.setAveragePrice(BigDecimal.valueOf(averagePrice).setScale(2, RoundingMode.HALF_UP));
            BigDecimal diff = ad.getPrice().subtract(response.getAveragePrice());
            response.setPriceDifference(diff);
            response.setAboveAverage(diff.compareTo(BigDecimal.ZERO) > 0);
        }

        // 2. История цены
        List<PriceHistory> history = priceHistoryRepository.findByAd(ad);
        Map<LocalDateTime, BigDecimal> priceHistoryMap = new HashMap<>();
        for (PriceHistory ph : history) {
            priceHistoryMap.put(ph.getRecordedAt(), ph.getPrice());
        }
        response.setPriceHistory(priceHistoryMap);

        // 3. Количество активных объявлений этой модели
        // (можно добавить)

        return response;
    }

    public Double getAveragePriceByCarId(Long carId) {
        return adRepository.findAveragePriceByCarId(carId);
    }
}