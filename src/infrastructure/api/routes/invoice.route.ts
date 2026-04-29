import { Router } from "express";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.facade.factory";
import { FindInvoicePresenter } from "../presenters/find-invoice.presenter";

const router = Router();

router.get("/:id", async (req, res) => {
  try {
    const facade = InvoiceFacadeFactory.create();
    const input = FindInvoicePresenter.toDTO(req.params.id);
    const output = await facade.find(input);
    const response = FindInvoicePresenter.toResponse(output);
    res.status(200).json(response);
  } catch (err) {
    res.status(404).json({ error: (err as Error).message });
  }
});

export default router;
