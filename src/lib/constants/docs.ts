export const API_DOCS_ENDPOINTS = [
  {
    step: "১. ডিসকভারি ও ওওপেনআইডি কনফিগারেশন (OIDC Discovery)",
    description:
      "প্রহর অথ এর ওওপেনআইডি কনফিগারেশন এবং পাবলিক সাশ্রয়ী কীসমূহ (JWKS) আবিষ্কার করতে এই এন্ডপয়েন্টটি ব্যবহার করুন।",
    endpoint: "GET /.well-known/openid-configuration",
  },
  {
    step: "২. অথরাইজেশন কোড অনুরোধ (Authorization Request)",
    description:
      "ব্যবহারকারীকে প্রহর লগইন পেজে রিডাইরেক্ট করুন। সফল লগইন এবং কনসেন্টের পর ইউজার আপনার অ্যাপের Redirect URI-তে authorization_code সহ ফেরত আসবে।",
    endpoint:
      "GET /api/oauth/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code&scope=openid profile email",
  },
  {
    step: "৩. টোকেন এক্সচেঞ্জ (Token Exchange)",
    description:
      "প্রাপ্ত authorization_code, client_id এবং client_secret ব্যবহার করে প্রহর টোকেন এন্ডপয়েন্ট থেকে Access Token এবং ID Token রিট্রিভ করুন।",
    endpoint: "POST /api/oauth/token",
  },
  {
    step: "৪. ইউজার ইনফো (Userinfo Endpoint)",
    description:
      "Access Token সম্বলিত Authorization: Bearer হেডার পাঠিয়ে ব্যবহারকারীর প্রোফাইল তথ্য (নাম, ইমেইল, ছবি) সংগ্রহ করুন।",
    endpoint: "GET /api/oauth/userinfo",
  },
];

export const CURL_TOKEN_EXCHANGE_CODE = `curl -X POST \\
  https://accounts.prohor.dev/api/oauth/token \\
  -H 'Content-Type: application/x-www-form-urlencoded' \\
  -d 'grant_type=authorization_code' \\
  -d 'client_id=YOUR_CLIENT_ID' \\
  -d 'client_secret=YOUR_CLIENT_SECRET' \\
  -d 'redirect_uri=http://localhost:3000/api/auth/callback' \\
  -d 'code=AUTHORIZATION_CODE_HERE'`;

export const CURL_TOKEN_EXCHANGE_RESPONSE = `{
  "access_token": "pr_at_a1b2c3d4...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "id_token": "eyJhbGciOi...",
  "scope": "openid profile email"
}`;

