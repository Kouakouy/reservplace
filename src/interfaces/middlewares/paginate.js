export const paginate = (req, res, next) => {
  req.pagination = {
    page: Math.max(1, parseInt(req.query.page) || 1),
    limit: Math.min(100, Math.max(1, parseInt(req.query.limit) || 10)),
  };
  next();
};
