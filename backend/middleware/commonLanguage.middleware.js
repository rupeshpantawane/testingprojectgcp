const { SystemSetting } = require('../models');
const { to, ReE } = require('../services/util.service');

let commonLanguage = async function (req, res, next) {

    let systemSetting, err;
    
    [err, systemSetting] = await to(SystemSetting.findOne({ where: { config_keyh: "language" } }));
    if (err) return ReE(res, { static_key: 'UNAUTHORIZED_USER', message: "Unauthorized user." }, 401);

    systemSetting = req.systemSetting;
    next();
}

module.exports.commonLanguage = commonLanguage;