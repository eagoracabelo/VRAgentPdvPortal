package br.com.vrsoftware.vragentpdv.model.dto.monitor

data class MemoryInfoDto(
    val minion: String,
    val memInfo: Map<String, Any>?
)