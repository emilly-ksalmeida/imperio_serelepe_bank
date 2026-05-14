class ProductsError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = "ProductsError";
    this.statusCode = statusCode;
  }
}

export default ProductsError;
