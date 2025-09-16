# VRAgentPdvPortal

Portal de gerenciamento e monitoramento de agentes VRPdv utilizando SaltStack para automação de infraestrutura e controle remoto de dispositivos.

## 📋 Visão Geral

O **VRAgentPdvPortal** é uma aplicação completa para gerenciar e monitorar dispositivos PDV (Ponto de Venda) através do SaltStack. A aplicação oferece uma interface web moderna para administradores gerenciarem minions (dispositivos conectados), executarem comandos remotos, monitorarem performance e manterem logs de auditoria de todas as atividades.

## 🏗️ Arquitetura

### Backend (Kotlin + Spring Boot)
- **Framework**: Spring Boot 3.5.5 com Kotlin 1.9.25
- **Banco de Dados**: PostgreSQL 16
- **Integração**: SaltStack API REST
- **Build**: Gradle com Kotlin DSL

### Frontend (Angular)
- **Framework**: Angular 18.x
- **UI Components**: Bibliotecas customizadas (@vrsoftbr/vr-components, @vrsoftbr/vrc-datatables, @vrsoftbr/vr-table)
- **Arquitetura**: Clean Architecture com Domain, Infrastructure e Application layers
- **Estado**: RxJS com BehaviorSubjects para gerenciamento reativo

### Infraestrutura
- **Containerização**: Docker Compose
- **Proxy Reverso**: Nginx (para o frontend)
- **Rede**: Bridge network para comunicação entre serviços

## 🔄 Principais Fluxos da Aplicação

### 1. Fluxo de Gerenciamento de Minions

#### 1.1 Descoberta e Aceitação de Minions
```
Frontend -> Backend -> SaltStack API
```

**Componentes Envolvidos:**
- `MinionRepository` (Frontend): Comunicação com API
- `MinionUseCase` (Frontend): Lógica de negócio
- `MinionsController` (Backend): Endpoints REST
- `SaltService` (Backend): Integração com SaltStack

**Fluxo:**
1. **Listagem de Chaves**: 
   - Frontend solicita lista de minions (`getAllMinions()`)
   - Backend consulta SaltStack API (`listKeys()`)
   - Retorna minions categorizados: `accepted`, `pending`, `rejected`, `denied`

2. **Aceitação de Minions**:
   - Administrador clica em "Aceitar" em minion pendente
   - Frontend chama `acceptKey(keyId)`
   - Backend executa comando Salt para aceitar chave
   - Log de auditoria é criado automaticamente

#### 1.2 Execução de Comandos Remotos
```
MinionManagementComponent -> MinionUseCase -> MinionRepository -> Backend -> SaltStack
```

**Fluxo:**
1. Usuário navega para gerenciamento de minion específico
2. Preenche formulário de comando (`commandForm`)
3. Sistema executa comando via SaltStack
4. Resultado é exibido na interface
5. Atividade é registrada em log de auditoria

### 2. Fluxo de Monitoramento e Dashboard

#### 2.1 Dashboard Principal
```
DashboardComponent -> SaltApiService -> SaltManagementController -> SaltApiService
```

**Componentes de Monitoramento:**
- `MinionStatusGridComponent`: Status dos minions (online/offline)
- `PerformanceMetricsComponent`: Métricas de CPU, memória e disco
- `RecentJobsComponent`: Jobs executados recentemente

**Dados Coletados:**
- **Status dos Minions**: Up, Down, Pending
- **Informações do Sistema**: OS, hardware, rede
- **Monitoramento**: CPU, memória, disco, processos
- **Jobs**: Histórico de execuções

#### 2.2 Auto-Refresh
- Dashboard atualiza automaticamente a cada 30 segundos
- Utiliza `timer()` do RxJS para refresh periódico
- Tratamento de erros com fallback gracioso

### 3. Fluxo de Gerenciamento de Arquivos

#### 3.1 Transferência de Arquivos
```
MinionManagementComponent -> FileManagementRequest -> SaltStack File State
```

**Funcionalidades:**
- Upload de arquivos para minions
- Download de arquivos de minions
- Sincronização de configurações
- Backup de dados

### 4. Fluxo de Auditoria e Logs

#### 4.1 Sistema de Activity Logs
```
Ação do Usuário -> ActivityLogService -> PostgreSQL -> ActivityLogRepository
```

**Eventos Registrados:**
- Aceitação/rejeição de minions
- Execução de comandos
- Transferência de arquivos
- Atualização de agentes VR
- Erros e falhas do sistema

**Estrutura do Log:**
```kotlin
data class ActivityLog(
    val userId: Long,
    val action: String,        // LIST_KEYS, ACCEPT_KEY, EXECUTE_COMMAND
    val target: String,        // ID do minion ou sistema
    val details: Map<String, Any>?,  // Detalhes específicos da ação
    val status: ActivityStatus,      // SUCCESS ou FAILURE
    val errorMessage: String?,
    val createdAt: Instant
)
```

#### 4.2 Consulta de Logs
- Filtros por usuário, ação, target, data
- Paginação automática
- Interface reativa com observables

