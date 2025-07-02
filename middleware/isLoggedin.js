const jwt = require('jsonwebtoken');

const isLoggedin = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return res.redirect('/admin/');
    }
    try {
        const tokenData = jwt.verify(token, process.env.JWT_SECRET);
        console.log(tokenData);
        req.id = tokenData.id;
        req.role = tokenData.role;
        req.fullname = tokenData.fullname;
        next();
    } catch (error) {
        res.status(401).send('Unauthorized : Invalid Token' );
    }
};

module.exports = isLoggedin;