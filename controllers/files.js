const File = require("../models/file");
const { v4: uuid4 } = require("uuid");
const { json } = require("body-parser");
const sendEmail = require("../services/emailservice");
const { sendMail } = require("../services/emailservice");
const fs = require("fs");
module.exports = {
  postFile: async (req, res, next) => {
    console.log(req.file);
    //Store file
    if (!req.file) return res.json({ error: "File is required" });
    //Store into Database
    const file = new File({
      filename: req.file.filename,
      uuid: uuid4(),
      path: req.file.path,
      size: req.file.size,
    });
    const response = await file.save();
    //Response Link
    setTimeout(() => {
      fs.unlink(response.path, () => {
        File.findOneAndDelete({ uuid: response.uuid });
      });
      //added 24 hour timeout
    }, 1000 * 60 * 60 * 24);
    console.log("Added File timeout");
    return res.json({
      file: `${process.env.APP_BASE_URL}/api/v1/files/${response.uuid}`,
      fileuuid: response.uuid,
    });
  },
  getFileDetails: async (req, res, next) => {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) return res.status(404).json({ error: "file doesn't exist" });
    return res.status(200).json({
      uuid: file.uuid,
      filename: file.filename,
      filesize: file.size,
      downloadlink: `${process.env.APP_BASE_URL}/api/v1/files/download/${file.uuid}`,
    });
  },
  getFile: async (req, res, next) => {
    const file = await File.findOne({ uuid: req.params.uuid });
    if (!file) return res.status(404), json({ error: "Link has expired" });
    const filePath = `${__dirname}/../${file.path}`;
    let normalizedPath = filePath.replace(/\\/g, "/");
    // console.log(filePath);
    // console.log(normalizedPath);
    res.download(normalizedPath);
    // console.log(filePath);
    // // res.download(filePath);
    // res.json({
    //   filePath: normalizedPath,
    // });
  },
  sendEmail: async (req, res, next) => {
    console.log("hello 1");
    const { uuid, emailTo, emailFrom } = req.body;
    if (!uuid || !emailFrom || !emailFrom)
      return res.status(422).json({ error: "All fields are required" });
    const file = await File.findOne({ uuid });
    if (!file) return res.status(404).json({ error: "file doesn't exist" });
    if (file.sender) {
      return res.status(422).json({ error: "Email already sent" });
    }
    const filePath = `${__dirname}/../${file.path}`;
    let link = `${process.env.APP_BASE_URL}/api/v1/files/${uuid}`;
    file.sender = emailFrom;
    file.receiver = emailTo;
    const filename = file.filename;
    const size = `${parseInt(file.size / 1024)} kb`;
    const expires = "24 hours";
    await sendMail(emailFrom, emailTo, link, filename, size, expires);
    const respsonse = await file.save();
    res.end();
  },
};
