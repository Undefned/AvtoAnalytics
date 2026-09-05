package com.avtoanalytics.avtoanalytics.service;

import io.minio.*;
import io.minio.http.Method;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.InputStream;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MinioService {

    private final MinioClient minioClient;

    @Value("${minio.bucket-name}")
    private String bucketName;

    @Value("${minio.public-endpoint:localhost}")
    private String publicEndpoint;

    @Value("${minio.public-port:9000}")
    private int publicPort;

    public String uploadFile(MultipartFile file, String folder) {
        try {
            // Check if bucket exists
            boolean bucketExists = minioClient.bucketExists(BucketExistsArgs.builder()
                    .bucket(bucketName)
                    .build());

            if (!bucketExists) {
                minioClient.makeBucket(MakeBucketArgs.builder()
                        .bucket(bucketName)
                        .build());
                log.info("Bucket '{}' created", bucketName);
            }

            // Generate unique filename
            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".") 
                    ? originalFilename.substring(originalFilename.lastIndexOf('.')) 
                    : "";
            String fileName = UUID.randomUUID() + extension;
            
            String fullPath = folder != null && !folder.isEmpty() 
                    ? folder + "/" + fileName 
                    : fileName;

            // Upload file
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(bucketName)
                    .object(fullPath)
                    .stream(file.getInputStream(), file.getSize(), -1)
                    .contentType(file.getContentType())
                    .build());

            // ✅ Return DIRECT URL instead of presigned URL
            return getDirectFileUrl(fullPath);

        } catch (Exception e) {
            log.error("Error uploading file to MinIO: {}", e.getMessage());
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    public String uploadFile(MultipartFile file) {
        return uploadFile(file, null);
    }

    /**
     * ✅ Returns a direct URL without presigned parameters
     * Works if MinIO bucket is public
     */
    public String getDirectFileUrl(String fileName) {
        return String.format("http://%s:%d/%s/%s", publicEndpoint, publicPort, bucketName, fileName);
    }

    /**
     * ⚠️ Deprecated: Use getDirectFileUrl instead
     * This was causing issues with the browser
     */
    @Deprecated
    public String getPresignedFileUrl(String fileName) {
        try {
            String url = minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .method(Method.GET)
                            .expiry(7, java.util.concurrent.TimeUnit.DAYS)
                            .build()
            );
            return url;
        } catch (Exception e) {
            log.error("Error generating presigned URL: {}", e.getMessage());
            return getDirectFileUrl(fileName);
        }
    }

    public void deleteFile(String fileName) {
        try {
            minioClient.removeObject(RemoveObjectArgs.builder()
                    .bucket(bucketName)
                    .object(fileName)
                    .build());
            log.info("File '{}' deleted from MinIO", fileName);
        } catch (Exception e) {
            log.error("Error deleting file from MinIO: {}", e.getMessage());
            throw new RuntimeException("Failed to delete file", e);
        }
    }

    public byte[] downloadFile(String fileName) {
        try {
            InputStream stream = minioClient.getObject(
                    GetObjectArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .build()
            );
            return stream.readAllBytes();
        } catch (Exception e) {
            log.error("Error downloading file from MinIO: {}", e.getMessage());
            throw new RuntimeException("Failed to download file", e);
        }
    }
}