import { AppError } from "./app.error.js";

export default function errorHandler(err, req, res, next) {
  if (res.headersSent) {
    return next(err);
  }
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      validationErrors: err.validationErrors,
    });
  }
  res.status(500).json({ error: err.message });
}
