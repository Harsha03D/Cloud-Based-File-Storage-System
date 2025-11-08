package com.Task2.FileStorageApplication.function;

import com.Task2.FileStorageApplication.model.FileMetadata;
import com.Task2.FileStorageApplication.service.DynamoService;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import java.util.List;
import java.util.function.Function;


@Configuration
public class ListFilesFunction {
    @Autowired
    private final DynamoService dynamoService;
    private final ObjectMapper mapper = new ObjectMapper();

    public ListFilesFunction(DynamoService dynamoService) {
        this.dynamoService = dynamoService;
    }

    @Bean
    public Function<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> listFiles() {
        return request -> {
            try {
                String userId = request.getHeaders().getOrDefault("x-user-id", "anonymous");
                List<FileMetadata> files = dynamoService.listFilesByUser(userId);
                return new APIGatewayProxyResponseEvent()
                        .withStatusCode(200)
                        .withBody(mapper.writeValueAsString(files));
            } catch (Exception e) {
                return new APIGatewayProxyResponseEvent()
                        .withStatusCode(500)
                        .withBody("{\"error\": \"" + e.getMessage() + "\"}");
            }
        };
    }
}
