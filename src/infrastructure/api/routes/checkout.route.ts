import { Router } from "express";
import { v4 as uuidv4 } from "uuid";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.facade.factory";
import PaymentFacadeFactory from "../../../modules/payment/factory/payment.facade.factory";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import { ProductModel } from "../../../modules/product-adm/repository/product.model";

const router = Router();

type CheckoutInput = {
  clientId: string;
  products: Array<{ id: string; quantity: number }>;
};

router.post("/", async (req, res) => {
  try {
    const input = req.body as CheckoutInput;

    if (!input.clientId || !input.products || input.products.length === 0) {
      return res.status(400).json({
        error: "Missing required fields: clientId, products",
      });
    }

    const clientFacade = ClientAdmFacadeFactory.create();
    const productFacade = ProductAdmFacadeFactory.create();
    const paymentFacade = PaymentFacadeFactory.create();
    const invoiceFacade = InvoiceFacadeFactory.create();

    const client = await clientFacade.find({ id: input.clientId });

    const invoiceItems: Array<{ id: string; name: string; price: number }> = [];

    for (const product of input.products) {
      const stock = await productFacade.checkStock({ productId: product.id });

      if (stock.stock < product.quantity) {
        return res.status(400).json({
          error: `Insufficient stock for product ${product.id}`,
        });
      }

      const persisted = await ProductModel.findOne({ where: { id: product.id } });

      if (!persisted) {
        return res.status(404).json({ error: `Product ${product.id} not found` });
      }

      for (let i = 0; i < product.quantity; i++) {
        invoiceItems.push({
          id: `${product.id}-${i + 1}`,
          name: persisted.name,
          price: persisted.purchasePrice,
        });
      }
    }

    const total = invoiceItems.reduce((acc, item) => acc + item.price, 0);
    const orderId = uuidv4();

    const payment = await paymentFacade.process({
      orderId,
      amount: total,
    });

    const invoice = await invoiceFacade.generate({
      name: client.name,
      document: client.document,
      street: client.address.street,
      number: client.address.number,
      complement: client.address.complement,
      city: client.address.city,
      state: client.address.state,
      zipCode: client.address.zipCode,
      items: invoiceItems,
    });

    res.status(201).json({
      orderId,
      invoiceId: invoice.id,
      paymentId: payment.transactionId,
      status: payment.status,
      total,
      products: input.products,
    });
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

export default router;
