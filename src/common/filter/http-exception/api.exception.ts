import { HttpException, HttpStatus } from '@nestjs/common';
import { ApiErrorCode } from 'src/common/enums/api-error-code.enum';
export class ApiException extends HttpException {
  constructor(
    private errorMessage: string,
    private errorCode: ApiErrorCode,
    statusCode: HttpStatus = HttpStatus.OK,
  ) {
    super(errorMessage, statusCode);
  }

  getErrorCode(): ApiErrorCode {
    return this.errorCode;
  }
  getErrorMessage(): string {
    return this.errorMessage;
  }
}
