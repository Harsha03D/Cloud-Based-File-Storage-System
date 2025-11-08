package com.Task2.FileStorageApplication.function;

import com.Task2.FileStorageApplication.model.FileMetadata;
import com.Task2.FileStorageApplication.service.DynamoService;
import com.Task2.FileStorageApplication.service.S3Service;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;


import java.time.Instant;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import java.util.function.Function;

@Configuration
public class UploadFunction {

    private final S3Service s3Service;
    private final DynamoService dynamoService;
    private final ObjectMapper mapper = new ObjectMapper();

    public UploadFunction(S3Service s3Service, DynamoService dynamoService) {
        this.s3Service = s3Service;
        this.dynamoService = dynamoService;
    }

    @Bean
    public Function<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> uploadUrl() {
        return request -> {
            try {
                JsonNode body = mapper.readTree(request.getBody());
                String fileName = body.get("fileName").asText();
                String contentType = body.get("contentType").asText("application/octet-stream");
                String userId = request.getHeaders().getOrDefault("x-user-id", "anonymous");

                String fileId = UUID.randomUUID().toString();
                String s3Key = userId + "/" + fileId + "/" + fileName;
                String uploadUrl = s3Service.generateUploadUrl(userId, fileName, contentType);

                FileMetadata meta = new FileMetadata();
                meta.setFileId(fileId);
                meta.setUserId(userId);
                meta.setFileName(fileName);
                meta.setS3Key(s3Key);
                meta.setContentType(contentType);
                meta.setSize(0L);
                meta.setUploadedAt(Instant.now());
                dynamoService.saveFileMetadata(meta);

                Map<String, Object> responseBody = new HashMap<>();
                responseBody.put("uploadUrl", uploadUrl);
                responseBody.put("fileId", fileId);
                responseBody.put("s3Key", s3Key);

                return new APIGatewayProxyResponseEvent()
                        .withStatusCode(200)
                        .withBody(mapper.writeValueAsString(responseBody));
            } catch (Exception e) {
                e.printStackTrace();
                return new APIGatewayProxyResponseEvent()
                        .withStatusCode(500)
                        .withBody("{\"error\": \"" + e.getMessage() + "\"}");
            }
        };
    }
}
