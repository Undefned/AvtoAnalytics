# --- Stage 1: Build the application ---
FROM amazoncorretto:21-alpine AS builder
WORKDIR /build

# Copy Maven binaries directly from an official Maven image
COPY --from=maven:3.9.9-eclipse-temurin-17-alpine /usr/share/maven /usr/share/maven
RUN ln -s /usr/share/maven/bin/mvn /usr/bin/mvn

# Copy only the dependency management files first to leverage Docker cache layers
COPY pom.xml .
RUN mvn dependency:go-offline -B

# Copy source code and build the application package
COPY src ./src
RUN mvn clean package -DskipTests

# --- Stage 2: Safe production runtime ---
FROM amazoncorretto:21-alpine
WORKDIR /app

# Create a non-root system user for better security
RUN addgroup -S spring && adduser -S spring -G spring
USER spring:spring

# Copy the built JAR file from the builder stage
COPY --from=builder /build/target/*.jar app.jar

# Expose Spring Boot's default port
EXPOSE 8080

# Run the application with optimized memory and exec syntax
ENTRYPOINT ["java", "-jar", "app.jar"]