### 5. Fluxo de Integração com SaltStack

#### 5.1 Autenticação Salt API
```
SaltService -> Salt API Login -> Token Cache -> Requisições Autenticadas
```

**Processo:**
1. Login inicial com credenciais configuradas
2. Token armazenado em cache (`ConcurrentHashMap`)
3. Renovação automática quando necessário
4. Headers de autenticação em todas as requisições

#### 5.2 Comandos SaltStack Suportados
```
Backend Endpoints -> Salt Commands
```

**Monitoramento:**
- `salt '*' test.ping` - Conectividade
- `salt '*' status.uptime` - Tempo de atividade
- `salt '*' grains.items` - Informações do sistema

**Gerenciamento:**
- `salt-key -L` - Listar chaves
- `salt-key -a <minion>` - Aceitar chave
- `salt '<minion>' cmd.run '<command>'` - Executar comando

**Sistema:**
- `salt '<minion>' grains.get <grain>` - Informações específicas
- `salt '<minion>' disk.usage` - Uso de disco
- `salt '<minion>' status.meminfo` - Informações de memória

### 6. Fluxo de Atualização de Agentes VR

#### 6.1 Processo de Atualização
```
MinionManagementComponent -> updateVRAgent() -> SaltStack State -> Restart Serviços
```

**Etapas:**
1. Usuário clica em "Atualizar VRAgent"
2. Backend executa state de atualização via Salt
3. Download de nova versão
4. Parada de serviços
5. Instalação/atualização
6. Reinício de serviços
7. Verificação de integridade

## 🛠️ Tecnologias e Ferramentas

### Backend
- **Kotlin 1.9.25**: Linguagem principal
- **Spring Boot 3.5.5**: Framework web
- **Spring Data JPA**: Persistência
- **PostgreSQL**: Banco de dados
- **WebFlux**: Programação reativa
- **Gradle**: Build e dependências

### Frontend
- **Angular 18**: Framework SPA
- **RxJS**: Programação reativa
- **TypeScript**: Linguagem tipada
- **SCSS**: Preprocessor CSS
- **Angular Material**: Componentes UI

### DevOps
- **Docker & Docker Compose**: Containerização
- **Nginx**: Servidor web/proxy
- **SaltStack**: Automação de infraestrutura

## 📊 Monitoramento e Métricas

### Métricas Coletadas
1. **Performance do Sistema**:
   - CPU: Uso, cores, modelo
   - Memória: Total, usado, disponível
   - Disco: Espaço, I/O, montagens
   - Rede: Interfaces, tráfego

2. **Estado dos Minions**:
   - Quantidade online/offline
   - Última conexão
   - Versão do Salt
   - Jobs em execução

3. **Logs de Auditoria**:
   - Ações por usuário
   - Histórico de comandos
   - Erros e falhas
   - Timeline de atividades

## 🚀 Configuração e Deploy

### Variáveis de Ambiente
```bash
# Backend
SPRING_PROFILES_ACTIVE=prod
SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/vragentpdvportal
SALT_API_URL=https://127.0.0.1:8000
SALT_API_USERNAME=saltuser
SALT_API_PASSWORD=123abc

# Frontend
GITHUB_TOKEN=<token_para_dependencias>
```

### Executar com Docker Compose
```bash
# Produção
docker-compose up -d

# Desenvolvimento
docker-compose -f docker-compose.dev.backend.yml -f docker-compose.dev.frontend.yml up
```

### Portas
- **Frontend**: 4400 (Nginx)
- **Backend**: 8080 (Spring Boot)
- **Database**: 5432 (PostgreSQL)

## 📝 Estrutura de Dados

### Entidades Principais
1. **Users**: Usuários do sistema
2. **ActivityLogs**: Logs de auditoria
3. **Minions**: Informações dos dispositivos (implícito via SaltStack)

### APIs REST
- `GET /api/minions` - Lista minions
- `POST /api/minions/{id}/accept` - Aceita minion
- `POST /api/minions/{id}/command` - Executa comando
- `GET /api/salt/minions/status` - Status dos minions
- `GET /api/activity-logs/**` - Consulta logs

## 🔒 Segurança

### Autenticação e Autorização
- Integração com SaltStack PAM
- Logs de auditoria completos
- Controle de acesso por usuário

### Comunicação
- HTTPS para Salt API
- Network isolada (Docker)
- Credenciais via variáveis de ambiente

## 🎯 Casos de Uso Principais

1. **Administrador de TI**:
   - Monitorar status da infraestrutura
   - Executar comandos em lote
   - Gerenciar atualizações de software

2. **Operador de Suporte**:
   - Diagnosticar problemas em PDVs
   - Reiniciar serviços remotamente
   - Coletar logs de erro

3. **Auditor/Compliance**:
   - Revisar logs de atividades
   - Verificar alterações no sistema
   - Gerar relatórios de conformidade

---

**Desenvolvido pela VR Software** - Portal para automação e monitoramento de infraestrutura PDV com SaltStack.