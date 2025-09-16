package br.com.vrsoftware.vragentpdv.model.dto.jobs

data class StateInfoDto(
    val minion: String,
    val states: Map<String, Any>?
)