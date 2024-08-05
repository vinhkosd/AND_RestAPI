const nodemailer = require('nodemailer');

const sendEmail = async (email, title, mailContent) => {
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: 'vinh8c059@gmail.com', // generated ethereal user
          pass: 'ydjv inbm ilaz hcsz', // generated ethereal password
        },
      });
  
      // send mail with defined transport object
      let info = await transporter.sendMail({
        from: '"Le Vinh <ydjv inbm ilaz hcsz>', // sender address
        to: email, // list of receivers
        subject: title, // Subject line
        text: title, // plain text body
        html: mailContent, // html body
      });
}

exports.sendEmail = sendEmail;