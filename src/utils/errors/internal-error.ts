export class InternalError extends Error {
  constructor(
    public message: string,
    protected code: number = 500,
    protected description?: string
  ) {
    super(message);
    this.name = this.constructor.name;

    // mostra o erro a partir da onde ele foi chamado, ou seja, pula essa classe
    Error.captureStackTrace(this, this.constructor);
  }
}
