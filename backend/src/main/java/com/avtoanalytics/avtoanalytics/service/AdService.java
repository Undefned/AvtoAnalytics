package com.avtoanalytics.avtoanalytics.service;

import com.avtoanalytics.avtoanalytics.dto.request.CreateAdRequest;
import com.avtoanalytics.avtoanalytics.dto.response.AdResponse;
import com.avtoanalytics.avtoanalytics.entity.Ad;
import com.avtoanalytics.avtoanalytics.entity.Car;
import com.avtoanalytics.avtoanalytics.entity.PriceHistory;
import com.avtoanalytics.avtoanalytics.entity.User;
import com.avtoanalytics.avtoanalytics.exception.ResourceNotFoundException;
import com.avtoanalytics.avtoanalytics.repository.AdRepository;
import com.avtoanalytics.avtoanalytics.repository.CarRepository;
import com.avtoanalytics.avtoanalytics.repository.PriceHistoryRepository;
import com.avtoanalytics.avtoanalytics.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import jakarta.persistence.criteria.Predicate;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AdService {

    private final AdRepository adRepository;
    private final CarRepository carRepository;
    private final UserRepository userRepository;
    private final PriceHistoryRepository priceHistoryRepository;

    // ===== GET ALL ADS =====
    public Page<AdResponse> getAllAds(String city, String status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Specification<Ad> spec = buildSpecification(city, status);
        Page<Ad> adPage = adRepository.findAll(spec, pageable);
        return adPage.map(this::convertToResponse);
    }

    // ===== GET AD BY ID =====
    public Ad getAdById(Long id) {
        return adRepository.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Ad not found with id: " + id));
    }

    // ===== GET AD RESPONSE =====
    public AdResponse getAdResponseById(Long id) {
        Ad ad = getAdById(id);
        return convertToResponse(ad);
    }

    // ===== CREATE AD =====
    @Transactional
    public AdResponse createAd(CreateAdRequest request, Long userId) {
        User seller = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        Car car = carRepository.findById(request.getCarId())
            .orElseThrow(() -> new ResourceNotFoundException("Car not found with id: " + request.getCarId()));

        Ad ad = new Ad();
        ad.setSeller(seller);
        ad.setCar(car);
        ad.setTitle(request.getTitle());
        ad.setDescription(request.getDescription());
        ad.setPrice(request.getPrice());
        ad.setMileage(request.getMileage());
        ad.setCity(request.getCity());
        ad.setAddress(request.getAddress());
        ad.setPhotoUrls(request.getPhotoUrls());
        ad.setStatus(Ad.Status.ACTIVE);
        ad.setViews(0);

        Ad savedAd = adRepository.save(ad);

        PriceHistory priceHistory = new PriceHistory();
        priceHistory.setAd(savedAd);
        priceHistory.setPrice(savedAd.getPrice());
        priceHistory.setRecordedAt(LocalDateTime.now());
        priceHistoryRepository.save(priceHistory);

        return convertToResponse(savedAd);
    }

    // ===== UPDATE AD =====
    @Transactional
    public AdResponse updateAd(Long id, CreateAdRequest request, Long userId) {
        Ad ad = getAdById(id);

        if (!ad.getSeller().getId().equals(userId)) {
            throw new RuntimeException("You are not the owner of this ad");
        }

        ad.setTitle(request.getTitle());
        ad.setDescription(request.getDescription());
        ad.setMileage(request.getMileage());
        ad.setCity(request.getCity());
        ad.setAddress(request.getAddress());
        ad.setPhotoUrls(request.getPhotoUrls());

        if (request.getPrice().compareTo(ad.getPrice()) != 0) {
            PriceHistory priceHistory = new PriceHistory();
            priceHistory.setAd(ad);
            priceHistory.setPrice(request.getPrice());
            priceHistory.setRecordedAt(LocalDateTime.now());
            priceHistoryRepository.save(priceHistory);
            ad.setPrice(request.getPrice());
        }

        Ad updatedAd = adRepository.save(ad);
        return convertToResponse(updatedAd);
    }

    // ===== DELETE AD =====
    @Transactional
    public void deleteAd(Long id, Long userId) {
        Ad ad = getAdById(id);
        if (!ad.getSeller().getId().equals(userId)) {
            throw new RuntimeException("You are not the owner of this ad");
        }
        ad.setStatus(Ad.Status.ARCHIVED);
        adRepository.save(ad);
    }

    // ===== GET ADS BY SELLER =====
    public List<Ad> getAdsBySeller(Long userId) {
        User seller = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));
        return adRepository.findBySeller(seller);
    }

    // ===== UPDATE VIEWS =====
    @Transactional
    public void incrementViews(Long id) {
        Ad ad = getAdById(id);
        ad.setViews(ad.getViews() + 1);
        adRepository.save(ad);
    }

    // ===== SPECIFICATION =====
    private Specification<Ad> buildSpecification(String city, String status) {
        return (root, query, criteriaBuilder) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (city != null && !city.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("city"), city));
            }

            if (status != null && !status.isEmpty()) {
                predicates.add(criteriaBuilder.equal(root.get("status"), Ad.Status.valueOf(status)));
            }

            return criteriaBuilder.and(predicates.toArray(new Predicate[0]));
        };
    }

    public AdResponse convertToResponse(Ad ad) {
        AdResponse response = new AdResponse();
        response.setId(ad.getId());
        response.setTitle(ad.getTitle());
        response.setDescription(ad.getDescription());
        response.setPrice(ad.getPrice());
        response.setMileage(ad.getMileage());
        response.setCity(ad.getCity());
        response.setAddress(ad.getAddress());
        response.setStatus(ad.getStatus().name());
        response.setViews(ad.getViews());
        response.setPhotoUrls(ad.getPhotoUrls());
        response.setCreatedAt(ad.getCreatedAt());

        // Seller info
        if (ad.getSeller() != null) {
            response.setSellerId(ad.getSeller().getId());
            response.setSellerName(ad.getSeller().getFullName());
            response.setPrivateSeller(ad.getSeller().isPrivateSeller());
            response.setSellerAvatar(ad.getSeller().getAvatarUrl());
            response.setSellerSince(ad.getSeller().getCreatedAt());
        }

        // Car info
        if (ad.getCar() != null) {
            response.setCarId(ad.getCar().getId());
            response.setCarMake(ad.getCar().getMake());
            response.setCarModel(ad.getCar().getModel());
            response.setCarYear(ad.getCar().getYear());
            
            response.setEngineVolume(ad.getCar().getEngineVolume());
            response.setHorsepower(ad.getCar().getHorsepower());
            if (ad.getCar().getTransmission() != null) {
                response.setTransmission(ad.getCar().getTransmission().name());
            }
            if (ad.getCar().getDriveType() != null) {
                response.setDriveType(ad.getCar().getDriveType().name());
            }
            if (ad.getCar().getBodyType() != null) {
                response.setBodyType(ad.getCar().getBodyType().name());
            }
        }

        return response;
    }
}