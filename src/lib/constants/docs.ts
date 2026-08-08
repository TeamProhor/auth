export const API_DOCS_ENDPOINTS = [
  {
    step: "১. অথরাইজেশন কোড ফ্লো",
    description:
      "ব্যবহারকারীকে প্রহর অথরাইজেশন এন্ডপয়েন্টে রিডাইরেক্ট করার মাধ্যমে লগইন প্রক্রিয়া শুরু করুন। নিরাপত্তার জন্য আপনাকে অবশ্যই একটি PKCE code_challenge অন্তর্ভুক্ত করতে হবে।",
    endpoint: "GET /oauth/authorize",
  },
  {
    step: "২. টোকেন এক্সচেঞ্জ",
    description:
      "ব্যবহারকারী আপনার অ্যাপ অনুমোদন করলে, তারা একটি code সহ ফিরে আসবে। এই কোডটি ব্যবহার করে একটি Access Token এবং ID Token গ্রহণ করুন।",
    endpoint: "POST /oauth/token",
  },
];

export const CURL_TOKEN_EXCHANGE_CODE = `curl --request POST \\
  --url https://auth.prohor.app/oauth/token \\
  --header 'Content-Type: application/json' \\
  --data '{
  "grant_type": "authorization_code",
  "client_id": "YOUR_CLIENT_ID",
  "client_secret": "YOUR_SECRET",
  "code": "AUTH_CODE_RECEIVED",
  "code_verifier": "PKCE_VERIFIER_STRING"
}'`;

export const CURL_TOKEN_EXCHANGE_RESPONSE = `{
  "access_token": "eyJhbGciOi...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "id_token": "eyJhbGciOi..."
}`;

export const QUICKSTART_GUIDES = {
  nextjs: {
    install: "npm install @prohor/nextjs",
    proxyCode: `import { withProhorAuth } from '@prohor/nextjs/proxy';

export default withProhorAuth({
  clientId: process.env.PROHOR_CLIENT_ID,
  issuerUrl: process.env.PROHOR_ISSUER_URL,
  publicRoutes: ['/', '/about'],
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};`,
    userCode: `import { getSession } from '@prohor/nextjs';

export default async function Page() {
  const session = await getSession();
  if (!session) return <div>লগইন করুন</div>;

  return <div>স্বাগতম, {session.user.name}!</div>;
}`,
  },
  react: {
    install: "npm install @prohor/react",
    providerCode: (
      clientId: string,
      issuerUrl: string,
    ) => `import { ProhorProvider } from '@prohor/react';

export default function App() {
  return (
    <ProhorProvider
      clientId="${clientId}"
      issuerUrl="${issuerUrl}"
    >
      <YourApp />
    </ProhorProvider>
  );
}`,
    buttonCode: `import { useProhorAuth } from '@prohor/react';

export function LoginButton() {
  const { login, logout, user } = useProhorAuth();
  if (user) return <button onClick={logout}>লগআউট ({user.name})</button>;
  return <button onClick={login}>লগইন করুন</button>;
}`,
  },
  node: {
    install: "npm install @prohor/node express",
    middlewareCode: (
      clientId: string,
      issuerUrl: string,
    ) => `import { verifyProhorToken } from '@prohor/node';

const auth = verifyProhorToken({
  issuerUrl: '${issuerUrl}',
  audience: '${clientId}',
});

app.get('/api/protected', auth, (req, res) => {
  res.json({ user: req.prohorUser });
});`,
  },
  python: {
    install: "pip install prohor-py",
    fastApiCode: (
      clientId: string,
      issuerUrl: string,
    ) => `from prohor import verify_token, ProhorUser
from fastapi import Depends

async def get_current_user(token: str = Depends(oauth2_scheme)):
    return await verify_token(
        token,
        issuer="${issuerUrl}",
        audience="${clientId}",
    )

@app.get("/protected")
async def protected(user: ProhorUser = Depends(get_current_user)):
    return {"name": user.name}`,
  },
};
