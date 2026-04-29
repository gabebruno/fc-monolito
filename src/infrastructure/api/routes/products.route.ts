import { Router } from "express";
import ProductAdmFacadeFactory from "../../../modules/product-adm/factory/facade.factory";
import { ProductModel } from "../../../modules/product-adm/repository/product.model";
import { AddProductPresenter } from "../presenters/add-product.presenter";

const router = Router();

router.post("/", async (req, res) => {
  try {
    const { id, name, description, purchasePrice, stock } = req.body;

    if (!id || !name || !description || purchasePrice === undefined || stock === undefined) {
      return res.status(400).json({
        error: "Missing required fields: id, name, description, purchasePrice, stock",
      });
    }

    const facade = ProductAdmFacadeFactory.create();
    const input = AddProductPresenter.toDTO(req.body);
    await facade.addProduct(input);

    const persisted = await ProductModel.findOne({ where: { id: input.id } });

    if (!persisted) {
      return res.status(500).json({ error: "Product was not persisted" });
    }

    const response = AddProductPresenter.toResponse({
      id: persisted.id,
      name: persisted.name,
      description: persisted.description,
      purchasePrice: persisted.purchasePrice,
      stock: persisted.stock,
      createdAt: persisted.createdAt,
      updatedAt: persisted.updatedAt,
    });
    res.status(201).json(response);
  } catch (err) {
    res.status(400).json({ error: (err as Error).message });
  }
});

export default router;
