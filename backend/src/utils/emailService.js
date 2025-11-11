// Email Service (src/utils/emailService.js)
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
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 20px;
      line-height: 1.6;
    }
    .email-wrapper { 
      max-width: 600px; 
      margin: 0 auto; 
      background: white;
      border-radius: 16px;
      overflow: hidden;
      box-shadow: 0 20px 60px rgba(0,0,0,0.3);
    }
    .header-banner {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      padding: 40px 30px;
      text-align: center;
      position: relative;
    }
    .header-banner::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 20px;
      background: white;
      border-radius: 20px 20px 0 0;
    }
    .icon-badge {
      width: 80px;
      height: 80px;
      background: white;
      border-radius: 50%;
      margin: 0 auto 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 40px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.2);
    }
    .header-title {
      color: white;
      font-size: 28px;
      font-weight: 700;
      margin: 0;
      text-shadow: 0 2px 10px rgba(0,0,0,0.2);
    }
    .content { 
      padding: 40px 30px;
      color: #334155;
    }
    .greeting {
      font-size: 18px;
      color: #1e293b;
      margin-bottom: 20px;
    }
    .inviter-box {
      background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
      padding: 20px;
      border-radius: 12px;
      margin: 25px 0;
      border-left: 4px solid #667eea;
    }
    .inviter-text {
      font-size: 16px;
      color: #475569;
    }
    .inviter-name {
      color: #667eea;
      font-weight: 700;
      font-size: 18px;
    }
    .credentials-box {
      background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
      padding: 25px;
      border-radius: 12px;
      margin: 25px 0;
      border: 2px solid #fbbf24;
    }
    .credentials-title {
      font-size: 18px;
      font-weight: 700;
      color: #92400e;
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      gap: 10px;
    }
    .credential-row {
      background: white;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 15px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.1);
    }
    .credential-row:last-child { margin-bottom: 0; }
    .credential-label {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #78716c;
      font-weight: 600;
      margin-bottom: 8px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .credential-value {
      font-size: 16px;
      color: #1c1917;
      font-family: 'Courier New', monospace;
      font-weight: 600;
      word-break: break-all;
    }
    .security-notice {
      background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
      padding: 20px;
      border-radius: 12px;
      margin: 25px 0;
      border-left: 4px solid #ef4444;
    }
    .security-title {
      font-weight: 700;
      color: #991b1b;
      margin-bottom: 12px;
      font-size: 16px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .security-notice ul {
      margin-left: 20px;
      color: #7f1d1d;
    }
    .security-notice li {
      margin: 8px 0;
      font-size: 14px;
    }
    .cta-section {
      text-align: center;
      margin: 35px 0 25px;
    }
    .cta-text {
      font-size: 16px;
      color: #475569;
      margin-bottom: 20px;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 16px 40px;
      text-decoration: none;
      border-radius: 50px;
      font-weight: 700;
      font-size: 16px;
      box-shadow: 0 10px 25px rgba(102, 126, 234, 0.4);
      transition: all 0.3s ease;
    }
    .button:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 35px rgba(102, 126, 234, 0.5);
    }
    .footer {
      background: #f8fafc;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e2e8f0;
    }
    .footer-text {
      color: #64748b;
      font-size: 13px;
      margin: 8px 0;
    }
    .footer-brand {
      color: #667eea;
      font-weight: 600;
      margin-top: 15px;
    }
    @media only screen and (max-width: 600px) {
      body { padding: 20px 10px; }
      .content { padding: 30px 20px; }
      .header-title { font-size: 24px; }
      .button { padding: 14px 30px; }
    }
  </style>
</head>
<body>
  <div class="email-wrapper">
    <div class="header-banner">
      <div class="icon-badge">🎉</div>
      <h1 class="header-title">Admin Access Invitation</h1>
    </div>
    
    <div class="content">
      <p class="greeting">Hello there!</p>
      
      <div class="inviter-box">
        <p class="inviter-text">
          You have been invited by <span class="inviter-name">${inviterName}</span> to join as an administrator on the Nevada Rep Finder platform.
        </p>
      </div>
      
      <div class="credentials-box">
        <div class="credentials-title">
          <span>🔐</span> Your Login Credentials
        </div>
        
        <div class="credential-row">
          <div class="credential-label">
            <span>📧</span> EMAIL ADDRESS
          </div>
          <div class="credential-value">${email}</div>
        </div>
        
        <div class="credential-row">
          <div class="credential-label">
            <span>🔑</span> TEMPORARY PASSWORD
          </div>
          <div class="credential-value">${password}</div>
        </div>
      </div>
      
      <div class="security-notice">
        <div class="security-title">
          <span>⚠️</span> Important Security Notice
        </div>
        <ul>
          <li>This is a <strong>temporary password</strong> for your first login only</li>
          <li>You <strong>must change</strong> your password immediately after logging in</li>
          <li><strong>Never share</strong> this password with anyone</li>
        </ul>
      </div>
      
      <div class="cta-section">
        <p class="cta-text">Ready to get started? Click the button below to access your admin panel:</p>
        <a href="https://lookup.nevadapolicy.org/admin" class="button">Login to Admin Panel →</a>
      </div>
    </div>
    
    <div class="footer">
      <p class="footer-text">This invitation was sent on ${new Date().toLocaleString(
        "en-US",
        {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }
      )}</p>
      <p class="footer-text">If you did not expect this invitation, please disregard this email.</p>
      <p class="footer-brand">Nevada Rep Finder</p>
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
