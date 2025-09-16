package br.com.vrsoftware.vragentpdv.model.dto.appversion

data class AppVersionResultDto(
    val success: Boolean,
    val version: String,
    val message: String,
    val hash: String? = null,
    val deploymentResult: Map<String, Any?>? = null
)