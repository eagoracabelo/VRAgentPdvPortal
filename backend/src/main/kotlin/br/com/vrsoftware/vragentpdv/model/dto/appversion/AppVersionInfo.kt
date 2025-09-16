package br.com.vrsoftware.vragentpdv.model.dto.appversion

data class AppVersionInfo(
    val version: String,
    val hash: String,
    val uploadDate: String,
    val description: String?
)