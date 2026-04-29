import { Sequelize } from "sequelize-typescript";
import { InvoiceItemModel } from "../../repository/invoice-item.model";
import { InvoiceModel } from "../../repository/invoice.model";
import InvoiceRepository from "../../repository/invoice.repository";
import GenerateInvoiceUseCase from "./generate-invoice.usecase";

describe("GenerateInvoiceUseCase test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([InvoiceModel, InvoiceItemModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should generate an invoice", async () => {
    const repository = new InvoiceRepository();
    const usecase = new GenerateInvoiceUseCase(repository);

    const input = {
      name: "Gabriel",
      document: "123456789",
      street: "Rua A",
      number: "10",
      complement: "Casa",
      city: "Sao Paulo",
      state: "SP",
      zipCode: "00000-000",
      items: [
        { id: "item-1", name: "Item 1", price: 100 },
        { id: "item-2", name: "Item 2", price: 50 },
      ],
    };

    const output = await usecase.execute(input);

    expect(output.id).toBeDefined();
    expect(output.name).toBe(input.name);
    expect(output.document).toBe(input.document);
    expect(output.street).toBe(input.street);
    expect(output.number).toBe(input.number);
    expect(output.complement).toBe(input.complement);
    expect(output.city).toBe(input.city);
    expect(output.state).toBe(input.state);
    expect(output.zipCode).toBe(input.zipCode);
    expect(output.items).toHaveLength(2);
    expect(output.total).toBe(150);

    const invoiceDb = await InvoiceModel.findOne({ where: { id: output.id } });
    const itemsDb = await InvoiceItemModel.findAll({
      where: { invoiceId: output.id },
    });

    expect(invoiceDb).toBeDefined();
    expect(invoiceDb.name).toBe(input.name);
    expect(invoiceDb.document).toBe(input.document);
    expect(invoiceDb.total).toBe(150);
    expect(itemsDb).toHaveLength(2);
  });
});
