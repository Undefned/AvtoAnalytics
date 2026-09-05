package com.avtoanalytics.avtoanalytics.controller;

import com.avtoanalytics.avtoanalytics.dto.request.AnswerRequest;
import com.avtoanalytics.avtoanalytics.dto.request.QuestionRequest;
import com.avtoanalytics.avtoanalytics.dto.response.QuestionResponse;
import com.avtoanalytics.avtoanalytics.security.JwtTokenProvider;
import com.avtoanalytics.avtoanalytics.service.QuestionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@RequiredArgsConstructor
@Tag(name = "Questions", description = "Q&A endpoints")
public class QuestionController {

    private final QuestionService questionService;
    private final JwtTokenProvider jwtTokenProvider;

    @GetMapping("/ad/{adId}")
    @Operation(summary = "Get public questions for an ad")
    public ResponseEntity<List<QuestionResponse>> getQuestionsByAd(@PathVariable Long adId) {
        return ResponseEntity.ok(questionService.getPublicQuestionsByAd(adId));
    }

    @PostMapping
    @Operation(summary = "Ask a question about an ad")
    public ResponseEntity<QuestionResponse> askQuestion(
            @RequestBody QuestionRequest request,
            @RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        return ResponseEntity.ok(questionService.askQuestion(request, userId));
    }

    @PostMapping("/{questionId}/answer")
    @Operation(summary = "Answer a question (seller only)")
    public ResponseEntity<QuestionResponse> answerQuestion(
            @PathVariable Long questionId,
            @RequestBody AnswerRequest request,
            @RequestHeader("Authorization") String authHeader) {
        Long userId = getUserIdFromToken(authHeader);
        return ResponseEntity.ok(questionService.answerQuestion(questionId, request, userId));
    }

    private Long getUserIdFromToken(String authHeader) {
        String token = authHeader.substring(7);
        return jwtTokenProvider.getUserIdFromToken(token);
    }
}