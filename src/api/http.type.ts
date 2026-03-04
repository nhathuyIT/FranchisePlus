export interface HttpRequestConfig<
  TData = unknown,
  TParams extends Record<string, unknown> = Record<string, unknown>,
> {
  url: string;
  data?: TData;
  params?: TParams;
  headers?: Record<string, string>;
}

export interface HttpClient {
  get<T, P extends Record<string, unknown> = Record<string, unknown>>(
    config: HttpRequestConfig<never, P>,
  ): Promise<T | null>;

  post<T, D = unknown>(config: HttpRequestConfig<D>): Promise<T | null>;

<<<<<<< HEAD
  /**
   * POST request that bypasses the automatic camelCase → snake_case interceptor.
   * Use this when the backend expects a specific format that differs from snake_case.
   * The payload is sent exactly as provided (JSON stringified).
   */
  postRaw<T, D = unknown>(config: HttpRequestConfig<D>): Promise<T | null>;

=======
>>>>>>> dev
  postPaginated<T, D = unknown>(
    config: HttpRequestConfig<D>,
  ): Promise<ApiPaginatedResponse<T>>;

<<<<<<< HEAD
  /**
   * POST paginated request that bypasses the automatic camelCase → snake_case interceptor.
   * Use this for search APIs where backend expects camelCase keys.
   */
  postPaginatedRaw<T, D = unknown>(
    config: HttpRequestConfig<D>,
  ): Promise<ApiPaginatedResponse<T>>;

=======
>>>>>>> dev
  put<T, D = unknown>(config: HttpRequestConfig<D>): Promise<T | null>;

  patch<T, D = unknown>(config: HttpRequestConfig<D>): Promise<T | null>;

  delete<T, P extends Record<string, unknown> = Record<string, unknown>>(
    config: HttpRequestConfig<never, P>,
  ): Promise<T | null>;
}

export interface ApiSuccessResponse<T> {
  success: true;
  data: T | null;
}

export interface ApiPaginatedResponse<T> {
  success: true;
  data: T[];
  pageInfo: {
    pageNum: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface ApiErrorResponse {
  success: false;
  message?: string | null;
  errorCode?: string | null;
  errors?: ApiErrorItem[] | null;
}

export interface ApiErrorItem {
  message: string;
  field?: string;
}

export class HttpError extends Error {
  status: number;
  code?: string;
  errors?: ApiErrorItem[];

  constructor(params: {
    status: number;
    message: string;
    code?: string;
    errors?: ApiErrorItem[];
  }) {
    super(params.message);
    this.status = params.status;
    this.code = params.code;
    this.errors = params.errors;
  }
}
