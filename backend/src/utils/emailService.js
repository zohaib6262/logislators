// 2. Email Service (src/utils/emailService.js)
// ============================================
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export const sendAdminInviteEmail = async (email, password, inviterName) => {
  const emailBody = `
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; background-color: #f4f4f4; }
    .container { background-color: white; padding: 30px; border-radius: 8px; max-width: 600px; margin: 20px auto; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
    .header { color: #2563eb; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
    .content { color: #333; line-height: 1.6; }
    .credentials { background-color: #f8fafc; padding: 20px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #2563eb; }
    .credential-item { margin: 10px 0; }
    .credential-label { font-weight: bold; color: #475569; }
    .credential-value { color: #1e293b; background-color: #e2e8f0; padding: 8px 12px; border-radius: 4px; display: inline-block; margin-top: 5px; font-family: monospace; }
    .button { display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px; }
    .warning { background-color: #fef3c7; padding: 15px; border-radius: 6px; margin: 20px 0; border-left: 4px solid #f59e0b; }
    .footer { color: #64748b; font-size: 14px; margin-top: 30px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">🎉 Admin Access Invitation</div>
    
    <div class="content">
      <p>Hello,</p>
      <p>You have been invited by <strong>${inviterName}</strong> to join as an admin on our platform.</p>
      
      <div class="credentials">
        <div class="credential-item">
          <div class="credential-label">📧 Your Email:</div>
          <div class="credential-value">${email}</div>
        </div>
        <div class="credential-item">
          <div class="credential-label">🔑 Temporary Password:</div>
          <div class="credential-value">${password}</div>
        </div>
      </div>
      
      <div class="warning">
        <strong>⚠️ Important Security Notice:</strong>
        <ul>
          <li>This is a temporary password for your first login</li>
          <li>Please change your password immediately after logging in</li>
          <li>Do not share this password with anyone</li>
        </ul>
      </div>
      
      <p>To get started, please click the button below to login:</p>
      
      <a href="https://lookup.nevadapolicy.org/admin" class="button">Login Now</a>
    </div>
    
    <div class="footer">
      <p>This invitation was sent on ${new Date().toLocaleString()}</p>
      <p>If you did not expect this invitation, please ignore this email.</p>
    </div>
  </div>
</body>
</html>
  `;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "🎉 Admin Access Invitation - Action Required",
      html: emailBody,
    });
    return { success: true };
  } catch (error) {
    console.error("Email sending error:", error);
    return { success: false, error: error.message };
  }
};
