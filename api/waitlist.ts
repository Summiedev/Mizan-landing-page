
export const config = {
  runtime: 'edge',
};

const RESEND_API_URL = 'https://api.resend.com';

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// Brand-matched welcome email. Kept dependency-free (plain HTML string) so it
// works in an edge function without a templating library.
function welcomeEmailHtml(): string {
  return `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Welcome to Mizan</title>
  </head>
  <body style="margin:0;padding:0;background-color:#F5F2ED;font-family:Georgia,'Cormorant Garamond',serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#F5F2ED;padding:40px 16px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" style="max-width:480px;background-color:#FBF9F7;border:1px solid #D4C3B0;border-radius:24px;overflow:hidden;">
            <tr>
              <td style="padding:40px 36px 8px 36px;text-align:center;">
                <div style="font-family:Georgia,serif;font-size:22px;font-weight:600;color:#3C2A21;letter-spacing:0.02em;">
                  Mizan
                </div>
                <div style="width:36px;height:1px;background-color:#A68A64;margin:16px auto 24px auto;"></div>
              </td>
            </tr>
            <tr>
              <td style="padding:0 36px;text-align:center;">
                <h1 style="font-family:Georgia,'Cormorant Garamond',serif;font-style:italic;font-weight:500;font-size:28px;line-height:1.3;color:#3C2A21;margin:0 0 16px 0;">
                  Welcome to Mizan.
                </h1>
                <p style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#523A2E;margin:0 0 20px 0;">
                  You've just placed the first drop in your jar. Thank you for
                  joining the circle of sincerity, quietly, before anyone else.
                </p>
                <p style="font-family:Helvetica,Arial,sans-serif;font-size:15px;line-height:1.7;color:#523A2E;margin:0 0 28px 0;">
                  Mizan is a gentle daily companion for tracking your private
                  acts of charity, kindness, and remembrance — small drops that
                  become, in time, an ocean. We're building it with care, and
                  we'll write to you the moment it's ready for your hands.
                </p>
                <p style="font-family:Georgia,'Cormorant Garamond',serif;font-style:italic;font-size:16px;color:#523A2E;margin:0 0 32px 0;">
                  "Small drops, eternal oceans."
                </p>
              </td>
            </tr>
            <tr>
              <td style="padding:0 36px 40px 36px;text-align:center;">
                <div style="width:100%;height:1px;background-color:#D4C3B0;margin:0 0 24px 0;"></div>
                <p style="font-family:'JetBrains Mono',monospace;font-size:10px;letter-spacing:0.15em;text-transform:uppercase;color:#523A2E;opacity:0.8;margin:0;">
                  &copy; 2026 Mizan &bull; You're receiving this because you joined the Mizan waitlist.
                </p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
  </html>
  `;
}

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  let body: { email?: string };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON body' }), { status: 400 });
  }

  const email = (body.email || '').trim().toLowerCase();
  if (!isValidEmail(email)) {
    return new Response(JSON.stringify({ error: 'Invalid email' }), { status: 400 });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  const RESEND_FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'Mizan <onboarding@resend.dev>';

  // If Resend isn't configured yet, don't fail the signup — just acknowledge it.
  // (The visitor's email is still saved locally in their browser via localStorage.)
  if (!RESEND_API_KEY) {
    return new Response(
      JSON.stringify({
        ok: true,
        warning: 'Resend is not configured yet (RESEND_API_KEY missing). Email was not stored server-side or sent.',
      }),
      { status: 200 }
    );
  }

  try {
    // 1. Store as a global Contact in your Resend account — no Audience/Segment
    //    ID needed. Shows up in Dashboard -> Audience -> Contacts.
    const contactRes = await fetch(`${RESEND_API_URL}/contacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        unsubscribed: false,
        // Custom property so you can filter/tag where this contact came from
        // if you also use Resend for OTPs or other transactional contacts.
        properties: { source: 'mizan-waitlist' },
      }),
    });

    // A repeat signup (contact already exists) shouldn't error out the user's
    // experience — Resend returns a 4xx for duplicates in that case.
    if (!contactRes.ok && contactRes.status !== 409) {
      const errText = await contactRes.text();
      console.error('Resend contact store failed:', errText);
    }

    // 2. Send the welcome email.
    const emailRes = await fetch(`${RESEND_API_URL}/emails`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: RESEND_FROM_EMAIL,
        to: email,
        subject: 'Welcome to Mizan 🌿',
        html: welcomeEmailHtml(),
      }),
    });

    if (!emailRes.ok) {
      const errText = await emailRes.text();
      console.error('Resend welcome email failed:', errText);
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (err) {
    console.error('Waitlist handler error:', err);
    // Still return 200 so the visitor's local signup isn't treated as a failure.
    return new Response(JSON.stringify({ ok: true, warning: 'Server error, but your signup was recorded locally.' }), { status: 200 });
  }
}