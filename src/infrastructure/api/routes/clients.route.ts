import { Router } from "express";
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import { ClientModel } from "../../../modules/client-adm/repository/client.model";
import { AddClientPresenter } from "../presenters/add-client.presenter";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { id, name, email, document, street, number, complement, city, state, zipCode } = req.body;

    if (!id || !name || !email || !document || !street || !number || !complement || !city || !state || !zipCode) {
      return res.status(400).json({
        error:
          "Missing required fields: id, name, email, document, street, number, complement, city, state, zipCode",
      });
    }

    const facade = ClientAdmFacadeFactory.create();
    const input = AddClientPresenter.toDTO(req.body);
    await facade.add(input);

    const persisted = await ClientModel.findOne({ where: { id: input.id } });

    if (!persisted) {
      return res.status(500).json({ error: "Client was not persisted" });
    }

    const response = AddClientPresenter.toResponse({
      id: persisted.id,
      name: persisted.name,
      email: persisted.email,
      document: persisted.document,
      address: input.address,
      createdAt: persisted.createdAt,
      updatedAt: persisted.updatedAt,
    });
    res.status(201).json(response);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

export default router;
