FROM eclipse-temurin:21-jdk-alpine as build
WORKDIR /app
COPY . .
RUN apk add --no-cache maven && \
    mvn clean package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=build /app/target/hivemind-*.jar /app/hivemind-backend.jar
EXPOSE 8080
ENTRYPOINT [ "java", "-jar", "hivemind-backend.jar" ]