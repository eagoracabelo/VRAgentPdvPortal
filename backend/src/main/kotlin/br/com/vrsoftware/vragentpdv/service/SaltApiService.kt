package br.com.vrsoftware.vragentpdv.service

import br.com.vrsoftware.vragentpdv.model.dto.jobs.JobDetailDto
import br.com.vrsoftware.vragentpdv.model.dto.jobs.JobDto
import br.com.vrsoftware.vragentpdv.model.dto.jobs.PillarDataDto
import br.com.vrsoftware.vragentpdv.model.dto.jobs.StateInfoDto
import br.com.vrsoftware.vragentpdv.config.SaltApiConfig
import br.com.vrsoftware.vragentpdv.model.dto.monitor.CpuInfoDto
import br.com.vrsoftware.vragentpdv.model.dto.monitor.DiskInfoDto
import br.com.vrsoftware.vragentpdv.model.dto.monitor.MemoryInfoDto
import br.com.vrsoftware.vragentpdv.model.dto.monitor.NetworkMonitorDto
import br.com.vrsoftware.vragentpdv.model.dto.monitor.ProcessInfoDto
import br.com.vrsoftware.vragentpdv.model.dto.system.HardwareInfoDto
import br.com.vrsoftware.vragentpdv.model.dto.system.NetworkInfoDto
import br.com.vrsoftware.vragentpdv.model.dto.system.OsInfoDto
import br.com.vrsoftware.vragentpdv.model.dto.system.SystemInfoDto
import org.slf4j.LoggerFactory
import org.springframework.http.HttpEntity
import org.springframework.http.HttpHeaders
import org.springframework.http.MediaType
import org.springframework.stereotype.Service
import org.springframework.web.client.RestTemplate

