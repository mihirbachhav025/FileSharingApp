const nodemailer = require("nodemailer");
module.exports = {
  sendMail: async (sender, receiver, link, filename, size, expires) => {
    let transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT,
      secure: false,
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    // send mail with defined transport object
    let info = await transporter.sendMail({
      from: `FileShare ${sender}`,
      to: receiver, // list of receivers
      subject: `FileShare has got a file for you`, // Subject line
      html:`<p>${sender} has sent you a file: ${filename} of ${size} \n Paste in FileShare app to download  <p>
      <buttton><a href="${link}">Link<a/></button>`
       // plain text body
    });
  },
};
