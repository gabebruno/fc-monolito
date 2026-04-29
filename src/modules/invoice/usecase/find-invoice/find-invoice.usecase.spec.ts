import { Sequelize } from "sequelize-typescript";
import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Invoice from "../../domain/invoice.entity";
import InvoiceItem from "../../domain/invoice-item.entity";
import { InvoiceItemModel } from "../../repository/invoice-item.model";
import { InvoiceModel } from "../../repository/invoice.model";
import InvoiceRepository from "../../repository/invoice.repository";
import FindInvoiceUseCase from "./find-invoice.usecase";

describe("FindInvoiceUseCase test", () => {
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

  it("should find an invoice", async () => {
    const repository = new InvoiceRepository();

    const invoice = new Invoice({
      id: new Id("invoice-1"),
      name: "Gabriel",
      document: "123456789",
      address: new Address("Rua A", "10", "Casa", "Sao Paulo", "SP", "00000-000"),
      items: [
        new InvoiceItem({ id: new Id("item-1"), name: "Item 1", price: 100 }),
        new InvoiceItem({ id: new Id("item-2"), name: "Item 2", price: 50 }),
      ],
    });

    await repository.add(invoice);

    const usecase = new FindInvoiceUseCase(repository);
    const output = await usecase.execute({ id: "invoice-1" });

    expect(output.id).toBe("invoice-1");
    expect(output.name).toBe("Gabriel");
    expect(output.document).toBe("123456789");
    expect(output.address.street).toBe("Rua A");
    expect(output.address.number).toBe("10");
    expect(output.address.complement).toBe("Casa");
    expect(output.address.city).toBe("Sao Paulo");
    expect(output.address.state).toBe("SP");
    expect(output.address.zipCode).toBe("00000-000");
    expect(output.items).toHaveLength(2);
    expect(output.total).toBe(150);
    expect(output.createdAt).toBeDefined();
  });
});
