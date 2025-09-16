package br.com.vrsoftware.vragentpdv.model.dto.sls

data class SlsOperationResultDto(
    val success: Boolean,
    val message: String,
    val slsName: String,
    val operation: String
)