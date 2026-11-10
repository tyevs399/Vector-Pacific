/**
 * Gmail API Client Service (Vector Pacific)
 * Direct client-side calls using in-memory OAuth bearer token
 */

export interface GmailMessageSummary {
  id: string;
  threadId: string;
  snippet?: string;
  subject?: string;
  from?: string;
  date?: string;
}

export const listGmailMessages = async (
  accessToken: string,
  maxResults = 8
): Promise<GmailMessageSummary[]> => {
  const listUrl = new URL('https://gmail.googleapis.com/gmail/v1/users/me/messages');
  listUrl.searchParams.set('maxResults', maxResults.toString());

  const response = await fetch(listUrl.toString(), {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/json'
    }
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gmail API list error (${response.status}): ${errorText}`);
  }

  const listData = await response.json();
  const rawMessages: Array<{ id: string; threadId: string }> = listData.messages || [];

  // Fetch metadata details for each message
  const detailedMessages = await Promise.all(
    rawMessages.map(async (msg) => {
      try {
        const detailUrl = new URL(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}`);
        detailUrl.searchParams.set('format', 'metadata');
        detailUrl.searchParams.append('metadataHeaders', 'Subject');
        detailUrl.searchParams.append('metadataHeaders', 'From');
        detailUrl.searchParams.append('metadataHeaders', 'Date');

        const detailRes = await fetch(detailUrl.toString(), {
          headers: { Authorization: `Bearer ${accessToken}` }
        });

        if (!detailRes.ok) return { id: msg.id, threadId: msg.threadId };
        const data = await detailRes.json();

        const headers = data.payload?.headers || [];
        const subject = headers.find((h: any) => h.name.toLowerCase() === 'subject')?.value || '(No Subject)';
        const from = headers.find((h: any) => h.name.toLowerCase() === 'from')?.value || '';
        const date = headers.find((h: any) => h.name.toLowerCase() === 'date')?.value || '';

        return {
          id: msg.id,
          threadId: msg.threadId,
          snippet: data.snippet,
          subject,
          from,
          date
        };
      } catch {
        return { id: msg.id, threadId: msg.threadId };
      }
    })
  );

  return detailedMessages;
};

// Base64url encode utf-8 string safely in browser
function base64UrlEncode(str: string): string {
  const utf8Bytes = new TextEncoder().encode(str);
  let binary = '';
  for (let i = 0; i < utf8Bytes.length; i++) {
    binary += String.fromCharCode(utf8Bytes[i]);
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
}

export const sendGmailMessage = async (
  accessToken: string,
  to: string,
  subject: string,
  bodyText: string,
  bodyHtml?: string
): Promise<{ id: string; threadId: string }> => {
  const content = bodyHtml || bodyText.replace(/\n/g, '<br/>');

  const emailLines = [
    `To: ${to}`,
    'From: me',
    `Subject: =?utf-8?B?${btoa(unescape(encodeURIComponent(subject)))}?=`,
    'MIME-Version: 1.0',
    'Content-Type: text/html; charset=UTF-8',
    'Content-Transfer-Encoding: 7bit',
    '',
    `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f17; color: #f1f5f9; padding: 24px; }
    .card { background: #121722; border: 1px solid #1e293b; border-radius: 12px; padding: 24px; max-width: 620px; margin: 0 auto; }
    .brand { color: #f59e0b; font-weight: 800; font-size: 18px; letter-spacing: 0.05em; font-family: monospace; }
    .subtitle { color: #94a3b8; font-size: 13px; margin-top: 4px; }
    .content { margin-top: 20px; font-size: 14px; line-height: 1.6; color: #cbd5e1; }
    .footer { margin-top: 28px; padding-top: 16px; border-top: 1px solid #1e293b; font-size: 12px; color: #64748b; font-family: monospace; }
  </style>
</head>
<body>
  <div class="card">
    <div class="brand">⚡ VECTOR PACIFIC // HIGH-END HARDWARE PLATFORM</div>
    <div class="subtitle">Silicon Valley • West Coast Hardware Architecture</div>
    <div class="content">${content}</div>
    <div class="footer">Sent via Vector Pacific Google Workspace Integration • Project: gen-lang-client-0296392916</div>
  </div>
</body>
</html>`
  ];

  const rawRfc2822 = emailLines.join('\r\n');
  const encodedRaw = base64UrlEncode(rawRfc2822);

  const response = await fetch('https://gmail.googleapis.com/gmail/v1/users/me/messages/send', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Accept: 'application/json'
    },
    body: JSON.stringify({ raw: encodedRaw })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Gmail Send failed (${response.status}): ${errorText}`);
  }

  return response.json();
};
