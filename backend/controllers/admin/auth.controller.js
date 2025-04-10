var { User } = require("../../models");
const authService = require("../../services/auth.service");
const { to, ReE, ReS, TE } = require("../../services/util.service");
const { Op ,Sequelize} = require("sequelize");
const CONFIG = require("../../config/config.json");
const app = require('../../services/app.service');
const config = require('../../config/app.json')[app['env']];
const jwt = require("jsonwebtoken");
const helper = require("../../helpers/fileupload.helper");
const sequelize = new Sequelize('mysql://user:password@localhost:3306/mydb');

const login = async function (req, res) {
  const body = req.body;
  let checkUser = await User.findOne({
    attributes: [
      'id','name', 'email','password', 'interprice', 'otp', 'status', 'is_profile_flag',
      [sequelize.fn('CONCAT', 'http://165.232.142.62:8002/storage/images/', sequelize.col('profile_pic')), 'fullurl']
    ],
    
    where: {
      email: body.email
    }
  });

  if (!checkUser) return ReE(res, { message: "Please enter the registered email address. The user not registered with us" }, 400);

  const result = await bcrypt_p.compare(body.password, checkUser.password)
  if (!result) return ReE(res, { message: "The password you entered is incorrect please try again to login" }, 400);
  const token = jwt.sign({ user_id: checkUser.id, email: checkUser.email }, CONFIG.jwt_encryption, { expiresIn: '365d' });
  return ReS(res, { user: checkUser, token: token });
};
const Register = async function (req, res) {
  try {
    let body = req.body;
    let checkUser = await User.findOne({
      where: {
        email: body.email
      }
    });
    if (checkUser) return ReE(res, { message: "User already exits please login!" }, 400);
    const user = await User.create({
      email: body.email,
      password: body.password,
      is_profile_flag: '0',
    });

    if (user) {
      return ReS(res, { user: user, message: "User Register successfully." }, 200);
    }

  } catch (error) {
    return ReE(res, { message: "Somthing Went Wrong", err: error }, 200);
  }
};
const fetchUser = async function (req, res) {
  try {
    let body = req.body;
    let userId = req.user.id
    const data = await User.findOne({
      attributes: [
        'id', 'email','profile_pic', 'interprice', 'otp', 'status', 'is_profile_flag'
        // [sequelize.fn('CONCAT', 'http://165.232.142.62:8002/storage/images/', sequelize.col('profile_pic')), 'fullurl']
      ],
      where: { id: userId }
    });
    if (!data) {
      return ReE(res, { message: "No Data Found" }, 200);
    }
    return ReS(res, { data: data, message: "success" });
  } catch (error) {
    return ReE(res, { message: "Somthing Went Wrong", err: error }, 200);
  }
};

const updateRegister = async function (req, res) {

  try {
    const body = req.body;
    const files = req.files;
    let userId = req.user.id
    const baseFileUploadPath = `${config.IMAGE_RELATIVE_PATH}/profile_pic`;
    let relativePath = "";
    if (files) {
      if (files.profile_pic) {
        const fileName = Date.now() + '-' + files.profile_pic.name;
        relativePath = "profile_pic/" + fileName;
        const fileUpload = await helper.fileUpload(fileName, files.profile_pic, baseFileUploadPath);
        if (!fileUpload) {
          return ReE(res, { message: "Something went wrong" }, 200);
        }
      }
    }
    const getUserImage = await User.findOne({
      where: {
        id: userId
      }
    });

    await User.update({
      name: body.name,
      status: body.status,
      interprice: body.interprice,
      is_profile_flag: "1",
      profile_pic: relativePath !== "" ? relativePath : getUserImage.profile_pic,
    },
      {
        where: { id: userId }
      });

    return ReS(res, { message: "User has been updated successfully." }, 200);
  } catch (error) {
    console.log(error);
    return ReE(res, { message: "Somthing Went Wrong", err: error }, 200);
  }

};
const deleteUser = async function (req, res) {
  try {
    let userId = req.user.id
    const user = await User.destroy({
      where: { id: userId }
    }).then(function (result) {
      if (!result) return ReE(res, { message: "Somthing Went Wrong Please try after sometime." }, 400);
      return ReS(res, { message: "User has been deleted successfully." }, 200);
    }).catch(function (err) {
      return ReE(res, { message: "Somthing Went Wrong", err: err.errors }, 200);
    });

  } catch (error) {
    return ReE(res, { message: "Somthing Went Wrong", err: error }, 200);
  }
}
module.exports = {
  login,
  Register,
  fetchUser,
  updateRegister,
  deleteUser
};
