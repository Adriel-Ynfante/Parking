const authMiddleware = {
    isAuthenticated: (req, res, next) => {
        if (req.session.user) {
            return next();
        }
        req.flash('error_msg', 'Por favor inicie sesión para acceder');
        res.redirect('/register');
    },

    isAdmin: (req, res, next) => {
        if (req.session.user && req.session.user.role === 'admin') {
            return next();
        }
        req.flash('error_msg', 'No tiene permisos para acceder a esta página');
        res.redirect('/dashboard');
    },

    isCompany: (req, res, next) => {
        if (req.session.user && req.session.user.role === 'company') {
            return next();
        }
        req.flash('error_msg', 'No tiene permisos para acceder a esta página');
        res.redirect('/dashboard');
    }
};

module.exports = authMiddleware;