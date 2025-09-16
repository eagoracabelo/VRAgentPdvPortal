package br.com.vrsoftware.vragentpdv.model.dto.system

data class NetworkInfoDto(
    val minion: String,
    val ipInterfaces: Map<String, List<String>>?,
    val fqdn: String?
)