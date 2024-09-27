const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const twilioNumber = process.env.TWILIO_PHONE_NUMBER;
const clientNumber = process.env.SMS_PHONE_NUMBER;
const client = require("twilio")(accountSid, authToken);

const SMSService = async  (message) => {
  await client.messages
    .create({
      body: message,
      from: twilioNumber,
      to: clientNumber,
    })
    .then(
        (message) => console.log(message.sid),
    )
    .catch(console.error);
};

module.exports = {
  SMSService,
};
