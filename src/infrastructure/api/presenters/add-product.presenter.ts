import {
  AddProductInputDto,
  AddProductOutputDto,
} from "../../../modules/product-adm/usecase/add-product/add-product.dto";

export interface AddProductPresenterRequest {
  id?: string;
  name: string;
  description: string;
  purchasePrice: number;
  stock: number;
}

export interface AddProductPresenterResponse extends AddProductOutputDto {}

export class AddProductPresenter {
  static toDTO(request: AddProductPresenterRequest): AddProductInputDto {
    return {
      id: request.id,
      name: request.name,
      description: request.description,
      purchasePrice: request.purchasePrice,
      stock: request.stock,
    };
  }

  static toResponse(output: AddProductOutputDto): AddProductPresenterResponse {
    return output;
  }
}
