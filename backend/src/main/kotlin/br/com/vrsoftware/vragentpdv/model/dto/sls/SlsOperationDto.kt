package br.com.vrsoftware.vragentpdv.model.dto.sls

data class SlsOperationDto(
    val name: String,
    val content: String,
    val operation: String // CREATE, UPDATE, DELETE
)