@Service
class SaltApiService(
    private val restTemplate: RestTemplate,
    private val saltApiConfig: SaltApiConfig
) {

    private val logger = LoggerFactory.getLogger(SaltApiService::class.java)
    private val saltApiProperties = saltApiConfig.saltApiProperties()

    fun executeCommand(client: String, target: String? = null, function: String? = null): Any {
        val startTime = System.currentTimeMillis()

        try {
            logger.info("Executando comando Salt - Client: {}, Target: {}, Function: {}", client, target, function)

            val token = authenticate()
            val headers = HttpHeaders().apply {
                set("X-Auth-Token", token)
                contentType = MediaType.APPLICATION_FORM_URLENCODED
            }

            val requestBody = buildRequestBody(client, target, function)
            logger.debug("Request body: {}", requestBody)

            // Converter o Map para formato form-urlencoded
            val formData = requestBody.map { "${it.key}=${it.value}" }.joinToString("&")
            val request = HttpEntity(formData, headers)

            val response = restTemplate.postForEntity(
                "${saltApiProperties.url}/",
                request,
                Map::class.java
            )

            @Suppress("UNCHECKED_CAST")
            val result = extractReturnData(response.body as? Map<String, Any>)

            val executionTime = System.currentTimeMillis() - startTime
            logger.info(
                "Comando executado com sucesso em {}ms - Client: {}, Target: {}, Function: {}",
                executionTime, client, target, function
            )
            logger.debug("Resultado do comando: {}", result)

            return result

        } catch (e: Exception) {
            val executionTime = System.currentTimeMillis() - startTime
            logger.error(
                "Erro ao executar comando Salt em {}ms - Client: {}, Target: {}, Function: {}, Erro: {}",
                executionTime, client, target, function, e.message, e
            )
            throw e
        }
    }

    private fun authenticate(): String {
        try {
            logger.debug("Iniciando autenticação com Salt API")

            val headers = HttpHeaders().apply {
                contentType = MediaType.APPLICATION_FORM_URLENCODED
            }

            val authBody = mapOf(
                "username" to saltApiProperties.username,
                "password" to saltApiProperties.password,
                "eauth" to saltApiProperties.eauth
            )

            // Criar o corpo da requisição no formato form-urlencoded
            val formData = authBody.map { "${it.key}=${it.value}" }.joinToString("&")
            val request = HttpEntity(formData, headers)

            val response = restTemplate.postForEntity(
                "${saltApiProperties.url}/login",
                request,
                Map::class.java
            )

            @Suppress("UNCHECKED_CAST")
            val responseBody = response.body as? Map<String, Any>
            val token = (responseBody?.get("return") as List<Map<String, Any>>)
                .first()["token"] as String

            logger.debug("Autenticação realizada com sucesso")
            return token

        } catch (e: Exception) {
            logger.error("Erro na autenticação com Salt API: {}", e.message, e)
            throw e
        }
    }

    private fun buildRequestBody(client: String, target: String?, function: String?): Map<String, Any> {
        return when (client) {
            "salt-run" -> mapOf(
                "client" to "runner",
                "fun" to (target ?: "")
            )

            "salt" -> mapOf(
                "client" to "local",
                "tgt" to (target ?: "*"),
                "fun" to (function ?: "")
            )

            else -> {
                logger.error("Cliente não suportado: {}", client)
                throw IllegalArgumentException("Cliente não suportado: $client")
            }
        }
    }

    private fun extractReturnData(responseBody: Map<String, Any>?): Any {
        return (responseBody?.get("return") as? List<Any>)?.firstOrNull() ?: emptyMap<String, Any>()
    }

    fun parseSystemInfo(result: Any): List<SystemInfoDto> {
        return when (result) {
            is Map<*, *> -> {
                result.mapNotNull { (minion, grains) ->
                    if (minion is String && grains is Map<*, *>) {
                        @Suppress("UNCHECKED_CAST")
                        SystemInfoDto(minion, grains as Map<String, Any>)
                    } else null
                }
            }

            else -> emptyList()
        }
    }

    fun parseOsInfo(osResult: Any, releaseResult: Any, kernelResult: Any): List<OsInfoDto> {
        val osMap = parseGenericResult(osResult)
        val releaseMap = parseGenericResult(releaseResult)
        val kernelMap = parseGenericResult(kernelResult)

        val allMinions = (osMap.keys + releaseMap.keys + kernelMap.keys).distinct()

        return allMinions.map { minion ->
            OsInfoDto(
                minion = minion,
                os = osMap[minion] as? String,
                osRelease = releaseMap[minion] as? String,
                kernel = kernelMap[minion] as? String
            )
        }
    }

    fun parseHardwareInfo(cpuResult: Any, memResult: Any, virtualResult: Any): List<HardwareInfoDto> {
        val cpuMap = parseGenericResult(cpuResult)
        val memMap = parseGenericResult(memResult)
        val virtualMap = parseGenericResult(virtualResult)

        val allMinions = (cpuMap.keys + memMap.keys + virtualMap.keys).distinct()

        return allMinions.map { minion ->
            HardwareInfoDto(
                minion = minion,
                numCpus = (cpuMap[minion] as? Number)?.toInt(),
                memTotal = (memMap[minion] as? Number)?.toLong(),
                virtual = virtualMap[minion] as? String
            )
        }
    }

    fun parseNetworkInfo(ipResult: Any, fqdnResult: Any): List<NetworkInfoDto> {
        val ipMap = parseGenericResult(ipResult)
        val fqdnMap = parseGenericResult(fqdnResult)

        val allMinions = (ipMap.keys + fqdnMap.keys).distinct()

        return allMinions.map { minion ->
            @Suppress("UNCHECKED_CAST")
            NetworkInfoDto(
                minion = minion,
                ipInterfaces = ipMap[minion] as? Map<String, List<String>>,
                fqdn = fqdnMap[minion] as? String
            )
        }
    }

    fun parseGenericResult(result: Any): Map<String, Any?> {
        return when (result) {
            is Map<*, *> -> {
                result.filterKeys { it is String }
                    .mapKeys { it.key as String }
                    .mapValues { it.value }
            }

            else -> emptyMap()
        }
    }

    fun parseCpuInfo(cpuUsageResult: Any, loadAvgResult: Any): List<CpuInfoDto> {
        val cpuMap = parseGenericResult(cpuUsageResult)
        val loadMap = parseGenericResult(loadAvgResult)

        val allMinions = (cpuMap.keys + loadMap.keys).distinct()

        return allMinions.map { minion ->
            @Suppress("UNCHECKED_CAST")
            CpuInfoDto(
                minion = minion,
                cpuUsage = cpuMap[minion] as? String,
                loadAverage = loadMap[minion] as? Map<String, Double>
            )
        }
    }

    fun parseMemoryInfo(result: Any): List<MemoryInfoDto> {
        return when (result) {
            is Map<*, *> -> {
                result.mapNotNull { (minion, memInfo) ->
                    if (minion is String) {
                        @Suppress("UNCHECKED_CAST")
                        MemoryInfoDto(
                            minion = minion,
                            memInfo = memInfo as? Map<String, Any>
                        )
                    } else null
                }
            }

            else -> emptyList()
        }
    }

    fun parseDiskInfo(usageResult: Any, percentResult: Any): List<DiskInfoDto> {
        val usageMap = parseGenericResult(usageResult)
        val percentMap = parseGenericResult(percentResult)

        val allMinions = (usageMap.keys + percentMap.keys).distinct()

        return allMinions.map { minion ->
            @Suppress("UNCHECKED_CAST")
            DiskInfoDto(
                minion = minion,
                diskUsage = usageMap[minion] as? Map<String, Map<String, Any>>,
                rootPartitionPercent = percentMap[minion] as? String
            )
        }
    }

    fun parseProcessInfo(topResult: Any, procsResult: Any): List<ProcessInfoDto> {
        val topMap = parseGenericResult(topResult)
        val procsMap = parseGenericResult(procsResult)

        val allMinions = (topMap.keys + procsMap.keys).distinct()

        return allMinions.map { minion ->
            @Suppress("UNCHECKED_CAST")
            ProcessInfoDto(
                minion = minion,
                topProcesses = topMap[minion] as? List<Map<String, Any>>,
                processCount = (procsMap[minion] as? Number)?.toInt()
            )
        }
    }

    fun parseNetworkMonitor(ipResult: Any, netdevResult: Any): List<NetworkMonitorDto> {
        val ipMap = parseGenericResult(ipResult)
        val netdevMap = parseGenericResult(netdevResult)

        val allMinions = (ipMap.keys + netdevMap.keys).distinct()

        return allMinions.map { minion ->
            @Suppress("UNCHECKED_CAST")
            NetworkMonitorDto(
                minion = minion,
                interfaceIp = ipMap[minion] as? String,
                networkDevices = netdevMap[minion] as? Map<String, Map<String, Any>>
            )
        }
    }

    fun parseJobsList(result: Any): List<JobDto> {
        return when (result) {
            is Map<*, *> -> {
                result.mapNotNull { (jid, jobInfo) ->
                    if (jid is String && jobInfo is Map<*, *>) {
                        @Suppress("UNCHECKED_CAST")
                        val info = jobInfo as Map<String, Any>
                        JobDto(
                            jid = jid,
                            function = info["Function"] as? String ?: "",
                            target = info["Target"] as? String ?: "",
                            user = info["User"] as? String ?: "",
                            startTime = info["StartTime"] as? String ?: "",
                            targetType = info["Target-type"] as? String ?: ""
                        )
                    } else null
                }
            }

            else -> emptyList()
        }
    }

    fun parseJobDetail(result: Any, jobId: String): JobDetailDto? {
        return when (result) {
            is Map<*, *> -> {
                @Suppress("UNCHECKED_CAST")
                val jobData = result as Map<String, Any>
                JobDetailDto(
                    jid = jobId,
                    result = jobData,
                    function = jobData["Function"] as? String,
                    target = jobData["Target"] as? String,
                    user = jobData["User"] as? String,
                    startTime = jobData["StartTime"] as? String
                )
            }

            else -> null
        }
    }

    fun parseStateInfo(result: Any): List<StateInfoDto> {
        return when (result) {
            is Map<*, *> -> {
                result.mapNotNull { (minion, states) ->
                    if (minion is String) {
                        @Suppress("UNCHECKED_CAST")
                        StateInfoDto(
                            minion = minion,
                            states = states as? Map<String, Any>
                        )
                    } else null
                }
            }

            else -> emptyList()
        }
    }

    fun parsePillarData(result: Any): List<PillarDataDto> {
        return when (result) {
            is Map<*, *> -> {
                result.mapNotNull { (minion, pillarData) ->
                    if (minion is String) {
                        @Suppress("UNCHECKED_CAST")
                        PillarDataDto(
                            minion = minion,
                            pillarData = pillarData as? Map<String, Any>
                        )
                    } else null
                }
            }

            else -> emptyList()
        }
    }
}