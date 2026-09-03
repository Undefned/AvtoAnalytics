package com.avtoanalytics.avtoanalytics.controller;

import com.avtoanalytics.avtoanalytics.service.MinioService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/files")
@RequiredArgsConstructor
@Tag(name = "Files", description = "File upload endpoints")
public class FileController {

    private final MinioService minioService;

    @PostMapping("/upload")
    @Operation(summary = "Upload a file")
    public ResponseEntity<Map<String, String>> uploadFile(@RequestParam("file") MultipartFile file) {
        String fileUrl = minioService.uploadFile(file);
        Map<String, String> response = new HashMap<>();
        response.put("url", fileUrl);
        response.put("message", "File uploaded successfully");
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{fileName}")
    @Operation(summary = "Delete a file")
    public ResponseEntity<Map<String, String>> deleteFile(@PathVariable String fileName) {
        minioService.deleteFile(fileName);
        Map<String, String> response = new HashMap<>();
        response.put("message", "File deleted successfully");
        return ResponseEntity.ok(response);
    }
}