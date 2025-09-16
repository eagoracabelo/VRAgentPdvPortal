package br.com.vrsoftware.vragentpdv.controller

import br.com.vrsoftware.vragentpdv.model.dto.jobs.JobDetailDto
import br.com.vrsoftware.vragentpdv.model.dto.jobs.JobDto
import br.com.vrsoftware.vragentpdv.model.dto.jobs.PillarDataDto
import br.com.vrsoftware.vragentpdv.model.dto.jobs.StateInfoDto
import br.com.vrsoftware.vragentpdv.model.dto.monitor.CpuInfoDto
import br.com.vrsoftware.vragentpdv.model.dto.monitor.DiskInfoDto
import br.com.vrsoftware.vragentpdv.model.dto.monitor.MemoryInfoDto
import br.com.vrsoftware.vragentpdv.model.dto.monitor.NetworkMonitorDto
import br.com.vrsoftware.vragentpdv.model.dto.monitor.ProcessInfoDto
import br.com.vrsoftware.vragentpdv.model.dto.sls.SlsListDto
import br.com.vrsoftware.vragentpdv.model.dto.sls.SlsOperationDto
import br.com.vrsoftware.vragentpdv.model.dto.sls.SlsOperationResultDto
import br.com.vrsoftware.vragentpdv.model.dto.system.HardwareInfoDto
import br.com.vrsoftware.vragentpdv.model.dto.system.NetworkInfoDto
import br.com.vrsoftware.vragentpdv.model.dto.system.OsInfoDto
import br.com.vrsoftware.vragentpdv.model.dto.system.SystemInfoDto
import br.com.vrsoftware.vragentpdv.service.SaltApiService
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/salt")
class SaltManagementController(
    private val saltApiService: SaltApiService
) {

    @GetMapping("/minions/status")
    fun getMinionsStatus(): ResponseEntity<in Any> {
        val result = saltApiService.executeCommand("salt-run", "manage.status")
        return ResponseEntity.ok(result)
    }

    @GetMapping("/minions/up")
    fun getMinionsUp(): ResponseEntity<in Any> {
        val result = saltApiService.executeCommand("salt-run", "manage.up")
        return ResponseEntity.ok(result)
    }

    @GetMapping("/minions/down")
    fun getMinionsDown(): ResponseEntity<in Any> {
        val result = saltApiService.executeCommand("salt-run", "manage.down")
        return ResponseEntity.ok(result)
    }

    @PostMapping("/minions/ping")
    fun pingAllMinions(): ResponseEntity<in Any> {
        val result = saltApiService.executeCommand("salt", "*", "test.ping")
        return ResponseEntity.ok(result)
    }

    @GetMapping("/minions/uptime")
    fun getMinionsUptime(): ResponseEntity<in Any> {
        val result = saltApiService.executeCommand("salt", "*", "status.uptime")
        return ResponseEntity.ok(result)
    }

    @GetMapping("/minions/present")
    fun getMinionsPresent(): ResponseEntity<in Any> {
        val result = saltApiService.executeCommand("salt-run", "manage.present")
        return ResponseEntity.ok(result)
    }

    @GetMapping("/system/info")
    fun getSystemInfo(@RequestParam(defaultValue = "*") target: String): List<SystemInfoDto> {
        val result = saltApiService.executeCommand("salt", target, "grains.items")
        return saltApiService.parseSystemInfo(result)
    }

    @GetMapping("/system/os")
    fun getOsInfo(@RequestParam(defaultValue = "*") target: String): List<OsInfoDto> {
        val osResult = saltApiService.executeCommand("salt", target, "grains.get os")
        val releaseResult = saltApiService.executeCommand("salt", target, "grains.get osrelease")
        val kernelResult = saltApiService.executeCommand("salt", target, "grains.get kernel")

        return saltApiService.parseOsInfo(osResult, releaseResult, kernelResult)
    }

    @GetMapping("/system/hardware")
    fun getHardwareInfo(@RequestParam(defaultValue = "*") target: String): List<HardwareInfoDto> {
        val cpuResult = saltApiService.executeCommand("salt", target, "grains.get num_cpus")
        val memResult = saltApiService.executeCommand("salt", target, "grains.get mem_total")
        val virtualResult = saltApiService.executeCommand("salt", target, "grains.get virtual")

        return saltApiService.parseHardwareInfo(cpuResult, memResult, virtualResult)
    }

    @GetMapping("/system/network")
    fun getNetworkInfo(@RequestParam(defaultValue = "*") target: String): List<NetworkInfoDto> {
        val ipResult = saltApiService.executeCommand("salt", target, "grains.get ip_interfaces")
        val fqdnResult = saltApiService.executeCommand("salt", target, "grains.get fqdn")

        return saltApiService.parseNetworkInfo(ipResult, fqdnResult)
    }

    @GetMapping("/grains/{grain}")
    fun getSpecificGrain(
        @PathVariable grain: String,
        @RequestParam(defaultValue = "*") target: String
    ): Map<String, Any?> {
        val result = saltApiService.executeCommand("salt", target, "grains.get $grain")
        return saltApiService.parseGenericResult(result)
    }

    @GetMapping("/monitor/cpu")
    fun getCpuInfo(@RequestParam(defaultValue = "*") target: String): List<CpuInfoDto> {
        val cpuUsageResult = saltApiService.executeCommand("salt", target, "cmd.run 'top -bn1 | grep \"Cpu(s)\"'")
        val loadAvgResult = saltApiService.executeCommand("salt", target, "status.loadavg")

        return saltApiService.parseCpuInfo(cpuUsageResult, loadAvgResult)
    }

    @GetMapping("/monitor/memory")
    fun getMemoryInfo(@RequestParam(defaultValue = "*") target: String): List<MemoryInfoDto> {
        val result = saltApiService.executeCommand("salt", target, "status.meminfo")
        return saltApiService.parseMemoryInfo(result)
    }

    @GetMapping("/monitor/disk")
    fun getDiskInfo(@RequestParam(defaultValue = "*") target: String): List<DiskInfoDto> {
        val usageResult = saltApiService.executeCommand("salt", target, "disk.usage")
        val percentResult = saltApiService.executeCommand("salt", target, "disk.percent /")

        return saltApiService.parseDiskInfo(usageResult, percentResult)
    }

    @GetMapping("/monitor/processes")
    fun getProcessInfo(@RequestParam(defaultValue = "*") target: String): List<ProcessInfoDto> {
        val topResult = saltApiService.executeCommand("salt", target, "ps.top")
        val procsResult = saltApiService.executeCommand("salt", target, "status.procs")

        return saltApiService.parseProcessInfo(topResult, procsResult)
    }

    @GetMapping("/monitor/network")
    fun getNetworkMonitor(
        @RequestParam(defaultValue = "*") target: String,
        @RequestParam(defaultValue = "eth0") pInterface: String
    ): List<NetworkMonitorDto> {
        val ipResult = saltApiService.executeCommand("salt", target, "network.interface_ip ${pInterface}")
        val netdevResult = saltApiService.executeCommand("salt", target, "status.netdev")

        return saltApiService.parseNetworkMonitor(ipResult, netdevResult)
    }

    @GetMapping("/monitor/summary")
    fun getSystemSummary(@RequestParam(defaultValue = "*") target: String): Map<String, Any> {
        return mapOf(
            "cpu" to getCpuInfo(target),
            "memory" to getMemoryInfo(target),
            "disk" to getDiskInfo(target),
            "processes" to getProcessInfo(target),
            "network" to getNetworkMonitor(target, "eth0")
        )
    }

    @GetMapping("/jobs/list")
    fun getJobsList(): List<JobDto> {
        val result = saltApiService.executeCommand("salt-run", "jobs.list_jobs")
        return saltApiService.parseJobsList(result)
    }

    @GetMapping("/jobs/{jobId}")
    fun getJobDetail(@PathVariable jobId: String): JobDetailDto? {
        val result = saltApiService.executeCommand("salt-run", "jobs.lookup_jid $jobId")
        return saltApiService.parseJobDetail(result, jobId)
    }

    @GetMapping("/states/highstate")
    fun getHighstate(@RequestParam(defaultValue = "*") target: String): List<StateInfoDto> {
        val result = saltApiService.executeCommand("salt", target, "state.show_highstate")
        return saltApiService.parseStateInfo(result)
    }

    @GetMapping("/states/sls")
    fun getStateSls(
        @RequestParam(defaultValue = "*") target: String,
        @RequestParam slsName: String
    ): List<StateInfoDto> {
        val result = saltApiService.executeCommand("salt", target, "state.show_sls $slsName")
        return saltApiService.parseStateInfo(result)
    }

    @GetMapping("/pillar/items")
    fun getPillarItems(@RequestParam(defaultValue = "*") target: String): List<PillarDataDto> {
        val result = saltApiService.executeCommand("salt", target, "pillar.items")
        return saltApiService.parsePillarData(result)
    }

    @GetMapping("/pillar/{key}")
    fun getPillarKey(
        @PathVariable key: String,
        @RequestParam(defaultValue = "*") target: String
    ): Map<String, Any?> {
        val result = saltApiService.executeCommand("salt", target, "pillar.get $key")
        return saltApiService.parseGenericResult(result)
    }

    @GetMapping("/admin/overview")
    fun getAdminOverview(@RequestParam(defaultValue = "*") target: String): Map<String, Any> {
        val statusResult = saltApiService.executeCommand("salt-run", "manage.status")
        
        // Parse minions status to match frontend expectations
        val minionsStatus = when (statusResult) {
            is Map<*, *> -> {
                mapOf(
                    "up" to (statusResult["up"] ?: statusResult["minions"] ?: emptyList<String>()),
                    "down" to (statusResult["down"] ?: emptyList<String>()),
                    "pending" to (statusResult["pending"] ?: statusResult["minions_pre"] ?: emptyList<String>())
                )
            }
            else -> mapOf(
                "up" to emptyList<String>(),
                "down" to emptyList<String>(),
                "pending" to emptyList<String>()
            )
        }
        
        return mapOf(
            "minionsStatus" to minionsStatus,
            "recentJobs" to getJobsList().take(10),
            "systemSummary" to getSystemSummary(target)
        )
    }

    @GetMapping("/sls/list")
    fun getAvailableSls(): SlsListDto {
        return try {
            val listCommand = "find /srv/salt -name '*.sls' -type f 2>/dev/null || echo 'No SLS files found'"
            val result = saltApiService.executeCommand("salt-run", "cmd.run '$listCommand'")

            saltApiService.parseSlsListSimple(result)
        } catch (e: Exception) {
            SlsListDto(availableStates = emptyList(), slsFiles = emptyList())
        }
    }

    @GetMapping("/sls/{slsName}/content")
    fun getSlsContent(@PathVariable slsName: String): Map<String, String> {
        val result = saltApiService.executeCommand("salt-run", "state.show_sls $slsName")
        return saltApiService.parseSlsContent(result, slsName)
    }

    @GetMapping("/sls/{slsName}/file")
    fun getSlsFile(@PathVariable slsName: String): Map<String, Any> {
        // Tenta ler o arquivo SLS diretamente
        val result = saltApiService.executeCommand("salt-run", "cp.get_file salt://$slsName.sls /tmp/$slsName.sls")
        val contentResult = saltApiService.executeCommand("salt-run", "cmd.run 'cat /srv/salt/$slsName.sls'")
        return saltApiService.parseSlsFile(contentResult, slsName)
    }

    @PostMapping("/sls/create")
    fun createSls(@RequestBody slsOperation: SlsOperationDto): SlsOperationResultDto {
        return saltApiService.createSlsFile(slsOperation)
    }

    @PutMapping("/sls/{slsName}")
    fun updateSls(
        @PathVariable slsName: String,
        @RequestBody slsOperation: SlsOperationDto
    ): SlsOperationResultDto {
        val operation = slsOperation.copy(name = slsName, operation = "UPDATE")
        return saltApiService.updateSlsFile(operation)
    }

    @DeleteMapping("/sls/{slsName}")
    fun deleteSls(@PathVariable slsName: String): SlsOperationResultDto {
        val operation = SlsOperationDto(name = slsName, content = "", operation = "DELETE")
        return saltApiService.deleteSlsFile(operation)
    }

    @PostMapping("/sls/{slsName}/apply")
    fun applySlsState(
        @PathVariable slsName: String,
        @RequestParam(defaultValue = "*") target: String
    ): Map<String, Any?> {
        val result = saltApiService.executeCommand("salt", target, "state.apply $slsName")
        return saltApiService.parseGenericResult(result)
    }

    @PostMapping("/sls/{slsName}/test")
    fun testSlsState(
        @PathVariable slsName: String,
        @RequestParam(defaultValue = "*") target: String
    ): Map<String, Any?> {
        val result = saltApiService.executeCommand("salt", target, "state.apply $slsName test=True")
        return saltApiService.parseGenericResult(result)
    }

    @GetMapping("/sls/validate/{slsName}")
    fun validateSls(@PathVariable slsName: String): Map<String, Any> {
        val result = saltApiService.executeCommand("salt-run", "state.show_sls $slsName")
        return mapOf(
            "valid" to (result != null && result !is String),
            "content" to result
        )
    }
}