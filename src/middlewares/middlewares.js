export const handleNotFound = async (req, res) => {
  res.status(400).json({
    status_code: 404,
    message: 'Ruta no encontrada',
  });
};

export const handleServerError = (err, req, res, next) => {
  const errorStatusCode = err.statusCode || 500;
  const errorMessage = err.message || 'Internal Server Error';
  res.status(errorStatusCode).json({
    status_code: errorStatusCode,
    message: errorMessage,
  });
};
