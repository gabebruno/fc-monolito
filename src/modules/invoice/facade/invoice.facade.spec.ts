import { Sequelize } from "sequelize-typescript";
import InvoiceFacadeFactory from "../factory/invoice.facade.factory";
import { InvoiceItemModel } from "../repository/invoice-item.model";
import { InvoiceModel } from "../repository/invoice.model";

describe("InvoiceFacade test", () => {
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

  it("should generate and find an invoice", async () => {
    const facade = InvoiceFacadeFactory.create();

    const generated = await facade.generate({
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
    });

    expect(generated.id).toBeDefined();
    expect(generated.total).toBe(150);

    const found = await facade.find({ id: generated.id });

    expect(found.id).toBe(generated.id);
    expect(found.name).toBe("Gabriel");
    expect(found.document).toBe("123456789");
    expect(found.items).toHaveLength(2);
    expect(found.total).toBe(150);
    expect(found.createdAt).toBeDefined();
  });
});
