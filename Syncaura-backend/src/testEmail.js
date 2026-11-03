import { sendEmail } from "./services/emailService.js";

await sendEmail(
  "1032241826@tcetmumbai.in",
  "Bank Of Baroda",
  "$1,00,000 is been credited from a foreign company"
);

console.log("Email sent!");