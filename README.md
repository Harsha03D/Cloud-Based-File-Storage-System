# ☁️ Cloud-Based File Storage System

A secure, scalable **cloud file storage and sharing application** built using **AWS serverless architecture**.  
It allows users to log in, upload, and download files — all stored safely on Amazon S3.  
The backend is powered by **Spring Boot running inside AWS Lambda**, and the frontend will be built with React.

---

## 🏗️ Architecture Overview

### 🔹 High-Level Flow

1. The user logs in via **Amazon Cognito**.
2. The React frontend sends API requests to **Amazon API Gateway**.
3. API Gateway triggers **AWS Lambda** (a Spring Boot app) that:
   - Generates **pre-signed URLs** for file uploads/downloads.
   - Stores file metadata (name, owner, upload time) in **DynamoDB**.
4. The frontend uses the pre-signed URL to upload files directly to **Amazon S3**.
5. Users can view or download files securely for a limited time.
