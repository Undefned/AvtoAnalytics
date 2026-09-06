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

    /**
     * Публичный базовый URL для файлов, отдаваемых наружу (в браузер).
     *
     * По умолчанию — относительный путь "/minio", который проксируется
     * через nginx (location /minio/ -> minio:9000) на том же origin,
     * с которого отдаётся сам сайт. Это работает откуда угодно —
     * с вашего ноутбука, с сервера, за любым доменом — без переменных
     * окружения под конкретный хост.
     *
     * Раньше здесь был абсолютный "http://localhost:9000", который
     * означает "порт 9000 на машине ЗРИТЕЛЯ", а не сервера — поэтому
     * фото/аватарки не грузились нигде, кроме как при локальном запуске
     * фронта и бэка на одной машине (Live Server).
     *
     * Если когда-нибудь понадобится реально отдавать MinIO с отдельного
     * хоста/CDN — переопределите minio.public-url-base значением вида
     * "https://cdn.example.com/minio" через переменную окружения
     * MINIO_PUBLIC_URL_BASE, и это будет использовано как есть.
     */
    @Value("${minio.public-url-base:/minio}")
    private String publicUrlBase;

    public String uploadFile(MultipartFile file, String folder) {
        try {
            boolean bucketExists = minioClient.bucketExists(BucketExistsArgs.builder()
                    .bucket(bucketName)
                    .build());

            if (!bucketExists) {
                minioClient.makeBucket(MakeBucketArgs.builder()
                        .bucket(bucketName)
                        .build());
                log.info("Bucket '{}' created", bucketName);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = originalFilename != null && originalFilename.contains(".")
                    ? originalFilename.substring(originalFilename.lastIndexOf('.'))
                    : "";
            String fileName = UUID.randomUUID() + extension;

            String fullPath = folder != null && !folder.isEmpty()
                    ? folder + "/" + fileName
                    : fileName;

            minioClient.putObject(PutObjectArgs.builder()
                    .bucket(bucketName)
                    .object(fullPath)
                    .stream(file.getInputStream(), file.getSize(), -1)
                    .contentType(file.getContentType())
                    .build());

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
     * Возвращает URL, который реально резолвится в браузере — относительный
     * путь через nginx-прокси, а не хардкод хоста бэкенда.
     */
    public String getDirectFileUrl(String fileName) {
        String base = publicUrlBase.endsWith("/")
                ? publicUrlBase.substring(0, publicUrlBase.length() - 1)
                : publicUrlBase;
        return String.format("%s/%s/%s", base, bucketName, fileName);
    }

    @Deprecated
    public String getPresignedFileUrl(String fileName) {
        try {
            return minioClient.getPresignedObjectUrl(
                    GetPresignedObjectUrlArgs.builder()
                            .bucket(bucketName)
                            .object(fileName)
                            .method(Method.GET)
                            .expiry(7, java.util.concurrent.TimeUnit.DAYS)
                            .build()
            );
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