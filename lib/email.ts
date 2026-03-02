// lib/email.ts
import nodemailer from "nodemailer";

// Create transporter based on environment
const createTransporter = () => {
  // For development with Ethereal
  if (process.env.NODE_ENV === "development") {
    return nodemailer.createTransport({
      host: process.env.EMAIL_SERVER_HOST || "smtp.ethereal.email",
      port: Number(process.env.EMAIL_SERVER_PORT) || 587,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_SERVER_USER,
        pass: process.env.EMAIL_SERVER_PASSWORD,
      },
    });
  }

  // Production email configuration (for when you switch to SendGrid/Mailgun)
  return nodemailer.createTransport({
    host: process.env.EMAIL_SERVER_HOST,
    port: Number(process.env.EMAIL_SERVER_PORT),
    secure: true,
    auth: {
      user: process.env.EMAIL_SERVER_USER,
      pass: process.env.EMAIL_SERVER_PASSWORD,
    },
  });
};

const transporter = createTransporter();

export async function sendPasswordResetEmail(
  email: string,
  token: string,
  name: string,
) {
  const resetUrl = `${process.env.NEXTAUTH_URL || "http://localhost:3000"}/reset-password?token=${token}`;

  const mailOptions = {
    from: process.env.EMAIL_FROM || '"Daima Mkenya" <noreply@daimamkenya.com>',
    to: email,
    subject: "Reset Your Password - Daima Mkenya",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
              line-height: 1.6;
              color: #000;
              background-color: #f5f5f5;
              margin: 0;
              padding: 0;
            }
            .container {
              max-width: 600px;
              margin: 40px auto;
              background-color: #ffffff;
              border: 1px solid #e5e5e5;
            }
            .header {
              padding: 40px 40px 20px;
              text-align: center;
              border-bottom: 1px solid #e5e5e5;
            }
            .header h1 {
              font-size: 28px;
              font-weight: 300;
              letter-spacing: -0.5px;
              text-transform: uppercase;
              margin: 0;
            }
            .header h1 span {
              font-weight: 900;
              color: #be1e2d;
            }
            .content {
              padding: 40px;
            }
            .button {
              display: inline-block;
              background-color: #000;
              color: #fff;
              text-decoration: none;
              padding: 16px 32px;
              margin: 20px 0;
              font-size: 12px;
              font-weight: 900;
              text-transform: uppercase;
              letter-spacing: 0.3em;
              border: none;
              transition: background-color 0.3s ease;
            }
            .button:hover {
              background-color: #be1e2d;
            }
            .footer {
              padding: 20px 40px 40px;
              text-align: center;
              font-size: 10px;
              text-transform: uppercase;
              letter-spacing: 0.2em;
              color: #999;
              border-top: 1px solid #e5e5e5;
            }
            .note {
              font-size: 11px;
              color: #666;
              margin-top: 30px;
            }
            .link {
              color: #be1e2d;
              word-break: break-all;
              font-size: 12px;
            }
            .warning {
              background-color: #fff3cd;
              border-left: 4px solid #ffc107;
              padding: 12px;
              margin: 20px 0;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>DAIMA <span>MKENYA</span></h1>
            </div>
            <div class="content">
              <p style="font-size: 12px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.3em; margin-bottom: 30px;">
                Password Reset Request
              </p>

              <p style="font-size: 14px; margin-bottom: 20px;">
                Hello ${name || "there"},
              </p>

              <p style="font-size: 14px; margin-bottom: 30px;">
                We received a request to reset your password for your Daima Mkenya account.
                Click the button below to create a new password. This link will expire in 1 hour for security.
              </p>

              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">
                  Reset Password
                </a>
              </div>

              <div class="warning">
                ⚠️ If you didn't request this password reset, please ignore this email or contact support.
              </div>

              <p class="note">
                If the button doesn't work, copy and paste this link into your browser:
              </p>
              <p class="note link">
                ${resetUrl}
              </p>

              <p class="note" style="margin-top: 30px;">
                This link is valid for 1 hour. For security, please don't share this link with anyone.
              </p>
            </div>
            <div class="footer">
              <p>© ${new Date().getFullYear()} Daima Mkenya. All rights reserved.</p>
              <p style="margin-top: 10px;">Nairobi, Kenya</p>
            </div>
          </div>
        </body>
      </html>
    `,
    // Plain text version
    text: `
      DAIMA MKENYA - Password Reset Request

      Hello ${name || "there"},

      We received a request to reset your password for your Daima Mkenya account.

      Click this link to reset your password (expires in 1 hour):
      ${resetUrl}

      If you didn't request this password reset, please ignore this email.

      This link is valid for 1 hour. For security, don't share this link.

      © ${new Date().getFullYear()} Daima Mkenya. All rights reserved.
      Nairobi, Kenya
    `,
  };

  try {
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Password reset email sent to:", email);

    // For Ethereal, log the preview URL where you can see the email
    if (process.env.NODE_ENV === "development") {
      const previewUrl = nodemailer.getTestMessageUrl(info);
      if (previewUrl) {
        console.log("📧 Email preview URL (open in browser):", previewUrl);
        console.log(
          "📝 You can also check your Ethereal inbox at: https://ethereal.email",
        );
      }
    }

    return info;
  } catch (error) {
    console.error("❌ Error sending email:", error);
    throw error;
  }
}
