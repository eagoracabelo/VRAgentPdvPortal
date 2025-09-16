package br.com.vrsoftware.vragentpdv.model.dto.monitor

data class ProcessInfoDto(
    val minion: String,
    val topProcesses: List<Map<String, Any>>?,
    val processCount: Int?
)