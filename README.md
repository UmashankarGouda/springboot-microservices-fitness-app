# 🏋️‍♂️ Spring Boot Microservices AI Fitness Platform

A scalable **AI-powered fitness tracking platform** built using **Spring Boot Microservices architecture**, featuring secure authentication, distributed system design, and intelligent recommendations using AI.

---

## 🚀 Overview

This project is a full-stack microservices-based fitness application where users can track activities, manage profiles, and receive AI-powered insights.  

The system is designed using **industry-grade architecture patterns** such as API Gateway, Service Discovery, Centralized Configuration, and asynchronous communication.

---

## 🏗️ Architecture

![Architecture](./architecture.png)

### 🔹 System Flow

1. Users interact via **React Frontend**
2. Requests go through **API Gateway**
3. Authentication handled by **Keycloak**
4. Services communicate via:
   - REST (synchronous)
   - RabbitMQ (asynchronous)
5. AI Service processes data using **Google Gemini API**
6. Services are registered and discovered using **Eureka**

---

## 🧩 Microservices

| Service            | Description |
|--------------------|------------|
| **User Service**   | Manages user data (PostgreSQL) |
| **Activity Service** | Handles fitness activities (MongoDB) |
| **AI Service**     | Provides AI insights using Gemini API |
| **API Gateway**    | Routes all client requests |
| **Eureka Server**  | Service discovery |
| **Config Server**  | Centralized configuration management |

---

## 🛠️ Tech Stack

### 🔹 Backend
- Java + Spring Boot
- Spring Cloud (Eureka, Gateway, Config Server)
- RabbitMQ (Message Queue)
- Keycloak (Authentication & Authorization)

### 🔹 Frontend
- React.js

### 🔹 Databases
- PostgreSQL (User Service)
- MongoDB (Activity & AI Service)

### 🔹 AI Integration
- Google Gemini API

---

## 🔐 Authentication

- Implemented using **Keycloak**
- Secure OAuth2/OpenID Connect-based authentication
- Centralized identity management

---

## 🔄 Communication

- **Synchronous:** REST APIs via Gateway  
- **Asynchronous:** RabbitMQ for event-driven communication  

---

## ⚙️ Setup & Run Instructions

### 🔹 Prerequisites
- Java 17+
- Node.js
- Docker (optional but recommended)
- PostgreSQL
- MongoDB
- RabbitMQ

---

### 🔹 Run Order (IMPORTANT)

1. Config Server  
2. Eureka Server  
3. Keycloak Server  
4. API Gateway  
5. User Service  
6. Activity Service  
7. AI Service  
8. React Frontend  

---

### 🔹 Backend

```bash
cd <service-folder>
mvn spring-boot:run
