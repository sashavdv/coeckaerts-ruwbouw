/**
 * Cloudflare Worker voor statische klantsites.
 *
 * - Alle gewone pagina's en bestanden komen uit dist/ (Static Assets).
 * - POST /api/contact verstuurt het contactformulier via Resend.
 *
 * Instellingen per site:
 *   vars    (wrangler.jsonc): SITE_NAME, CONTACT_TO, MAIL_FROM
 *   secrets (dashboard):      RESEND_API_KEY, TURNSTILE_SECRET_KEY (optioneel maar aangeraden)
 */

interface Env {
  ASSETS: { fetch: (request: Request) => Promise<Response> };
  SITE_NAME: string;
  CONTACT_TO: string;
  MAIL_FROM: string;
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET_KEY?: string;
}

const MAX = { naam: 200, telefoon: 50, email: 254, gemeente: 120, type: 120, bericht: 5000 } as const;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === '/api/contact') {
      if (request.method !== 'POST') {
        return json({ ok: false, error: 'method_not_allowed' }, 405, { Allow: 'POST' });
      }
      try {
        return await handleContact(request, env);
      } catch (err) {
        console.error('contact: onverwachte fout', err);
        return json({ ok: false, error: 'server_error' }, 500);
      }
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request: Request, env: Env): Promise<Response> {
  // Enkel aanvragen vanaf de eigen site toelaten.
  const origin = request.headers.get('Origin');
  if (origin && new URL(origin).host !== new URL(request.url).host) {
    return json({ ok: false, error: 'forbidden' }, 403);
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.MAIL_FROM) {
    // De site toont dan het mailprogramma als alternatief.
    return json({ ok: false, error: 'not_configured' }, 503);
  }

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false, error: 'invalid_body' }, 400);
  }

  const field = (name: keyof typeof MAX) => String(form.get(name) ?? '').trim().slice(0, MAX[name]);

  // Honeypot: bots vullen dit verborgen veld in. Doe alsof het gelukt is.
  if (String(form.get('botcheck') ?? '') !== '') {
    return json({ ok: true });
  }

  const data = {
    naam: field('naam'),
    telefoon: field('telefoon'),
    email: field('email'),
    gemeente: field('gemeente'),
    type: field('type'),
    bericht: field('bericht'),
  };

  const missing = (['naam', 'telefoon', 'email', 'bericht'] as const).filter((k) => !data[k]);
  if (missing.length || !EMAIL_RE.test(data.email) || !form.get('toestemming')) {
    return json({ ok: false, error: 'validation', fields: missing }, 400);
  }

  if (env.TURNSTILE_SECRET_KEY) {
    const passed = await verifyTurnstile(
      String(form.get('cf-turnstile-response') ?? ''),
      env.TURNSTILE_SECRET_KEY,
      request.headers.get('CF-Connecting-IP'),
    );
    if (!passed) {
      return json({ ok: false, error: 'turnstile' }, 400);
    }
  }

  const rows: [string, string][] = [
    ['Naam', data.naam],
    ['Telefoon', data.telefoon],
    ['E-mail', data.email],
    ['Gemeente van de werf', data.gemeente || '–'],
    ['Type werk', data.type || '–'],
  ];

  const text = [...rows.map(([k, v]) => `${k}: ${v}`), '', data.bericht, '', `— Verstuurd via de website van ${env.SITE_NAME}`].join('\n');

  const html = `<!doctype html><html><body style="font-family:Arial,sans-serif;color:#1f1a19;line-height:1.5">
<h2 style="color:#8b2828;margin:0 0 16px">Nieuwe aanvraag via de website</h2>
<table cellpadding="6" style="border-collapse:collapse">${rows
    .map(([k, v]) => `<tr><td style="color:#57504d;padding-right:16px">${esc(k)}</td><td><strong>${esc(v)}</strong></td></tr>`)
    .join('')}</table>
<p style="margin:20px 0 6px;color:#57504d">Bericht:</p>
<p style="white-space:pre-wrap;margin:0;padding:12px 16px;background:#f7f3f0;border-left:4px solid #c50404">${esc(data.bericht)}</p>
<p style="margin-top:24px;font-size:13px;color:#57504d">Beantwoord deze mail om rechtstreeks te reageren aan ${esc(data.naam)}.</p>
</body></html>`;

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: env.MAIL_FROM,
      to: env.CONTACT_TO.split(',').map((s) => s.trim()).filter(Boolean),
      reply_to: data.email,
      subject: `Nieuwe aanvraag van ${data.naam}${data.type ? ` – ${data.type}` : ''}`,
      text,
      html,
    }),
  });

  if (!res.ok) {
    console.error('contact: Resend gaf een fout', res.status, await res.text());
    return json({ ok: false, error: 'send_failed' }, 502);
  }

  return json({ ok: true });
}

async function verifyTurnstile(token: string, secret: string, ip: string | null): Promise<boolean> {
  if (!token) return false;
  const body = new FormData();
  body.set('secret', secret);
  body.set('response', token);
  if (ip) body.set('remoteip', ip);
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
  const outcome = (await res.json()) as { success?: boolean };
  return outcome.success === true;
}

function esc(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

function json(body: unknown, status = 200, headers: Record<string, string> = {}): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...headers },
  });
}
