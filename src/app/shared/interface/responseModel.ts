export interface responseModel<T> {
    IsValid: boolean;
    Message: string
    data: T
  }