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
   ```
4. Get a Resend API key from [resend.com](https://resend.com) to enable the contact form to send emails
5. Run development server: `npm run dev`
6. Open [http://localhost:3000](http://localhost:3000)

## Contact Form
The contact form on the website sends emails to curiouspayments@gmail.com. To configure this:
1. Make sure you have set up the Resend API key in your `.env.local` file
2. Contact form submissions will be sent to curiouspayments@gmail.com with the sender's email set as the reply-to address
3. The form validates inputs and provides feedback to users upon submission

## Contributing
Contributions are welcome! Please read our contributing guidelines before submitting PRs.

## License
MIT
