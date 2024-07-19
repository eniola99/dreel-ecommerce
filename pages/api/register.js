import bcrypt from 'bcryptjs';

import { client } from '../../lib/client';
import { sendEmail } from '../../lib/email';

export default async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  const {
    email,
    password,
    firstname,
    lastname,
    username,
    number,
    address,
    currency,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);
  const generateVerificationCode = () => {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit code
  };

  const code = generateVerificationCode();

  const generateEmailTemplate = (verificationCode) => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Dreel Marketplace</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ddd;
            border-radius: 5px;
            background-color: #f9f9f9;
          }
          .header {
            text-align: center;
            padding-bottom: 20px;
          }
          .code {
            font-size: 1.5em;
            font-weight: bold;
            color: #e63946;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Dreel Marketplace!</h1>
          </div>
          <p>Thank you for registering with us. To complete your registration, please use the verification code below:</p>
          <p class="code">${verificationCode}</p>
          <p>If you did not create an account, please ignore this email.</p>
          <p>Best regards,</p>
          <p>Dreel Marketplace Team</p>
        </div>
      </body>
      </html>
    `;
  };

  try {
    const user = await client.fetch(
      `*[_type == 'account' && email == $email][0]`,
      {
        email,
      }
    );
    if (!user) {
      const user = await client.create({
        _type: 'account',
        firstname,
        lastname,
        username,
        email,
        password: hashedPassword,
        address,
        currency,
        number,
        code,
      });

      const emailTemplate = generateEmailTemplate(code);
      await sendEmail({
        to: email,
        from: 'Excited User <mailgun@sandboxf25fe5bd655642f6bcfc11377c890587.mailgun.org>',
        subject: 'Welcome to dreel marketplace',
        html: emailTemplate,
      });
      res
        .status(201)
        .json({ message: `${user.email} account created`, status: 200 });
      return;
    } else {
      res.status(401).json({ message: `${email} account already exist` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
