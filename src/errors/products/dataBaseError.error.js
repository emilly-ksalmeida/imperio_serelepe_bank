export class DatabaseError extends Error {
  constructor(message = "Erro de banco de dados", options) {
    super(message, options);
    this.name = "DatabaseError";
  }
}
