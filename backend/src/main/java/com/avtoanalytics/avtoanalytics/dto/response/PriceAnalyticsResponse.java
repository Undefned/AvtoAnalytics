package com.avtoanalytics.avtoanalytics.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.Map;

@Data
public class PriceAnalyticsResponse {
    private Long adId;
    private BigDecimal currentPrice;
    private BigDecimal averagePrice;
    private BigDecimal priceDifference;
    private boolean aboveAverage;
    private Map<LocalDateTime, BigDecimal> priceHistory;
}