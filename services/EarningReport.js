const nodeMailer = require("nodemailer");
const fs = require("fs");
const path = require("path");
const handlebars = require("handlebars");

// Function to send the email
const sendEmail = async (to, subject, driverData, companyData, earningsData) => {
  try {
    const templatePath = path.join(__dirname, "../templates/report.html");
    const htmlContent = fs.readFileSync(templatePath, "utf8");

    const template = handlebars.compile(htmlContent);
    
    const data = {
      createdDate: new Date().toLocaleDateString(),
      company: {
        name: companyData.name,
        address: companyData.address,
        telephone: companyData.telephone,
      },
      driver: {
        name: driverData.name,
        address: driverData.address,
        nic: driverData.nic,
        telephone: driverData.telephone,
      },
      earnings: earningsData.earningsList,  // Array of individual earnings
      totalEarnings: earningsData.total,
      serviceFee: earningsData.serviceFee,
      tax: earningsData.tax,
      netEarnings: earningsData.netEarnings,
    };

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
    console.log("Email sent successfully");
    return true;
  } catch (error) {
    console.error("Failed to send email: " + error.message);
    return false;
  }
};

// Example usage
const driverData = {
  name: "John Doe",
  address: "123 Main Street, City, Country",
  nic: "987654321V",
  telephone: "+123 456 7890",
};

const companyData = {
  name: "XYZ Transport",
  address: "456 Business Road, City, Country",
  telephone: "+987 654 3210",
};

const earningsData = {
  earningsList: [
    { date: "2024-09-20", description: "Trip 1", amount: "$100" },
    { date: "2024-09-21", description: "Trip 2", amount: "$150" },
    { date: "2024-09-22", description: "Trip 3", amount: "$200" },
  ],
  total: "$450",
  serviceFee: "$50",
  tax: "$100",
  netEarnings: "$300",
};

// Call the sendEmail function
sendEmail("cprabhath119@gmail.com", "Earnings Report", driverData, companyData, earningsData);

module.exports = {
    sendEmail,
}
