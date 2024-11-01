// src/middleware/session.middleware.js
const checkSession = (req, res, next) => {
    if (req.session && req.session.codusu) {
        res.locals.userSession = req.session;
    }
    next();
};

module.exports = checkSession;