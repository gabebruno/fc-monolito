import Address from "../../../modules/@shared/domain/value-object/address";
import {
  AddClientInputDto,
  AddClientOutputDto,
} from "../../../modules/client-adm/usecase/add-client/add-client.usecase.dto";

export interface AddClientPresenterRequest {
  id?: string;
  name: string;
  email: string;
  document: string;
  street: string;
  number: string;
  complement: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface AddClientPresenterResponse extends AddClientOutputDto {}

export class AddClientPresenter {
  static toDTO(request: AddClientPresenterRequest): AddClientInputDto {
    return {
      id: request.id,
      name: request.name,
      email: request.email,
      document: request.document,
      address: new Address(
        request.street,
        request.number,
        request.complement,
        request.city,
        request.state,
        request.zipCode
      ),
    };
  }

  static toResponse(output: AddClientOutputDto): AddClientPresenterResponse {
    return output;
  }
}
