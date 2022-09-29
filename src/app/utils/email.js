import nodemailer from "nodemailer";

class Email {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.COMPANY_EMAIL_HOST,
      port: process.env.COMPANY_EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.COMPANY_EMAIL_USER,
        pass: process.env.COMPANY_EMAIL_PASSWORD,
      },
    });
  }

  async sendEmail(to, subject, text) {
    const mailOptions = {
      from: process.env.COMPANY_EMAIL_USER,
      to,
      subject,
      text,
    };

    await this.transporter.sendMail(mailOptions);
  }
}

export { Email };
