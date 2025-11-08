package com.Task2.FileStorageApplication.service;


import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.model.PutObjectPresignRequest;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;
import java.time.Duration;
import java.util.UUID;

@Service
public class S3Service {

    private final String bucket;
    private final Region region;

    private final S3Client s3;
    private final S3Presigner presigner;

    public S3Service(@Value("${aws.region}") String region,
                     @Value("${s3.bucket}") String bucket) {
        this.bucket = bucket;
        this.region = Region.of(region);
        this.s3 = S3Client.builder()
                .region(this.region)
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();
        this.presigner = S3Presigner.builder()
                .region(this.region)
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();
    }

    public String generateUploadUrl(String userId, String fileName, String contentType) {
        String fileId = UUID.randomUUID().toString();
        String key = userId + "/" + fileId + "/" + fileName;

        PutObjectRequest put = PutObjectRequest.builder()
                .bucket(bucket)
                .key(key)
                .contentType(contentType)
                .build();

        PutObjectPresignRequest preq = PutObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10))
                .putObjectRequest(put)
                .build();

        return presigner.presignPutObject(preq).url().toString();
    }

    public String generateDownloadUrl(String s3Key) {
        GetObjectPresignRequest preq = GetObjectPresignRequest.builder()
                .signatureDuration(Duration.ofMinutes(10))
                .getObjectRequest(r -> r.bucket(bucket).key(s3Key))
                .build();

        return presigner.presignGetObject(preq).url().toString();
    }
}
