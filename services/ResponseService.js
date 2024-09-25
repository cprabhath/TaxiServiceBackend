const ResponseService = (res, title, status, message) => {
  return res.status(status).json({
    title: title,
    status: status,
    message: message,
  });
};

module.exports = ResponseService;
