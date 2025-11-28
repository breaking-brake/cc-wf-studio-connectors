/**
 * HTML templates for legal pages (Privacy Policy & Terms of Service)
 */

const baseStyles = `
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    line-height: 1.6;
    color: #333;
    background: #f5f5f5;
    padding: 40px 20px;
  }
  .container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 40px;
    border-radius: 8px;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  }
  h1 {
    color: #1a1a1a;
    font-size: 28px;
    margin-bottom: 8px;
  }
  .last-updated {
    color: #666;
    font-size: 14px;
    margin-bottom: 32px;
  }
  h2 {
    color: #1a1a1a;
    font-size: 18px;
    margin-top: 28px;
    margin-bottom: 12px;
  }
  p {
    margin-bottom: 12px;
  }
  ul {
    margin-left: 24px;
    margin-bottom: 12px;
  }
  li {
    margin-bottom: 6px;
  }
  a {
    color: #0066cc;
    text-decoration: none;
  }
  a:hover {
    text-decoration: underline;
  }
  .contact {
    background: #f9f9f9;
    padding: 16px;
    border-radius: 4px;
    margin-top: 8px;
  }
  .footer {
    margin-top: 40px;
    padding-top: 20px;
    border-top: 1px solid #eee;
    text-align: center;
  }
  .footer a {
    margin: 0 12px;
  }
`;

/**
 * Privacy Policy page template
 */
export function privacyPolicyTemplate(): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Privacy Policy - Claude Code Workflow Studio</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <h1>Privacy Policy</h1>
    <p class="last-updated">Last Updated: November 27, 2025</p>

    <h2>1. Introduction</h2>
    <p>This Privacy Policy explains how Claude Code Workflow Studio ("the Service") handles your information.</p>

    <h2>2. Information We Collect</h2>
    <p>The Service collects the following information:</p>
    <ul>
      <li>Slack workspace ID</li>
      <li>Slack channel information (for selecting share destinations)</li>
      <li>Slack Bot Token (stored encrypted)</li>
    </ul>

    <h2>3. How We Use Information</h2>
    <p>We use collected information solely for:</p>
    <ul>
      <li>Sharing workflow files to Slack</li>
      <li>Importing workflows from Slack</li>
    </ul>

    <h2>4. Data Storage</h2>
    <ul>
      <li>Bot Tokens are stored in VSCode's encrypted storage on your local device</li>
      <li>No authentication credentials are permanently stored on our servers</li>
      <li>OAuth sessions are temporarily stored for 5 minutes only and automatically deleted</li>
    </ul>

    <h2>5. Third-Party Sharing</h2>
    <p>We do not share your information with third parties.</p>

    <h2>6. Security</h2>
    <ul>
      <li>All communications are encrypted via HTTPS</li>
      <li>We use secure OAuth 2.0 authentication flow</li>
    </ul>

    <h2>7. Contact</h2>
    <p>For questions about this policy, please contact:</p>
    <div class="contact">
      <p><strong>Seiya Kobayashi</strong></p>
      <p>Email: <a href="mailto:cc.wf.studio@gmail.com">cc.wf.studio@gmail.com</a></p>
    </div>

    <h2>8. Changes</h2>
    <p>This policy may be updated without prior notice.</p>

    <div class="footer">
      <a href="/terms">Terms of Service</a>
      <a href="/privacy">Privacy Policy</a>
    </div>
  </div>
</body>
</html>`;
}

/**
 * Terms of Service page template
 */
export function termsOfServiceTemplate(): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Terms of Service - Claude Code Workflow Studio</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <h1>Terms of Service</h1>
    <p class="last-updated">Last Updated: November 27, 2025</p>

    <h2>1. Service Description</h2>
    <p>Claude Code Workflow Studio ("the Service") is a VSCode extension that enables sharing and importing Claude Code workflows via Slack.</p>

    <h2>2. Terms of Use</h2>
    <ul>
      <li>The Service is provided free of charge</li>
      <li>A Slack account is required</li>
      <li>Use of the Service requires acceptance of these terms</li>
    </ul>

    <h2>3. Prohibited Activities</h2>
    <p>The following activities are prohibited:</p>
    <ul>
      <li>Unauthorized use of the Service</li>
      <li>Sharing content that infringes on others' rights</li>
      <li>Attacking or interfering with the Service</li>
    </ul>

    <h2>4. Disclaimer</h2>
    <ul>
      <li>The Service is provided "as is"</li>
      <li>We are not responsible for service interruptions or outages</li>
      <li>We are not responsible for the content of shared workflows</li>
    </ul>

    <h2>5. Intellectual Property</h2>
    <p>Intellectual property rights of the Service belong to the provider.</p>

    <h2>6. Governing Law</h2>
    <p>These terms are governed by the laws of Japan.</p>

    <h2>7. Contact</h2>
    <p>For questions about these terms, please contact:</p>
    <div class="contact">
      <p><strong>Seiya Kobayashi</strong></p>
      <p>Email: <a href="mailto:cc.wf.studio@gmail.com">cc.wf.studio@gmail.com</a></p>
    </div>

    <div class="footer">
      <a href="/terms">Terms of Service</a>
      <a href="/privacy">Privacy Policy</a>
    </div>
  </div>
</body>
</html>`;
}
