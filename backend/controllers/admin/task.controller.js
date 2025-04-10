var { User } = require("../../models");
const { to, ReE, ReS, TE } = require("../../services/util.service");
const { Op, Sequelize } = require("sequelize");
const sequelize = new Sequelize('mysql://user:password@localhost:3306/mydb');
const CONFIG = require("../../config/config.json");
const app = require('../../services/app.service');
const config = require('../../config/app.json')[app['env']];
const moment = require('moment');
const helper = require("../../helpers/fileupload.helper");
const crypto = require("crypto");
const algorithm = "aes-256-cbc";
const key = Buffer.from("12345678901234567890123456789012", "utf8"); // Ensure encoding is set
const iv = Buffer.from("1234567890123456", "utf8"); 
// const key1 = crypto.randomBytes("12345678901234567890123456789012");  // 32-byte key
// const iv1 = crypto.randomBytes("1234567890123456"); 
// console.log("Base64 Encoded Key:", key1.toString('base64'));
// console.log("Base64 Encoded IV:", iv1.toString('base64'));
const encryptData = (text) => {
    let cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
    let encrypted = Buffer.concat([cipher.update(text, "utf8"), cipher.final()]);
    return encrypted.toString("base64"); // 🔥 Base64 Encode
};

const getUsers = async function (req, res) {
    try {
        let body = req.body;
        let dataId = [];
        let ageName = {};
        let idName = {};
        let jobName = {};
        let salaryName = {};
        let casteName = {};
        let locationName = {};
        let agebetweennn = parseInt(body.age);
        let agebetween = agebetweennn+5;
        if (body.salary != '' && body.salary != undefined) {
            salaryName = {
                salary: body.salary
            };
        }
        if (body.id != '' && body.id != undefined) {
            idName = {
                id: body.id
            };
          let result = await User.findOne({
                attributes: [
                    'id', 'gender'
                ],
                where: {
                    ...idName,
                },
            })
            dataId.push(result)
        }
        if (body.job != '' && body.job != undefined) {
            jobName = {
                job: body.job
            };
        }
        if (body.age != '' && body.age != undefined) {
            ageName = {
                age: { [Op.between]: [body.age, agebetween] }
            };
        }
        if (body.caste != '' && body.caste != undefined) {
            casteName = {
                caste: body.caste
            };
        }
        if (body.location != '' && body.location != undefined) {
            locationName = {
                location: body.location
            };
        }
        let data = await User.findAndCountAll({
            attributes: [
                'id', 'age', 'location', 'salary', 'location', 'caste','height',
                'education', 'marital_status', 'mobile', 'photo', 'gender','job','expectation'
            ],
            where: {
                ...ageName,
                ...casteName,
                ...locationName,
                ...jobName,
                ...salaryName,
                ...idName,
                gender:dataId.length === 0 ? body.gender:dataId[0].gender
            },
            // offset: (body.page - 1) * body.limit,
            // limit: body.limit,
            order: [
                ['id', 'DESC']
            ]
        });
        const originalData = JSON.stringify(data);
        const encryptedData = encryptData(originalData);
        // console.log(dataId.length)
        return ReS(res, { data: encryptedData, sr_no_start: (body.page - 1) * body.limit, message: "success" });
    }
    catch (error) {
        console.log(error)
        return ReE(res, { message: "Somthing Went Wrong", err: error }, 200);
    }
};
const createUser = async function (req, res) {
    try {
        let body = req.body;
        const files = req.files;
        const baseFileUploadPath = `${config.IMAGE_RELATIVE_PATH}/users`;
        let relativePath = "";
        if (files) {
            if (files.photo) {
              const fileName = Date.now() + '-' + files.photo.name;
              relativePath = "users/" + fileName;
              const fileUpload = await helper.fileUpload(fileName, files.photo, baseFileUploadPath);
              if (!fileUpload) {
                return ReE(res, { message: "Something went wrong" }, 200);
              }
            }
          }
            const data = await User.create({
                age: body.age == 'undefined'?null:body.age?body.age:null,
                location: body.location== 'undefined'?null:body.location?body.location:null,
                height: body.height== 'undefined'?null:body.height?body.height:null,
                salary: body.salary== 'undefined'?null:body.salary?body.salary:null,
                caste: body.caste== 'undefined'?null:body.caste?body.caste:null,
                education: body.education== 'undefined'?null:body.education?body.education:null,
                marital_status: body.marital_status== 'undefined'?null:body.marital_status?body.marital_status:null,
                mobile: body.mobile?body.mobile:null,
                gender: body.gender,
                expectation: body.expectation,
                job: body.job,
                photo: relativePath?relativePath:null
               
            })
        if (!data) return ReE(res, { message: "Somthing Went Wrong Please try after sometime." }, 400);
        return ReS(res, { data: data, message: "User created successfully." }, 200);

    } catch (error) {
        if (error instanceof ReferenceError) {
            return ReE(res, { message: error.message, err: error.message }, 200);
          }
        return ReE(res, { message: "Somthing Went Wrong", err: error }, 200);
    }
};

module.exports = {
    getUsers,
    createUser
};
