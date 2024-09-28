// Configure email
const nodeMailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

//------------------ Send Password Email ------------------//
const sendPasswordEmail = async (to, subject, data) => {
  try {
    // Load the HTML template for the password email
    const templatePath = path.join(__dirname, "../templates/PassengerEmailTemplate.html");
    let htmlContent = fs.readFileSync(templatePath, "utf8");
    // Compile the HTML template using Handlebars
    const template = handlebars.compile(htmlContent);
    const htmlToSend = template(data); // Inject data into the HTML template

    // Create a transport for sending the email
    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASSWORD, // Your email password
      },
    });

    // Configure email options
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: htmlToSend, // HTML content generated from the template
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    return true; // Return true on success
  } catch (error) {
    console.error("ERROR sending password email: " + error.message); // Log error
    return false; // Return false on error
  }
};

//------------------ Send Email ------------------//
const sendEmail = async (res, to, subject, data) => {
  try {
    const templatePath = path.join(
      __dirname,
      "../templates/EmailTemplete.html"
    );
    let htmlContent = fs.readFileSync(templatePath, "utf8");

    const template = handlebars.compile(htmlContent);
    const htmlToSend = template(data);

    const transporter = nodeMailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: to,
      subject: subject,
      html: htmlToSend,
    };

    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error("ERROR " + error.message);
    return false;
  }
};
//----------------------------------------------//

//------------------ Export Module--------------//
module.exports = {
  sendEmail,
  sendPasswordEmail,
};
//----------------------------------------------//
