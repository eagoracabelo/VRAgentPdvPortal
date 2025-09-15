package br.com.vrsoftware.vragentpdv.model

data class FileManagementRequest(
    val sourcePath: String,
    val destinationPath: String
)