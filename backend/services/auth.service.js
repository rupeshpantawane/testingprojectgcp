const jwt = require("jsonwebtoken");
const { Op, Model } = require("sequelize");

const CONFIG = require("../config/config.json");
const { User, VerificationOtp } = require("../models");
const validator = require("validator");
const { to, TE, ReE } = require("../services/util.service");

const createUser = async (userInfo) => {
  let auth_info, err;

  auth_info = {};
  auth_info.status = "create";

  let user;

  if (validator.isEmail(userInfo.email)) {
    auth_info.method = "email";

    [err, user] = await to(
      User.findOne({
        where: {
          email: userInfo.email,
        },
      })
    );

    if (user) {
      return TE("Email has already been taken.");
    }

    [err, user] = await to(
      User.findOne({
        where: {
          avatar_unique_name: userInfo.avatar_unique_name,
        },
      })
    );

    if (user) {
      return TE("Avatar name has already been taken.");
    }
  } else {
    return TE("Invalid email.");
  }

  [err, user] = await to(User.create(userInfo));
  if (err) TE("Email has already been taken.");

  return { data: null, message: "Registration success" };
};

module.exports.createUser = createUser;

const authUser = async function (userInfo) {
  //returns token
  let auth_info = {};
  let user;
  auth_info.status = "login";

  [err, user] = await to(
    User.findOne({
      where: {
        email: userInfo.email,
        // user_status: {
        //     [Op.eq]: 1
        // }
      },
    })
  );

  if (!user) TE("Please enter the registered email address.");

  [err, user] = await to(user.comparePassword(userInfo.password));

  if (err) TE(err.message);

  return user;

};

module.exports.authUser = authUser;