FROM openjdk:17-jdk-slim AS build
WORKDIR /app

COPY build.gradle.kts settings.gradle.kts gradlew ./
COPY gradle ./gradle

COPY src/main/resources/vragentpdv.properties src/main/resources/vragentpdv.properties

RUN chmod +x ./gradlew
RUN ./gradlew dependencies --no-daemon

COPY src ./src

RUN ./gradlew build --no-daemon -x test

FROM openjdk:17-jdk-slim
WORKDIR /app

COPY --from=build /app/build/libs/*.jar app.jar
RUN apt-get update && apt-get install -y postgresql-client netcat

ENTRYPOINT ["java", "-jar", "app.jar"]