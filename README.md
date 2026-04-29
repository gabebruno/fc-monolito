# Full Cycle Monolito

## Desafios Implementados

### Desafio 1 - Módulo de Invoice
Modulo completo com Domain, Gateway, Repository (Sequelize), Use Cases, Facade e Factory.

Localizacao: `src/modules/invoice/`

### Desafio 2 - API e Testes End-to-End
Camada de API REST com Express e testes E2E com Supertest.

Endpoints implementados:
- `POST /products` - Cadastro de produtos
- `POST /clients` - Cadastro de clientes
- `POST /checkout` - Processamento de compra
- `GET /invoice/{id}` - Consulta de nota fiscal

Localizacao: `src/infrastructure/api/`

## Como rodar

### Instalacao
```bash
npm install
```

### Rodar testes (unitarios + E2E)
```bash
npm test
```

Rodar apenas testes do modulo invoice:
```bash
npm test -- src/modules/invoice
```

Rodar apenas testes E2E:
```bash
npm test -- src/infrastructure/api/__tests__
```

## Estrutura do Projeto

```
src/
├── modules/
│   ├── @shared/
│   ├── product-adm/
│   ├── client-adm/
│   ├── payment/
│   ├── store-catalog/
│   └── invoice/
└── infrastructure/
    └── api/
        ├── routes/
        ├── presenters/
        ├── __tests__/
        ├── express.ts
        └── server.ts
```

## Observacoes

- Node.js 18+ recomendado
- Todos os testes utilizam SQLite em memória
- Testes E2E cobrem validacao de status code (200/201/400/404) e corpo da resposta

