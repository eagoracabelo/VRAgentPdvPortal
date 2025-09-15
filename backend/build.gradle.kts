import java.io.FileInputStream
import java.util.*

plugins {
    kotlin("jvm") version "1.9.25"
    kotlin("plugin.spring") version "1.9.25"
    id("org.springframework.boot") version "3.5.5"
    id("io.spring.dependency-management") version "1.1.7"
    kotlin("plugin.jpa") version "1.9.25"
}

group = "br.com.vrsoftware"
description = "Portal para gerenciar e monitorar os agents no VRPdv"

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(17)
    }
}

repositories {
    mavenCentral()
}

val PROPERTY_FILE = "${projectDir}/src/main/resources/vragentpdv.properties"

fun getProperties(): Properties {
    val arquivo = File(PROPERTY_FILE)
    if (!arquivo.exists()) throw GradleException("Arquivo de versão não encontrado")

    val props = Properties().apply {
        FileInputStream(arquivo).use { load(it) }
    }
    return props
}

fun getVersao(): String {
    val props = getProperties()

    val major = props.getProperty("versao.major")?.toIntOrNull() ?: 0
    val minor = props.getProperty("versao.minor")?.toIntOrNull() ?: 0
    val release = props.getProperty("versao.release")?.toIntOrNull() ?: 0
    val build = props.getProperty("versao.build")?.toIntOrNull() ?: 0
    val beta = props.getProperty("versao.beta")?.toIntOrNull() ?: 0

    val version = "$major.$minor.$release-$build"

    return when {
        beta > 0 -> "$version-beta$beta"
        else -> version
    }
}

version = getVersao()

tasks.named<org.springframework.boot.gradle.tasks.bundling.BootJar>("bootJar") {
    archiveFileName.set("vragentpdvportal-api-${project.version}.jar")
}

tasks.named<Jar>("jar") {
    enabled = false
}

dependencies {

    implementation("org.springframework.boot:spring-boot-starter-data-jpa")
    implementation("org.springframework.boot:spring-boot-starter-security")
    implementation("org.springframework.boot:spring-boot-starter-webflux")
    implementation("com.fasterxml.jackson.module:jackson-module-kotlin")
    implementation("io.projectreactor.kotlin:reactor-kotlin-extensions")
    implementation("org.jetbrains.kotlin:kotlin-reflect")
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-reactor")

    implementation("com.vladmihalcea:hibernate-types-60:2.21.1")

    implementation("org.flywaydb:flyway-core:10.10.0")
    implementation("org.flywaydb:flyway-database-postgresql:10.10.0")

    runtimeOnly("org.postgresql:postgresql")

    testImplementation("org.springframework.boot:spring-boot-starter-test")
    testImplementation("io.projectreactor:reactor-test")
    testImplementation("org.jetbrains.kotlin:kotlin-test-junit5")
    testImplementation("org.jetbrains.kotlinx:kotlinx-coroutines-test")
    testImplementation("org.springframework.security:spring-security-test")

    testRuntimeOnly("org.junit.platform:junit-platform-launcher")
}

kotlin {
    compilerOptions {
        freeCompilerArgs.addAll("-Xjsr305=strict")
    }
}

allOpen {
    annotation("jakarta.persistence.Entity")
    annotation("jakarta.persistence.MappedSuperclass")
    annotation("jakarta.persistence.Embeddable")
}

tasks.withType<Test> {
    useJUnitPlatform()
}