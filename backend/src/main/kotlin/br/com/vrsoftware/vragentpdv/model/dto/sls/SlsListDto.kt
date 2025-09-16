package br.com.vrsoftware.vragentpdv.model.dto.sls

data class SlsListDto(
    val availableStates: List<String>,
    val slsFiles: List<SlsFileDto>? = null
)