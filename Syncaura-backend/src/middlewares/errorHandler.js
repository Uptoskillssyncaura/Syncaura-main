// export const errorMiddleware = (err, req, res, next) => {
//   console.error(err);
//   const status = err.status || 500;
//   res.status(status).json({
//     message: err.message || 'Internal server error',
//     ...(err.details ? { details: err.details } : {})
//   });
// };


export const errorMiddleware = (err, req, res, next) => {
  console.error(err);

  // ✅ DO NOT TOUCH RESPONSE IF FILE IS ALREADY SENT
  if (res.headersSent) {
    return next(err);
  }

  const status = err.status || 500;
  res.status(status).json({
    message: status >= 500
        ? "Internal server error"
        : err.message,
    ...(err.details ? { details: err.details } : {})
  });
};
