package br.com.vrsoftware.vragentpdv.model.dto.jobs

data class JobDto(
    val jid: String,
    val function: String,
    val target: String,
    val user: String,
    val startTime: String,
    val targetType: String
)