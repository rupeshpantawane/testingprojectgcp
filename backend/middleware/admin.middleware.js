const { User } = require('../models');
const { to, ReE } = require('../services/util.service');

let checkUser = async function (req, res, next) {

    let user, err;
    [err, user] = await to(User.findOne({ 
            where: { id: req.user.id },
            attributes: [
                'id','email','mobile','status'
            ],
     }));
    if (err) return ReE(res, { static_key: 'UNAUTHORIZED_USER', message: "Unauthorized user." }, 401);

    user = req.user;
    next();
}
let adminUser = async function (req, res, next) {

    let user, err;
    [err, user] = await to(User.findOne({ 
            where: { id: req.user.id, status:'admin'},
            attributes: [
                'id','email','mobile','status'
            ],
     }));
     if(!user)return ReE(res, { static_key: 'UNAUTHORIZED_USER', message: "Unauthorized user." }, 401);
    if (err) return ReE(res, { static_key: 'UNAUTHORIZED_USER', message: "Unauthorized user." }, 401);

    user = req.user;
    next();
}
module.exports.checkUser = checkUser;
module.exports.adminUser = adminUser;