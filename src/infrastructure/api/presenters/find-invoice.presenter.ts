import {
  FindInvoiceUseCaseInputDTO,
  FindInvoiceUseCaseOutputDTO,
} from "../../../modules/invoice/usecase/find-invoice/find-invoice.usecase.dto";

export interface FindInvoicePresenterResponse extends FindInvoiceUseCaseOutputDTO {}

export class FindInvoicePresenter {
  static toDTO(id: string): FindInvoiceUseCaseInputDTO {
    return { id };
  }

  static toResponse(
    output: FindInvoiceUseCaseOutputDTO
  ): FindInvoicePresenterResponse {
    return output;
  }
}
