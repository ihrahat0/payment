# Payment Portal with WalletConnect Integration

A Next.js application featuring a Payment Portal with live pricing data for Bitcoin, Ethereum, BNB, and Solana. The application also includes WalletConnect integration for connecting to Web3 wallets.

## Features

- Live cryptocurrency price tracking with 24-hour price changes
- Visual price charts using Chart.js
- Dark mode support
- Responsive design
- WalletConnect integration for connecting cryptocurrency wallets

## Prerequisites

- Node.js 18.17 or higher
- npm or yarn
- A WalletConnect Project ID (get one at [WalletConnect Cloud](https://cloud.walletconnect.com/))

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/your-username/crypto-dashboard.git
cd crypto-dashboard
```

2. Install the dependencies:

```bash
npm install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add your WalletConnect Project ID:

```
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="YOUR_WALLETCONNECT_PROJECT_ID"
```

4. Start the development server:

```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Troubleshooting WalletConnect Integration

If you're having issues with the WalletConnect integration:

1. Make sure you have a valid WalletConnect Project ID in your `.env.local` file.
2. Ensure that your project ID has the correct domain settings in the WalletConnect Cloud dashboard.
3. Check that you're using the latest versions of the WalletConnect packages.

## API Usage

This application uses the CoinGecko API to fetch cryptocurrency data. Please note that there are rate limits for the free tier.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
