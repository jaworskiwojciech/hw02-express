const sgMail = require("@sendgrid/mail");
require("dotenv").config();

const sendEmail = ({ to, link }) => {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  const msg = {
    to,
    from: "jwitmailer@gmail.com",
    subject: "Here is your verification link!",
    text: `Please click on the enclosed link to activate your account: ${link}`,
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};

module.exports = sendEmail;
