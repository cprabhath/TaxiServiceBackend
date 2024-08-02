const authGuard = (req, res, next) => {
    res.status(200).json({
        message: "Auth Guard Middleware"
    });
    next();
};

module.exports = authGuard;