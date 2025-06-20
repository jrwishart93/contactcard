# Roads Policing Contact Card

This Next.js project provides a contact card for Police Scotland's Roads Policing Unit with a team directory and RTC reporting tool.

## Development

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

## Testing

Run the Jest test suite. **Ensure you run `npm install` first** so all dev dependencies are available in CI or your local environment:

```bash
npm install
npm test
```

## Firebase Deployment

Copy `.env.example` to `.env.local` and fill in your Firebase, Resend, OpenAI and base URL settings. The relevant environment variables are:

```
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID
BASE_URL
RESEND_API_KEY
OPENAI_API_KEY
```

Generate an OpenAI key from <https://platform.openai.com/account/api-keys> and add it as `OPENAI_API_KEY` in `.env.local`.

The `.env.local` file is git ignored so your secrets remain private. Deploy functions and hosting:

```bash
firebase deploy --only functions,hosting
```

## RTC Form Usage

Use the form at `/rtc/new` to collect details from drivers involved in a collision. The app stores submissions in Firestore and emails each driver using Resend.
