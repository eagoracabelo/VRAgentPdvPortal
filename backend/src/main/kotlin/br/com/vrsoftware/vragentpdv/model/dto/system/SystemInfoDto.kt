package br.com.vrsoftware.vragentpdv.model.dto.system

data class SystemInfoDto(
    val minion: String,
    val grains: Map<String, Any>
)