<p  align="center">

<h1  align="center">VR UI</h1>

</p>

| Angular                                                                                                 | Typescript                                                                                                     | SCSS                                                                                 |
| :------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------------- |
| [![Angular](https://img.shields.io/badge/angular-v18-red.svg)]([https://github.com/angular/angular-cli) | [![TypeScript](https://img.shields.io/badge/100%25-TypeScript:5.5.4-blue.svg)](https://www.typescriptlang.org) | [![scss](https://img.shields.io/badge/100%25-scss-pink.svg)](https://sass-lang.com/) |

**VRUI é um monorepo [Angular](https://angular.io) (>=18) para desenvolvimento e estilização de components reutilizáveis.**

#### VRUI

```
docker-compose up
docker-compose exec vrui bash
```

## Code generation

Execute `ng generate component nome-do-componente` para gerar um novo componente. Você também pode usar `ng generate directive|pipe|service|class|guard|interface|enum|module`.

```bash
# Criação de componentes APP
ng g m pages/vrui --rounting
ng g c pages/vrui --skip-tests

# Criação de componentes LIB
ng generate library my-lib
ng g m projects/components/src/lib/components
ng g c projects/components/src/lib/components

```

### Comandos

| Comandos      | VRUI               | VRDesignGuide                     | VRComponents                     | VRDatatables                     | VRTable                     |
| :------------ | :----------------- | :-------------------------------- | -------------------------------- | -------------------------------- | --------------------------- |
| `build`       | npm run build:app  | npm run build:VRDesignGuide       | npm run build:VRComponents       | npm run build:VRDatatables       | npm run build:VRTable       |
| `test`        |                    | npm run test:VRDesignGuide        | npm run test:VRComponents        | npm run test:VRDatatables        | npm run test:VRTable        |
| `test:watch`  |                    | npm run test:VRDesignGuide:watch  | npm run test:VRComponents:watch  | npm run test:VRDatatables:watch  | npm run test:VRTable:watch  |
| `test:single` |                    | npm run test:VRDesignGuide:single | npm run test:VRComponents:single | npm run test:VRDatatables:single | npm run test:VRTable:single |
| `lint`        |                    | npm run lint:lib                  | npm run lint:lib                 | npm run lint:lib                 | npm run lint:lib            |
| `lint:fix`    |                    | npm run lint:lib:fix              | npm run lint:lib:fix             | npm run lint:lib:fix             | npm run lint:lib:fix        |
| `format`      | npm run format     | npm run format:lib                | npm run format:lib               | npm run format:lib               | npm run format:lib          |
| `format:fix`  | npm run format:fix | npm run format:lib:fix            | npm run format:lib:fix           | npm run format:lib:fix           | npm run format:lib:fix      |
| `stylelint`   |                    | npm run stylelint:lib             | npm run stylelint:lib            | npm run stylelint:lib            | npm run stylelint:lib       |

#### Descritivo de Diretorios

```
├── .angular                                diretório de configurações do Angular (Cache de estilos, configurações de build, etc)
├── .docker                                 arquivos utilizados na build do container Docker
├── .github                                 arquivos de actions do GitHub
├── .vscode                                 arquivos de configuraçãoes do VSCode
├── coverage                                diretório de relatórios de cobertura de testes
├── node_modules                            diretório de dependências do projeto
├── projects                                diretório de projetos do Angular (LIBs)
|   ├── components                          diretório do VRComponents (LIB)
│   ├── datatable                           diretório do VRDataTable (LIB)
│   ├── design-guide                        diretório do VRDesignGuide (LIB)
│   ├── table                               diretório do VRTable (LIB)
├── public                                  diretório de arquivos estáticos da aplicação
|   ├── datatables                          diretório de arquivos do VRDataTable para visualização
│   ├── docs                                diretório de arquivos (.md) de documentação
│   ├── icons                               diretório de arquivos de ícones para visualização
│   ├── mock                                diretório de arquivos de mock para visualização
│   ├── table                               diretório de arquivos do VRTable para visualização
│   ├── translations-i18n                   diretório de arquivos de tradução para visualização
│   ├── sidebar-menu-app.json               arquivo de configuração do menu lateral da aplicação
├── src                                     diretório de arquivos estáticos da aplicação
│   ├── app                                 código fonte da aplicação
│   │   ├── pages                           diretório de páginas
│   │   │   ├── components                  diretório de visualização do VRComponents
│   │   │   ├── datatable                   diretório de visualização do VRDataTable
│   │   │   ├── design-guide                diretório de visualização do VRDesignGuide
│   │   │   ├── table                       diretório de visualização do VRTable
│   │   │   └── home                        diretório de visualização da Home
│   │   └── shared                          diretório de arquivos compartilhados com uma ou mais dependencias
│   │       ├── code-mirror                 diretório de configuração do CodeMirror
│   │       ├── components                  diretório para agrupamento de componentes compartilhados
│   │       ├── constants                   diretório para agrupamento de constantes compartilhadas
│   │       ├── enums                       diretório para agrupamento de enumeradores compartilhados
│   │       ├── interfaces                  diretório para agrupamento de interfaces compartilhados
│   │       ├── models                      diretório para agrupamento de models compartilhados
│   │       └── pipes                       diretório para agrupamento de pipes compartilhados
│   │       └── services                    diretório para agrupamento de enumeradores compartilhados
│   │       └── translator                  diretório para agrupamento de tradutores compartilhados
│   │       └── types                       diretório para agrupamento de tipos compartilhados
```
