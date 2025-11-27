/**
 * HTML templates for Slack OAuth callback responses
 */

const baseStyles = `
  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    margin: 0;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
  .container {
    text-align: center;
    padding: 40px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
    max-width: 400px;
  }
  .icon {
    font-size: 64px;
    margin-bottom: 20px;
  }
  h1 {
    color: #333;
    font-size: 24px;
    margin: 0 0 16px 0;
  }
  p {
    color: #666;
    font-size: 16px;
    line-height: 1.5;
    margin: 0;
  }
  .error h1 {
    color: #dc3545;
  }
`;

/**
 * Success template - shown after successful OAuth callback
 */
export function successTemplate(): string {
	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Authentication Successful</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container">
    <div class="icon">✅</div>
    <h1>Authentication Successful!</h1>
    <p>You can now close this window and return to VS Code.</p>
    <p style="margin-top: 16px; color: #999; font-size: 14px;">
      The extension will automatically complete the connection.
    </p>
  </div>
</body>
</html>`;
}

/**
 * Error template - shown when OAuth callback fails
 */
export function errorTemplate(message: string): string {
	// Sanitize message to prevent XSS
	const sanitizedMessage = message
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');

	return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Authentication Failed</title>
  <style>${baseStyles}</style>
</head>
<body>
  <div class="container error">
    <div class="icon">❌</div>
    <h1>Authentication Failed</h1>
    <p>${sanitizedMessage}</p>
    <p style="margin-top: 16px; color: #999; font-size: 14px;">
      Please close this window and try again from VS Code.
    </p>
  </div>
</body>
</html>`;
}
