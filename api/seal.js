const { createClient } = require('@supabase/supabase-js');

const SOCIAL_LINKS = `
  <table width="100%" cellpadding="0" cellspacing="0">
    <tr>
      <td align="center" style="padding-bottom:12px;">
        <a href="https://www.instagram.com/ishansinghtomarr" target="_blank" style="display:inline-block;margin:0 8px;font-family:monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(242,232,213,0.35);text-decoration:none;">Instagram</a>
        <a href="https://www.linkedin.com/in/ishan-singh-tomar-520883360/" target="_blank" style="display:inline-block;margin:0 8px;font-family:monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(242,232,213,0.35);text-decoration:none;">LinkedIn</a>
        <a href="mailto:ishansinghtomar26@gmail.com" style="display:inline-block;margin:0 8px;font-family:monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(242,232,213,0.35);text-decoration:none;">Email</a>
        <a href="https://github.com/ishansinghtomar26-oss" target="_blank" style="display:inline-block;margin:0 8px;font-family:monospace;font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:rgba(242,232,213,0.35);text-decoration:none;">GitHub</a>
      </td>
    </tr>
    <tr>
      <td align="center" style="padding-bottom:6px;">
        <p style="margin:0;font-family:'Georgia',serif;font-size:11px;font-style:italic;color:rgba(242,232,213,0.25);">
          Made with &#9829; by <strong style="font-style:normal;color:rgba(242,232,213,0.38);">Ishan Singh Tomar</strong>
        </p>
      </td>
    </tr>
    <tr>
      <td align="center">
        <p style="margin:0;font-family:monospace;font-size:10px;letter-spacing:0.1em;color:rgba(242,232,213,0.18);">
          &copy; Futureme 2026. All rights reserved.
        </p>
      </td>
    </tr>
  </table>
`;

async function sendConfirmationEmail(to, deliverAt) {
  const deliverDate = new Date(deliverAt).toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  });

  const html = `<!DOCTYPE html>
<html>
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#1a1008;font-family:'Georgia',serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1a1008;padding:40px 20px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">

        <!-- Header -->
        <tr><td align="center" style="padding-bottom:32px;">
          <p style="margin:0;font-family:'Georgia',serif;font-size:28px;font-style:italic;color:#faf0d8;letter-spacing:0.02em;">
            Future <span style="color:#c9a84c;">Me</span>
          </p>
          <p style="margin:8px 0 0;font-size:11px;letter-spacing:0.2em;text-transform:uppercase;color:rgba(242,232,213,0.3);font-family:monospace;">
            Your letter has been sealed
          </p>
        </td></tr>

        <!-- Card -->
        <tr><td style="background:#f5e4b8;border-radius:3px;padding:40px 40px 36px;box-shadow:0 8px 40px rgba(0,0,0,0.5);">

          <!-- Wax seal icon -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr><td align="center">
              <div style="width:64px;height:64px;border-radius:50%;background:radial-gradient(circle at 33% 28%,#c03030 0%,#7a0e0e 52%,#420808 100%);display:inline-block;line-height:64px;text-align:center;font-family:'Georgia',serif;font-size:18px;font-style:italic;font-weight:bold;color:rgba(255,215,190,0.7);box-shadow:0 4px 16px rgba(0,0,0,0.4);">FM</div>
            </td></tr>
          </table>

          <p style="margin:0 0 16px;font-size:22px;font-style:italic;font-weight:bold;color:#1c1208;font-family:'Georgia',serif;text-align:center;">
            Your letter is sealed.
          </p>

          <hr style="border:none;border-top:1px solid rgba(80,45,8,0.2);margin:0 0 24px;">

          <p style="margin:0 0 16px;font-size:15px;line-height:1.8;color:#3a2008;font-family:'Georgia',serif;">
            Your letter to your future self has been safely sealed and stored. Nobody can read it — not even us.
          </p>

          <!-- Delivery date box -->
          <table width="100%" cellpadding="0" cellspacing="0" style="margin:24px 0;">
            <tr><td style="background:rgba(80,45,8,0.08);border:1px solid rgba(80,45,8,0.18);border-radius:2px;padding:16px 20px;text-align:center;">
              <p style="margin:0 0 4px;font-family:monospace;font-size:9px;letter-spacing:0.22em;text-transform:uppercase;color:#6b4018;">Opens on</p>
              <p style="margin:0;font-family:'Georgia',serif;font-size:17px;font-style:italic;font-weight:bold;color:#1c1208;">${deliverDate}</p>
            </td></tr>
          </table>

          <p style="margin:0 0 24px;font-size:14px;line-height:1.8;color:#3a2008;font-family:'Georgia',serif;">
            On that day, your letter will arrive in this inbox. Until then, it rests untouched — waiting for the person you will become.
          </p>

          <hr style="border:none;border-top:1px solid rgba(80,45,8,0.15);margin:0 0 16px;">
          <p style="margin:0;font-size:12px;font-style:italic;color:#6b4018;font-family:'Georgia',serif;text-align:center;">
            Sealed at <a href="https://futureme.page" style="color:#9b4521;text-decoration:none;">futureme.page</a>
          </p>

        </td></tr>

        <!-- Footer -->
        <tr><td style="padding-top:28px;">
          ${SOCIAL_LINKS}
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Future Me <letters@futureme.page>',
      to: [to],
      subject: 'Your letter has been sealed — it arrives on ' + deliverDate,
      html,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Resend confirmation error: ${err}`);
  }

  return true;
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    console.error('Missing env vars:', { supabaseUrl: !!supabaseUrl, supabaseKey: !!supabaseKey });
    return res.status(500).json({ error: 'Server misconfiguration' });
  }

  const supabase = createClient(supabaseUrl, supabaseKey);

  const { email, letter, deliver_at } = req.body;

  if (!email || !letter || !deliver_at) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  if (!email.includes('@') || !email.includes('.')) {
    return res.status(400).json({ error: 'Invalid email address' });
  }

  if (letter.trim().length < 20) {
    return res.status(400).json({ error: 'Letter is too short' });
  }

  const deliverDate = new Date(deliver_at);
  if (isNaN(deliverDate) || deliverDate <= new Date()) {
    return res.status(400).json({ error: 'Delivery date must be in the future' });
  }

  // Store in Supabase
  const { error } = await supabase
    .from('letters')
    .insert({ email, letter, deliver_at: deliverDate.toISOString() });

  if (error) {
    console.error('Supabase insert error:', error);
    return res.status(500).json({ error: 'Failed to seal letter' });
  }

  // Send confirmation email (non-blocking - don't fail if this errors)
  try {
    await sendConfirmationEmail(email, deliver_at);
  } catch (err) {
    console.error('Confirmation email failed:', err);
    // Still return success - letter is saved, just confirmation failed
  }

  return res.status(200).json({ success: true });
};
