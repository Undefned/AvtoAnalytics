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

    @Value("${minio.endpoint}")
    private String endpoint;

    @Value("${minio.port}")
    private int port;

    public String uploadFile(MultipartFile file) {
        try {
            // Создаём bucket если не существует
            boolean bucketExists = minioClient.bucketExists(BucketExistsArgs.builder()
                    .bucket(bucketName)
                    .build());

            if (!bucketExists) {
                minioClient.makeBucket(MakeBucketArgs.builder()
                        .bucket(bucketName)
                        .build());
                log.info("Bucket '{}' created", bucketName);
            }

            // Генерируем уникальное имя файла
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            // Загружаем файл
            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(bucketName)
                    .object(fileName)
                    .stream(file.getInputStream(), file.getSize(), -1)
                    .contentType(file.getContentType())
                    .build());

            // Возвращаем URL для доступа
            return getFileUrl(fileName);

        } catch (Exception e) {
            log.error("Error uploading file to MinIO: {}", e.getMessage());
            throw new RuntimeException("Failed to upload file", e);
        }
    }

    public String getFileUrl(String fileName) {
        try {
            // Генерируем подписанный URL (доступен 7 дней)
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .method(Method.GET)
                            .expiry(7, java.util.concurrent.TimeUnit.DAYS)
                            .build()
            );
        } catch (Exception e) {
            log.error("Error generating URL for file: {}", e.getMessage());
            // Если не удалось сгенерировать подписанный URL - возвращаем прямой
            return String.format("http://%s:%d/%s/%s", endpoint, port, bucketName, fileName);
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