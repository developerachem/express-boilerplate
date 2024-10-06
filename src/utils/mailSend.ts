import nodemailer from "nodemailer";

interface MailProps {
  to: string;
  subject: string;
  message: string;
  from?: string;
}
export const sendMail = (data: MailProps) => {
  console.log("Email Send Processing...");
  const { to, subject, message } = data;
  // * Mail Option
  const mailOptions = {
    from: data.from ? data.from : process.env.MY_MAIL,
    to: to,
    subject: subject || "Test Subject",
    html: message,
    // attachments: [
    //   {
    //     filename: "Invoice.pdf",
    //     path: pdfPath,
    //   },
    // ],
  };

  const transporter = nodemailer.createTransport({
    secure: true,
    host: "smtp.gmail.com",
    port: Number(process.env.MAIL_PORT), // Convert string to number
    auth: {
      user: process.env.MY_MAIL,
      pass: process.env.MAIL_PASSWORD,
    },
  });

  try {
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent successfully: " + info.response);
      }
    });
  } catch (error) {
    console.log("Catch Email Send Error: ===>", error);
  }
};
