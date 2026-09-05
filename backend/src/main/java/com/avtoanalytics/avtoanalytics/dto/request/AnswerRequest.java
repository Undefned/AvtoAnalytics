package com.avtoanalytics.avtoanalytics.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class AnswerRequest {
    @NotBlank
    private String answer;
}