# CuriousPay - Decentralized Payment Platform

A blockchain-based payment solution built on Solana, designed to revolutionize financial transactions in Africa.

## Overview
CuriousPay is a decentralized payment platform leveraging blockchain technology to provide secure, efficient, and low-cost payment solutions. Built on Solana, it offers instant settlement with near-zero fees.

## Features
- Business Dashboard with analytics
- Instant settlements
- Near-zero transaction fees
- QR code payments
- Virtual accounts
- Multi-currency support
- Secure wallet integration

## Tech Stack
- Frontend: Next.js, TypeScript, TailwindCSS
- Blockchain: Solana, SolanaPay SDK
- UI Components: Shadcn UI
- State Management: Redux Toolkit
- Email: Resend

## Project Structure
```
/
├── src/
│   ├── app/             # Next.js app directory
│   ├── components/      # Reusable UI components
│   ├── lib/            # Utility functions and shared logic
│   └── styles/         # Global styles and Tailwind config
├── public/             # Static assets
└── contracts/          # Smart contracts (future)
```

## Getting Started
1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   RESEND_API_KEY=your_resend_api_key_here
   DATABASE_URL=your_postgresql_connection_string
   ```
4. Get a Resend API key from [resend.com](https://resend.com) to enable the contact form to send emails
5. Set up a PostgreSQL database and add the connection string to your .env file
6. Run development server: `npm run dev`
7. Open [http://localhost:3000](http://localhost:3000)

## Contact Form
The contact form on the website sends emails to curiouspayments@gmail.com. To configure this:
1. Make sure you have set up the Resend API key in your `.env.local` file
2. Contact form submissions will be sent to curiouspayments@gmail.com with the sender's email set as the reply-to address
3. The form validates inputs and provides feedback to users upon submission

## Deployment to Netlify

### Prerequisites
- A [Netlify](https://netlify.com) account
- A PostgreSQL database (Supabase, Railway, Neon, etc.)
- A Resend API key

### Deployment Steps

1. **Prepare your repository**:
   - Ensure all changes are committed and pushed to GitHub
   - The repository includes the `netlify.toml` file

2. **Deploy to Netlify**:
   - Sign in to Netlify
   - Click "New site from Git"
   - Select your GitHub repository
   - Configure build settings:
     - Build command: `npm run build`
     - Publish directory: `.next`

3. **Set environment variables**:
   In the Netlify dashboard, navigate to Site settings > Environment variables and add:
   ```
   DATABASE_URL=your_postgresql_connection_string
   RESEND_API_KEY=your_resend_api_key
   NEXT_PUBLIC_APP_URL=your_netlify_domain (e.g., https://curious-pay.netlify.app)
   ```

4. **Database setup**:
   - The postbuild script will automatically run Prisma migrations
   - You can also manually run migrations using Netlify CLI:
     ```
     npm install -g netlify-cli
     netlify login
     netlify env:set DATABASE_URL your_postgresql_connection_string
     netlify functions:invoke --name prisma-migrate --identity
     ```

5. **Verify deployment**:
   - Check your Netlify dashboard for build logs
   - Visit your deployed site
   - Test the contact form functionality

### Troubleshooting
- If you encounter build errors, check the Netlify logs
- For database issues, verify your DATABASE_URL is correct
- For email issues, check your Resend API key and verify domain settings

## Contributing
Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License
MIT
