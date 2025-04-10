const { User } = require('../models');
const { ReE } = require('../services/util.service');
const { Op } = require('sequelize');

let checkUser = async function (req, res, next) {
    // let authToken = req.header('authorization').substring(7);
    // console.log(req.user)

    let user_id = req.user.id;
    let user = await User.findOne({
        where: {
            [Op.and]: [
                { id: user_id },
                //{ email: req.user.email }
                // { auth_token: authToken }
            ]
        }
    });

    if (!user) return ReE(res, { static_key: 'UNAUTHORIZED_USER', message: "Unauthorized user." }, 401);

    user = req.user;

    next();
}
module.exports.checkUser = checkUser;