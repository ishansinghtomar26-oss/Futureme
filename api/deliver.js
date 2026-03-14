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

async function sendEmail(to, letter, createdAt) {
  const writtenDate = new Date(createdAt).toLocaleDateString('en-US', {
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
            A letter from your past self
          </p>
        </td></tr>

        <!-- Parchment card -->
        <tr><td style="background:#f5e4b8;border-radius:3px;padding:40px 40px 36px;box-shadow:0 8px 40px rgba(0,0,0,0.5);">
          <p style="margin:0 0 24px;font-size:13px;font-style:italic;color:#4a2e08;font-family:'Georgia',serif;">
            Written on ${writtenDate}
          </p>
          <hr style="border:none;border-top:1px solid rgba(80,45,8,0.2);margin:0 0 24px;">
          <p style="margin:0 0 16px;font-size:18px;font-style:italic;font-weight:bold;color:#1c1208;font-family:'Georgia',serif;">
            Dear future me,
          </p>
          <div style="font-size:16px;line-height:1.9;color:#1c1208;font-family:'Georgia',serif;white-space:pre-wrap;">${letter.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
          <hr style="border:none;border-top:1px solid rgba(80,45,8,0.15);margin:28px 0 16px;">
          <p style="margin:0;font-size:13px;font-style:italic;color:#6b4018;font-family:'Georgia',serif;text-align:center;">
            Sealed and delivered by <a href="https://futureme.page" style="color:#9b4521;text-decoration:none;">futureme.page</a>
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
      subject: 'A letter from your past self has arrived',
      html,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Resend error: ${err}`);
  }

  return true;
}

module.exports = async function handler(req, res) {
  const authHeader = req.headers['authorization'];
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  const { data: letters, error } = await supabase
    .from('letters')
    .select('*')
    .eq('sent', false)
    .lte('deliver_at', new Date().toISOString());

  if (error) {
    console.error('Supabase fetch error:', error);
    return res.status(500).json({ error: 'Failed to fetch letters' });
  }

  if (!letters || letters.length === 0) {
    return res.status(200).json({ message: 'No letters to deliver today' });
  }

  const results = { sent: 0, failed: 0 };

  for (const row of letters) {
    try {
      await sendEmail(row.email, row.letter, row.created_at);
      await supabase.from('letters').update({ sent: true }).eq('id', row.id);
      results.sent++;
    } catch (err) {
      console.error(`Failed to send letter ${row.id}:`, err);
      results.failed++;
    }
  }

  return res.status(200).json({
    message: `Delivered ${results.sent} letter(s), ${results.failed} failed`,
    ...results,
  });
};
