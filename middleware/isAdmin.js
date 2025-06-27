const isAdmin = async (req, res, next) => {
    if (req.role === 'Admin') {
        next();
    } else {
        res.redirect('/admin/dashboard');
    }
};

module.exports = isAdmin