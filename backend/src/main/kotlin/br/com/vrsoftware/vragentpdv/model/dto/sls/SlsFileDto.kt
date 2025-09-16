package br.com.vrsoftware.vragentpdv.model.dto.sls

data class SlsFileDto(
    val name: String,
    val path: String,
    val content: String? = null,
    val lastModified: String? = null
)