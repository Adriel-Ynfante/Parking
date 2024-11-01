const db = require('../config/database');

const companyMiddleware = async (req, res, next) => {
    try {
        if (!req.session.user || !req.session.user.companyId) {
            throw new Error('No company associated');
        }

        const [company] = await db.query(
            'SELECT * FROM companies WHERE id = ?',
            [req.session.user.companyId]
        );

        if (!company.length) {
            throw new Error('Company not found');
        }

        req.company = company[0];
        next();
    } catch (error) {
        req.flash('error_msg', 'Error de acceso empresarial');
        res.redirect('/dashboard');
    }
};

module.exports = companyMiddleware;