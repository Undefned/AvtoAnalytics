package com.avtoanalytics.avtoanalytics.repository;

import com.avtoanalytics.avtoanalytics.entity.Ad;
import com.avtoanalytics.avtoanalytics.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByAdAndIsPublicTrue(Ad ad);
    List<Question> findByAd(Ad ad);
}