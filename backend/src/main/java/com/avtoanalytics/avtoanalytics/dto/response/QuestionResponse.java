package com.avtoanalytics.avtoanalytics.dto.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class QuestionResponse {
    private Long id;
    private String question;
    private String answer;
    private boolean isPublic;
    private LocalDateTime createdAt;
    private LocalDateTime answeredAt;
    
    // Asker info
    private Long askerId;
    private String askerName;
    private String askerAvatar;
    
    // Ad info (optional, just for context)
    private Long adId;
    private String adTitle;
}