import Stripe from 'stripe';
import { client } from '../../lib/client';
import { sendEmail } from '../../lib/email';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export default async (req, res) => {
  try {
    const { type, sn, imei, notes, userId, session_id } = req.body;

    const htmlContent = () => {
      return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Dreel Marketplace Invoice</title>
          <style>
              body {
                  margin: 0;
                  padding: 0;
                  background-color: #f4f4f4;
                  font-family: Arial, sans-serif;
              }
              .email-container {
                  max-width: 600px;
                  margin: 0 auto;
                  background-color: #ffffff;
                  padding: 20px;
                  border-radius: 8px;
              }
              .header {
                  text-align: center;
                  padding: 20px 0;
                  border-bottom: 1px solid #dddddd;
              }
              .header img {
                  max-width: 150px;
              }
              .content {
                  padding: 20px 0;
              }
              .content h2 {
                  color: #333333;
              }
              .content p {
                  color: #666666;
              }
              .table-container {
                  width: 100%;
                  margin: 20px 0;
              }
              .table-container table {
                  width: 100%;
                  border-collapse: collapse;
              }
              .table-container th,
              .table-container td {
                  padding: 12px;
                  border: 1px solid #dddddd;
                  text-align: left;
              }
              .table-container th {
                  background-color: #f4f4f4;
              }
              .footer {
                  text-align: center;
                  padding: 20px 0;
                  border-top: 1px solid #dddddd;
                  color: #999999;
              }
              @media only screen and (max-width: 600px) {
                  .email-container {
                      width: 100% !important;
                      padding: 10px !important;
                  }
                  .table-container table,
                  .table-container th,
                  .table-container td {
                      font-size: 14px !important;
                      padding: 10px !important;
                  }
              }
          </style>
      </head>
      <body>
          <div class="email-container">
              <div class="content">
                  <h2>Receipt & Invoice</h2>
                  <p>Thank you for your purchase! Here are the details of your transaction:</p>
                  <div class="table-container">
                      <table>
                          <thead>
                              <tr>
                                  <th>Item</th>
                                  <th>imei</th>
                                  <th>Price</th>
                                  <th>Total</th>
                              </tr>
                          </thead>
                          <tbody>
                              <tr>
                                  <td>${type}</td>
                                  <td>${imei}</td>
                                  <td>$${session.amount_total / 100}</td>
                                  <td>$${session.amount_subtotal / 100}</td>
                              </tr>
                          </tbody>
                      </table>
                  </div>
                  <p>If you have any questions, feel free to contact our support team.</p>
              </div>
              <div class="footer">
                  <p>&copy; 2024 Dreel Marketplace. All rights reserved.</p>
              </div>
          </div>
      </body>
      </html>
      `;
    };

    const session = await stripe.checkout.sessions.retrieve(session_id);
    if (session.payment_status === 'paid') {
      const request = await client.create({
        _type: 'unlockRequest',
        type,
        sn,
        imei,
        notes,
        userId: userId,
      });

      const emailTemplate = htmlContent(type, sn, notes, session, imei);
      await sendEmail({
        to: session.customer_details.email,
        from: 'Excited User <mailgun@sandboxf25fe5bd655642f6bcfc11377c890587.mailgun.org>',
        subject: 'Unlock Request Payment Invoice',
        html: emailTemplate,
      });

      res
        .status(201)
        .json({ message: `${request.sn} unlock request submitted` });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
