package br.com.vrsoftware.vragentpdv.model.dto.jobs

data class JobDetailDto(
    val jid: String,
    val result: Map<String, Any>,
    val function: String?,
    val target: String?,
    val user: String?,
    val startTime: String?
)