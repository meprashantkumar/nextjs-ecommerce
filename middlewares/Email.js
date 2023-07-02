import { createTransport } from "nodemailer";

const Mail = async (email, subject, text) => {
  const transport = createTransport({
    host: "smtp.gmail.com",
    port: 465,
    auth: {
      user: "pkc243241@gmail.com",
      pass: "xsyleiflwcqytele",
    },
  });

  await transport.sendMail({
    from: "pkc243241@gmail.com",
    to: email,
    subject,
    text,
  });
};

export default Mail;
