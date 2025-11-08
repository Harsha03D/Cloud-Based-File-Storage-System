package com.Task2.FileStorageApplication.service;

import com.Task2.FileStorageApplication.model.FileMetadata;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import software.amazon.awssdk.auth.credentials.DefaultCredentialsProvider;
import software.amazon.awssdk.regions.Region;
import software.amazon.awssdk.services.dynamodb.DynamoDbClient;
import software.amazon.awssdk.services.dynamodb.model.*;

import java.time.Instant;
import java.util.*;

@Service
public class DynamoService {

    @Autowired
    private final DynamoDbClient dynamo;
    @Autowired
    private final String table;

    public DynamoService(@Value("${aws.region}") String region,
                         @Value("${dynamodb.table}") String table) {
        this.dynamo = DynamoDbClient.builder()
                .region(Region.of(region))
                .credentialsProvider(DefaultCredentialsProvider.create())
                .build();
        this.table = table;
    }

    public void saveFileMetadata(FileMetadata meta) {
        Map<String, AttributeValue> item = new HashMap<>();
        item.put("fileId", AttributeValue.builder().s(meta.getFileId()).build());
        item.put("userId", AttributeValue.builder().s(meta.getUserId()).build());
        item.put("fileName", AttributeValue.builder().s(meta.getFileName()).build());
        item.put("s3Key", AttributeValue.builder().s(meta.getS3Key()).build());
        item.put("contentType", AttributeValue.builder().s(meta.getContentType()).build());
        item.put("size", AttributeValue.builder().n(String.valueOf(meta.getSize())).build());
        item.put("uploadedAt", AttributeValue.builder().s(meta.getUploadedAt().toString()).build());

        dynamo.putItem(PutItemRequest.builder().tableName(table).item(item).build());
    }

    public List<FileMetadata> listFilesByUser(String userId) {
        ScanResponse scan = dynamo.scan(ScanRequest.builder().tableName(table).build());
        List<FileMetadata> list = new ArrayList<>();

        scan.items().forEach(map -> {
            if (map.get("userId").s().equals(userId)) {
                FileMetadata f = new FileMetadata();
                f.setFileId(map.get("fileId").s());
                f.setUserId(userId);
                f.setFileName(map.get("fileName").s());
                f.setS3Key(map.get("s3Key").s());
                f.setContentType(map.get("contentType").s());
                f.setSize(Long.parseLong(map.get("size").n()));
                f.setUploadedAt(Instant.parse(map.get("uploadedAt").s()));
                list.add(f);
            }
        });
        return list;
    }
}
