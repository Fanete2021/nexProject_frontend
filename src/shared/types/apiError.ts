interface Detail {
  input: string,
  location: string,
  message: string,
  type: string
}

export interface ApiError {
  errDetails?: string;
  details?: Detail[],
  httpStatusCode: string;
  message?: string;
  operationId: string;
  timestamp: string;
}