export const QUICKSTART_GUIDES = {
  nextjs: {
    install: "# কোনো কাস্টম SDK প্রয়োজন নেই — স্ট্যান্ডার্ড OAuth 2.0 / OIDC ব্যবহার করুন",
    envCode: (clientId: string, issuerUrl: string) =>
      `PROHOR_CLIENT_ID="${clientId}"
PROHOR_CLIENT_SECRET="••••••••••• (Apps পেজ থেকে কপি করুন)"
PROHOR_ISSUER_URL="${issuerUrl}"
NEXT_PUBLIC_APP_URL="http://localhost:3000"`,
    redirectCode: (issuerUrl: string) =>
      `// app/login/route.ts (Next.js Route Handler)
import { NextResponse } from 'next/server';

export async function GET() {
  const authUrl = new URL('${issuerUrl}/api/oauth/authorize');
  authUrl.searchParams.set('client_id', process.env.PROHOR_CLIENT_ID!);
  authUrl.searchParams.set('redirect_uri', \`\${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback\`);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'openid profile email');

  return NextResponse.redirect(authUrl.toString());
}`,
    callbackCode: (issuerUrl: string) =>
      `// app/api/auth/callback/route.ts (Callback Route Handler)
import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get('code');
  if (!code) return NextResponse.json({ error: 'Code missing' }, { status: 400 });

  // ১. কোড পরিবর্তন করে টোকেন গ্রহণ করুন
  const tokenRes = await fetch('${issuerUrl}/api/oauth/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'authorization_code',
      client_id: process.env.PROHOR_CLIENT_ID!,
      client_secret: process.env.PROHOR_CLIENT_SECRET!,
      code,
      redirect_uri: \`\${process.env.NEXT_PUBLIC_APP_URL}/api/auth/callback\`,
    }),
  });

  const tokens = await tokenRes.json();
  if (!tokens.access_token) return NextResponse.json(tokens, { status: 400 });

  // ২. ব্যবহারকারীর তথ্য সংগ্রহ করুন
  const userRes = await fetch('${issuerUrl}/api/oauth/userinfo', {
    headers: { Authorization: \`Bearer \${tokens.access_token}\` },
  });
  const user = await userRes.json();

  return NextResponse.json({ success: true, user });
}`,
  },
  react: {
    install: "# স্ট্যান্ডার্ড ব্রাউজার fetch/axios ব্যবহার করুন",
    loginCode: (clientId: string, issuerUrl: string) =>
      `// LoginButton.jsx
export function LoginButton() {
  const handleLogin = () => {
    const authUrl = new URL('${issuerUrl}/api/oauth/authorize');
    authUrl.searchParams.set('client_id', '${clientId}');
    authUrl.searchParams.set('redirect_uri', 'http://localhost:3000/callback');
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('scope', 'openid profile email');

    window.location.href = authUrl.toString();
  };

  return <button onClick={handleLogin}>প্রহর দিয়ে লগইন করুন</button>;
}`,
  },
  node: {
    install: "npm install express axios",
    expressCode: (clientId: string, issuerUrl: string) =>
      `// server.js (Express OAuth 2.0 Integration)
const express = require('express');
const axios = require('axios');
const app = express();

const CLIENT_ID = process.env.PROHOR_CLIENT_ID || '${clientId}';
const CLIENT_SECRET = process.env.PROHOR_CLIENT_SECRET;
const ISSUER_URL = '${issuerUrl}';
const REDIRECT_URI = 'http://localhost:4000/callback';

// ১. প্রহর লগইন পেজে রিডাইরেক্ট
app.get('/login', (req, res) => {
  const url = \`\${ISSUER_URL}/api/oauth/authorize?client_id=\${CLIENT_ID}&redirect_uri=\${REDIRECT_URI}&response_type=code&scope=openid profile email\`;
  res.redirect(url);
});

// ২. কলব্যাক রুট (টোকেন এক্সচেঞ্জ ও ইউজার ইনফো)
app.get('/callback', async (req, res) => {
  const { code } = req.query;

  const tokenRes = await axios.post(\`\${ISSUER_URL}/api/oauth/token\`, new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    code,
    redirect_uri: REDIRECT_URI,
  }).toString(), {
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
  });

  const userRes = await axios.get(\`\${ISSUER_URL}/api/oauth/userinfo\`, {
    headers: { Authorization: \`Bearer \${tokenRes.data.access_token}\` }
  });

  res.json({ message: "লগইন সফল!", user: userRes.data });
});

app.listen(4000, () => console.log('Server running on http://localhost:4000'));`,
  },
  python: {
    install: "pip install requests fastapi uvicorn",
    pythonCode: (clientId: string, issuerUrl: string) =>
      `# app.py (FastAPI / Python OAuth 2.0)
import requests
from fastapi import FastAPI
from fastapi.responses import RedirectResponse

app = FastAPI()

CLIENT_ID = "${clientId}"
CLIENT_SECRET = "YOUR_CLIENT_SECRET"
ISSUER_URL = "${issuerUrl}"
REDIRECT_URI = "http://localhost:8000/callback"

@app.get("/login")
def login():
    auth_url = f"{ISSUER_URL}/api/oauth/authorize?client_id={CLIENT_ID}&redirect_uri={REDIRECT_URI}&response_type=code&scope=openid profile email"
    return RedirectResponse(auth_url)

@app.get("/callback")
def callback(code: str):
    # ১. কোড এক্সচেঞ্জ করে টোকেন নিন
    token_res = requests.post(f"{ISSUER_URL}/api/oauth/token", data={
        "grant_type": "authorization_code",
        "client_id": CLIENT_ID,
        "client_secret": CLIENT_SECRET,
        "code": code,
        "redirect_uri": REDIRECT_URI,
    })
    tokens = token_res.json()
    
    # ২. ব্যবহারকারীর প্রোফাইল আনুন
    user_res = requests.get(f"{ISSUER_URL}/api/oauth/userinfo", headers={
        "Authorization": f"Bearer {tokens['access_token']}"
    })
    return user_res.json()`,
  },
};
