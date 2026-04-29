import {
  FindInvoiceUseCaseInputDTO,
  FindInvoiceUseCaseOutputDTO,
} from "../usecase/find-invoice/find-invoice.usecase.dto";
import {
  GenerateInvoiceUseCaseInputDto,
  GenerateInvoiceUseCaseOutputDto,
} from "../usecase/generate-invoice/generate-invoice.usecase.dto";

export interface FindInvoiceFacadeInputDto extends FindInvoiceUseCaseInputDTO {}
export interface FindInvoiceFacadeOutputDto
  extends FindInvoiceUseCaseOutputDTO {}

export interface GenerateInvoiceFacadeInputDto
  extends GenerateInvoiceUseCaseInputDto {}
export interface GenerateInvoiceFacadeOutputDto
  extends GenerateInvoiceUseCaseOutputDto {}

export default interface InvoiceFacadeInterface {
  find(input: FindInvoiceFacadeInputDto): Promise<FindInvoiceFacadeOutputDto>;
  generate(
    input: GenerateInvoiceFacadeInputDto
  ): Promise<GenerateInvoiceFacadeOutputDto>;
}
