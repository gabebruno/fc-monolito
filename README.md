# Full Cycle Monolito

## Desafio 1 - Modulo de Invoice

Este repositorio contem a implementacao do modulo `invoice` seguindo a arquitetura de Modular Monolith com:

- Domain (`Invoice`, `InvoiceItem`, `Address`)
- Gateway
- Repository (Sequelize)
- Use Cases (`GenerateInvoiceUseCase`, `FindInvoiceUseCase`)
- Facade
- Factory
- Testes automatizados de Use Cases e Facade

## Como rodar os testes

Requisito recomendado:

- Node.js 18.x

Instalacao de dependencias:

```bash
npm install
```

Rodar todos os testes:

```bash
npm test
```

Rodar apenas os testes do modulo invoice:

```bash
npm test -- src/modules/invoice
```

## Observacao de ambiente

Em alguns ambientes com Node 20 e caminho com espacos, o `sqlite3` pode falhar no `npm install`. Se ocorrer, use Node 18 ou mova o projeto para um caminho sem espacos.
