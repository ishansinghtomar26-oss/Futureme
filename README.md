# Future Me — A Letter to Yourself

Write a heartfelt letter to your future self. Seal it today, and it will be delivered to your inbox tomorrow morning — a small time capsule from the you of yesterday.

## Features

-  Write a personal letter and share your current thoughts
-  Seal your letter with your email address
-  Receive your letter via email the next day at 9:00 AM UTC
-  Beautiful, immersive UI with smooth animations

## Tech Stack

- **Frontend:** Vanilla HTML, CSS & JavaScript
- **Backend:** Vercel Serverless Functions (Node.js)
- **Database:** [Supabase](https://supabase.com) (PostgreSQL)
- **Email:** [Resend](https://resend.com)
- **Hosting:** [Vercel](https://vercel.com)

## Project Structure

```
Letter/
├── index.html          # Main frontend (single-page app)
├── package.json        # Node.js dependencies
├── vercel.json         # Vercel cron job configuration
└── api/
    ├── seal.js          # POST endpoint — saves a sealed letter
    └── check-and-send.js # GET endpoint — sends due letters via email
```

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) (v18+)
- A [Supabase](https://supabase.com) project
- A [Resend](https://resend.com) account
- [Vercel CLI](https://vercel.com/docs/cli) (optional, for local dev)

### Environment Variables

Create a `.env` file or set these in your Vercel project settings:

| Variable        | Description                       |
| --------------- | --------------------------------- |
| `SUPABASE_URL`  | Your Supabase project URL         |
| `SUPABASE_KEY`  | Your Supabase anon/service key    |
| `RESEND_API_KEY` | Your Resend API key              |

### Installation

```bash
# Clone the repository
git clone https://github.com/<your-username>/future-me.git
cd future-me

# Install dependencies
npm install

# Run locally with Vercel CLI
vercel dev
```

## How It Works

1. The user writes a letter and enters their email on the frontend.
2. Clicking **Seal It** sends the data to `/api/seal`, which stores it in Supabase.
3. A daily cron job (`vercel.json`) triggers `/api/check-and-send` at 9:00 AM UTC.
4. The endpoint queries for undelivered letters, sends them via Resend, and marks them as delivered.

## License

This project is licensed under the [MIT License](LICENSE).
