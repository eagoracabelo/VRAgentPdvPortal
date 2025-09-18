package br.com.vrsoftware.vragentpdv.domain.service

import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.web.multipart.MultipartFile
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import java.nio.file.StandardCopyOption

@Service
class StorageService(
    @Value("\${application.storage.path:/opt/vragentpdv/uploads}") private val storagePath: String
) {
    private val rootLocation: Path = Paths.get(storagePath)

    init {
        Files.createDirectories(rootLocation)
    }

    fun saveFile(file: MultipartFile, version: String): String {
        val filename = file.originalFilename ?: "application.jar"
        val versionDir = rootLocation.resolve(version)
        Files.createDirectories(versionDir)

        val destinationFile = versionDir.resolve(filename)
        file.inputStream.use { inputStream ->
            Files.copy(inputStream, destinationFile, StandardCopyOption.REPLACE_EXISTING)
        }

        return destinationFile.toString()
    }

    fun getFilePath(version: String, filename: String): Path {
        return rootLocation.resolve(version).resolve(filename)
    }

    fun fileExists(version: String, filename: String): Boolean {
        return Files.exists(getFilePath(version, filename))
    }

    fun deleteFile(version: String, filename: String): Boolean {
        return Files.deleteIfExists(getFilePath(version, filename))
    }
}