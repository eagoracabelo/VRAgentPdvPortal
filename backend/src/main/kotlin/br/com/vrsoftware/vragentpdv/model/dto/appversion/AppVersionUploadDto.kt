package br.com.vrsoftware.vragentpdv.model.dto.appversion

data class AppVersionUploadDto(
    val version: String,
    val description: String? = null,
    val targetMinions: String = "*"
)