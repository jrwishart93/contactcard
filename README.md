# Roads Policing Contact Card

This Next.js project provides a contact card for Police Scotland's Roads Policing Unit with a team directory and RTC reporting tool.

## Development

Install dependencies and run the development server:

```bash
npm install
npm run dev
```

## Firebase Deployment

Copy `.env.example` to `.env.local` and fill in your Firebase and Resend credentials. Deploy functions and hosting:

```bash
firebase deploy --only functions,hosting
```

## RTC Form Usage

Use the form at `/rtc/new` to collect details from drivers involved in a collision. The app stores submissions in Firestore and emails each driver using Resend.
