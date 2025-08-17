const siteModel = require("../models/siteChange");
const createError = require("../utils/error-message");

const changeSite = async (req, res, next) => {
    try {
        const setting = await siteModel.findOne();
        res.locals.setting = setting;
        next();
    } catch (error) {
        next(createError("Something went wrong", 500));
    }
};

module.exports = changeSite;