// import { sendEmails } from "./services/emailService.js";
import { sendEmail } from "./utils/email.js";

await sendEmail(
  "1032241834@tcetmumbai.in",
  "Bank Of Baroda",
  "$1,00,000 is been credited from a foreign company"
);

console.log("Email sent!");