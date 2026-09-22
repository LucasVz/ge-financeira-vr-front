# Gestão Financeira — Front-end

Interface web do sistema de gestão financeira da Clínica Rebeca Vaz. O projeto permite cadastrar os dados usados pela clínica, registrar entradas e saídas e acompanhar os resultados por meio de um painel e de relatórios visuais.

O front-end consome a API do back-end em `http://localhost:3000` e, em desenvolvimento, é executado em `http://localhost:3001`.

## Funcionalidades

- Painel com saldo, entradas, saídas e movimentações recentes;
- cadastro e listagem de categorias;
- cadastro e listagem de serviços vinculados a categorias;
- cadastro de formas de pagamento;
- registro e histórico de entradas;
- registro e histórico de saídas;
- relatórios com fluxo de caixa e receitas por serviço;
- layout responsivo para computadores e dispositivos móveis.

## Tecnologias

- Next.js 16;
- React 19;
- TypeScript;
- Tailwind CSS;
- React Query;
- Axios;
- Recharts;
- Base UI e Lucide Icons.

## Pré-requisitos

Antes de iniciar, instale:

- Node.js 20 ou superior;
- npm ou pnpm;
- o back-end deste projeto, executando na porta `3000`.

## Como executar

Abra um terminal nesta pasta e instale as dependências:

```bash
npm install
```

Inicie o servidor de desenvolvimento na porta `3001`:

```bash
npm run dev -- --port 3001
```

Acesse [http://localhost:3001](http://localhost:3001) no navegador.

Com pnpm, os comandos equivalentes são:

```bash
pnpm install
pnpm dev --port 3001
```

## Ordem recomendada para uso

Com o front-end e o back-end em execução:

1. Cadastre uma categoria;
2. cadastre um serviço e associe-o à categoria;
3. cadastre uma forma de pagamento;
4. registre entradas e saídas;
5. acompanhe os valores no painel e nos relatórios.

## Rotas da aplicação

| Rota | Tela |
| --- | --- |
| `/` | Painel financeiro |
| `/categorias` | Categorias |
| `/servicos` | Serviços |
| `/formas-pagamento` | Formas de pagamento |
| `/entradas` | Registro de entradas |
| `/saidas` | Registro de saídas |
| `/relatorios` | Relatórios visuais |

## Scripts disponíveis

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Inicia o ambiente de desenvolvimento |
| `npm run build` | Gera a versão de produção |
| `npm run start` | Executa a versão de produção já compilada |
| `npm run lint` | Verifica o código com ESLint |

Para executar uma versão de produção localmente:

```bash
npm run build
npm run start -- --port 3001
```

## Estrutura principal

```text
app/          Páginas e layout da aplicação
components/   Componentes visuais reutilizáveis
components/ui Componentes básicos da interface
services/     Comunicação HTTP com a API
lib/          Funções auxiliares e estado compartilhado
public/       Arquivos estáticos
```

## Integração com a API

Os módulos da pasta `services/` usam como endereço base:

```text
http://localhost:3000
```

Por isso, o back-end precisa estar ativo nessa porta para que cadastros, listagens e relatórios funcionem. Se o endereço da API mudar, atualize a constante `URL` nos arquivos da pasta `services/`.

## Solução de problemas

### A página abre, mas os dados não carregam

Confirme se a API responde em [http://localhost:3000](http://localhost:3000). Também verifique o terminal do back-end e se o PostgreSQL está ativo.

### A porta 3001 já está em uso

Encerre o processo que usa a porta ou execute o front-end em outra porta. Nesse caso, o endereço de acesso também mudará.

### Erro após instalar as dependências

Remova apenas a pasta `node_modules`, instale as dependências novamente e reinicie o servidor de desenvolvimento.
