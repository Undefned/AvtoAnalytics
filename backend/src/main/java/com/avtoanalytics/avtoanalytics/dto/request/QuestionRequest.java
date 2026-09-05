package com.avtoanalytics.avtoanalytics.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class QuestionRequest {
    @NotNull
    private Long adId;
    
    @NotBlank
    private String question;
    
    private boolean isPublic = true;
}