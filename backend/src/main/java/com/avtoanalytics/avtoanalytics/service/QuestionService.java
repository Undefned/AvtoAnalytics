package com.avtoanalytics.avtoanalytics.service;

import com.avtoanalytics.avtoanalytics.dto.request.AnswerRequest;
import com.avtoanalytics.avtoanalytics.dto.request.QuestionRequest;
import com.avtoanalytics.avtoanalytics.dto.response.QuestionResponse;
import com.avtoanalytics.avtoanalytics.entity.Ad;
import com.avtoanalytics.avtoanalytics.entity.Question;
import com.avtoanalytics.avtoanalytics.entity.User;
import com.avtoanalytics.avtoanalytics.exception.BadRequestException;
import com.avtoanalytics.avtoanalytics.exception.ResourceNotFoundException;
import com.avtoanalytics.avtoanalytics.repository.AdRepository;
import com.avtoanalytics.avtoanalytics.repository.QuestionRepository;
import com.avtoanalytics.avtoanalytics.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final AdRepository adRepository;
    private final UserRepository userRepository;

    public List<QuestionResponse> getPublicQuestionsByAd(Long adId) {
        Ad ad = adRepository.findById(adId)
            .orElseThrow(() -> new ResourceNotFoundException("Ad not found"));
        List<Question> questions = questionRepository.findByAdAndIsPublicTrue(ad);
        return questions.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    public List<QuestionResponse> getAllQuestionsByAd(Long adId) {
        Ad ad = adRepository.findById(adId)
            .orElseThrow(() -> new ResourceNotFoundException("Ad not found"));
        List<Question> questions = questionRepository.findByAd(ad);
        return questions.stream()
            .map(this::mapToResponse)
            .collect(Collectors.toList());
    }

    @Transactional
    public QuestionResponse askQuestion(QuestionRequest request, Long userId) {
        User asker = userRepository.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
        
        Ad ad = adRepository.findById(request.getAdId())
            .orElseThrow(() -> new ResourceNotFoundException("Ad not found"));

        Question question = new Question();
        question.setAd(ad);
        question.setAsker(asker);
        question.setQuestion(request.getQuestion());
        question.setPublic(request.isPublic());

        Question saved = questionRepository.save(question);
        return mapToResponse(saved);
    }

    @Transactional
    public QuestionResponse answerQuestion(Long questionId, AnswerRequest request, Long userId) {
        Question question = questionRepository.findById(questionId)
            .orElseThrow(() -> new ResourceNotFoundException("Question not found"));

        if (!question.getAd().getSeller().getId().equals(userId)) {
            throw new BadRequestException("Only the seller can answer this question");
        }

        question.setAnswer(request.getAnswer());
        question.setAnsweredAt(LocalDateTime.now());

        Question saved = questionRepository.save(question);
        return mapToResponse(saved);
    }

    private QuestionResponse mapToResponse(Question question) {
        QuestionResponse response = new QuestionResponse();
        response.setId(question.getId());
        response.setQuestion(question.getQuestion());
        response.setAnswer(question.getAnswer());
        response.setPublic(question.isPublic());
        response.setCreatedAt(question.getCreatedAt());
        response.setAnsweredAt(question.getAnsweredAt());
        
        // Asker info
        User asker = question.getAsker();
        if (asker != null) {
            response.setAskerId(asker.getId());
            response.setAskerName(asker.getFullName());
            response.setAskerAvatar(asker.getAvatarUrl());
        }
        
        // Ad info
        Ad ad = question.getAd();
        if (ad != null) {
            response.setAdId(ad.getId());
            response.setAdTitle(ad.getTitle());
        }
        
        return response;
    }
}