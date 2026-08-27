package com.avtoanalytics.avtoanalytics.service;

import com.avtoanalytics.avtoanalytics.dto.response.CarResponse;
import com.avtoanalytics.avtoanalytics.entity.Ad;
import com.avtoanalytics.avtoanalytics.repository.AdRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ComparisonService {

    private final AdRepository adRepository;
    private final CarService carService;

    public List<CarResponse> compareCars(List<Long> adIds) {
        List<CarResponse> result = new ArrayList<>();

        for (Long adId : adIds) {
            Ad ad = adRepository.findById(adId)
                .orElseThrow(() -> new RuntimeException("Ad not found: " + adId));
            result.add(carService.getCarResponseById(ad.getCar().getId()));
        }

        return result;
    }
}