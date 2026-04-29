import { Sequelize } from "sequelize-typescript";
import request from "supertest";
import app from "../express";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import { ProductModel } from "../../../modules/product-adm/repository/product.model";
import { InvoiceModel } from "../../../modules/invoice/repository/invoice.model";
import { InvoiceItemModel } from "../../../modules/invoice/repository/invoice-item.model";
import TransactionModel from "../../../modules/payment/repository/transaction.model";

describe("API E2E Tests", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      ClientModel,
      ProductModel,
      InvoiceModel,
      InvoiceItemModel,
      TransactionModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  describe("POST /products", () => {
    it("should create a product and return 201", async () => {
      const response = await request(app)
        .post("/products")
        .send({
          id: "prod-1",
          name: "Test Product",
          description: "Test Description",
          purchasePrice: 100,
          stock: 10,
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("name", "Test Product");
      expect(response.body).toHaveProperty("description");
      expect(response.body).toHaveProperty("purchasePrice", 100);
      expect(response.body).toHaveProperty("stock", 10);
    });

    it("should return 400 for invalid product data", async () => {
      const response = await request(app).post("/products").send({
        name: "Test",
        // Missing required fields
      });

      expect(response.status).toBe(400);
    });
  });

  describe("POST /clients", () => {
    it("should create a client and return 201", async () => {
      const response = await request(app)
        .post("/clients")
        .send({
          id: "client-1",
          name: "Test Client",
          email: "test@example.com",
          document: "12345678901",
          street: "Rua A",
          number: "10",
          complement: "Apt 1",
          city: "São Paulo",
          state: "SP",
          zipCode: "00000-000",
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("id");
      expect(response.body).toHaveProperty("name", "Test Client");
      expect(response.body).toHaveProperty("email", "test@example.com");
      expect(response.body).toHaveProperty("document", "12345678901");
    });

    it("should return 400 for invalid client data", async () => {
      const response = await request(app).post("/clients").send({
        name: "Test",
        // Missing required fields
      });

      expect(response.status).toBe(400);
    });
  });

  describe("POST /checkout", () => {
    it("should process checkout and return 201", async () => {
      await request(app)
        .post("/clients")
        .send({
          id: "client-checkout",
          name: "Checkout Client",
          email: "checkout@example.com",
          document: "99999999999",
          street: "Rua Checkout",
          number: "99",
          complement: "Casa",
          city: "Sao Paulo",
          state: "SP",
          zipCode: "00000-000",
        });

      await request(app)
        .post("/products")
        .send({
          id: "prod-checkout",
          name: "Checkout Product",
          description: "Product for checkout",
          purchasePrice: 100,
          stock: 5,
        });

      const response = await request(app)
        .post("/checkout")
        .send({
          clientId: "client-checkout",
          products: [{ id: "prod-checkout", quantity: 2 }],
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("orderId");
      expect(response.body).toHaveProperty("invoiceId");
      expect(response.body).toHaveProperty("paymentId");
      expect(response.body).toHaveProperty("status", "approved");
      expect(response.body).toHaveProperty("total", 200);
      expect(response.body.products).toHaveLength(1);

      const invoiceResponse = await request(app).get(
        `/invoice/${response.body.invoiceId}`
      );

      expect(invoiceResponse.status).toBe(200);
      expect(invoiceResponse.body).toHaveProperty("id", response.body.invoiceId);
      expect(invoiceResponse.body).toHaveProperty("total", 200);
    });
  });

  describe("GET /invoice/:id", () => {
    it("should return 404 for non-existent invoice", async () => {
      const response = await request(app).get("/invoice/non-existent-id");

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("error");
    });

    it("should return 200 and invoice data for existing invoice", async () => {
      // First, create an invoice via facade
      const InvoiceFacadeFactory = require("../../../modules/invoice/factory/invoice.facade.factory").default;
      const facade = InvoiceFacadeFactory.create();

      const generated = await facade.generate({
        name: "Test Invoice",
        document: "12345678901",
        street: "Rua A",
        number: "10",
        complement: "Apt 1",
        city: "São Paulo",
        state: "SP",
        zipCode: "00000-000",
        items: [
          { id: "item-1", name: "Item 1", price: 100 },
          { id: "item-2", name: "Item 2", price: 50 },
        ],
      });

      const response = await request(app).get(`/invoice/${generated.id}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", generated.id);
      expect(response.body).toHaveProperty("name", "Test Invoice");
      expect(response.body).toHaveProperty("document", "12345678901");
      expect(response.body).toHaveProperty("items");
      expect(response.body.items).toHaveLength(2);
      expect(response.body).toHaveProperty("total", 150);
    });
  });
});
