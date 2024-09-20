const accountSid = process.env.ACCOUNTSID;
const authToken = process.env.AUTHTOKEN;
const client = require("twilio")(accountSid, authToken);
const ResponseService = require("../services/ResponseService");

const SMSService = async  (message) => {
  await client.messages
    .create({
      body: message,
      from: "+15623624258",
      to: "+94782560759",
    })
    .then(
        (message) => console.log(message.sid),
    )
    .catch(console.error);
};

module.exports = {
  SMSService,
};
