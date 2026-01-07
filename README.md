# ZKPassport Demo - Privacy-First Identity Verification

A demonstration of zero-knowledge proof identity verification for hotel check-in, built with the ZKPassport SDK and styled for Accor hotels.

## Demo Video

https://github.com/user-attachments/assets/zkpassport-demo.mp4

> **Note:** See `zkpassport demo (1).mp4` in the root folder for the full demo video.

## What is ZKPassport?

ZKPassport is a privacy-first identity verification system that uses **zero-knowledge proofs** to enable secure credential verification without exposing personal data. Users can prove facts about themselves (age, nationality, identity) using cryptographic proofs without revealing the underlying personal information.

### How Zero-Knowledge Proofs Work

1. **User scans passport** with the ZKPassport mobile app
2. **Cryptographic proof generated** on the user's device
3. **Only the verified claim is shared** (e.g., "user is 18+" without revealing actual birthdate)
4. **No personal data leaves the device** - only mathematical proofs

## Features

This demo implements 5 verification types:

| Verification | Description | Use Case |
|-------------|-------------|----------|
| **Age Verification** | Proves user is 18+ years old | Hotel check-in requirement |
| **Nationality Disclosure** | Reveals user's nationality | Guest registration |
| **EU Residency** | Verifies EU residence permit | VAT exemption eligibility |
| **Full KYC** | Complete identity verification + sanctions screening | Comprehensive guest verification |
| **Biometric Face Match** | Verifies face matches passport photo | Keyless room entry |

## How It Works

### Verification Flow

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  User clicks │ --> │  QR code    │ --> │  User scans │ --> │  ZK proof   │
│  verify btn  │     │  displayed  │     │  with app   │     │  generated  │
└─────────────┘     └─────────────┘     └─────────────┘     └─────────────┘
                                                                   │
                                                                   v
                                        ┌─────────────┐     ┌─────────────┐
                                        │  Result     │ <-- │  Proof      │
                                        │  displayed  │     │  verified   │
                                        └─────────────┘     └─────────────┘
```

### SDK Usage Example

```javascript
import { ZKPassport } from "@zkpassport/sdk";

// Initialize SDK
const zkPassport = new ZKPassport('https://your-domain.com/');

// Create verification request
const { url, verify } = await zkPassport
  .request()
  .gte('age', 18)  // Verify age >= 18
  .done();

// url -> Display as QR code for user to scan
// verify -> Returns verification result with callbacks
```

### Query Builder Methods

| Method | Description | Example |
|--------|-------------|---------|
| `.gte(field, value)` | Greater than or equal | `.gte('age', 18)` |
| `.eq(field, value)` | Equals | `.eq('document_type', 'residence_permit')` |
| `.in(field, array)` | Value in list | `.in('issuing_country', ['FR', 'DE', 'IT'])` |
| `.disclose(field)` | Reveal field value | `.disclose('nationality')` |
| `.sanctions()` | Sanctions screening | `.sanctions(['US', 'EU', 'UK'])` |
| `.facematch(mode)` | Biometric verification | `.facematch('strict')` |

## Project Structure

```
zk-passport/
├── src/
│   ├── App.jsx              # Main app with verification logic
│   ├── main.jsx             # React entry point
│   ├── index.css            # Tailwind styles
│   └── components/
│       ├── VerificationCard.jsx  # Verification option cards
│       └── ResultModal.jsx       # QR code & results modal
├── package.json
├── vite.config.js
└── tailwind.config.js
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- ZKPassport mobile app (for scanning QR codes)

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd zk-passport

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## Configuration

### ZKPassport SDK

The SDK is initialized with your domain URL:

```javascript
const zkPassport = new ZKPassport('https://your-domain.com/');
```

### Vite Config

Development server runs on port 3000 with ngrok support for mobile testing:

```javascript
// vite.config.js
export default defineConfig({
  server: {
    port: 3000,
    open: true,
    allowedHosts: true  // Allows ngrok tunneling
  }
})
```

## Dependencies

| Package | Purpose |
|---------|---------|
| `@zkpassport/sdk` | Zero-knowledge proof verification |
| `react` | UI framework |
| `framer-motion` | Animations |
| `qrcode.react` | QR code generation |
| `lucide-react` | Icons |
| `tailwindcss` | Styling |

## Learn More

- [ZKPassport Documentation](https://docs.zkpassport.id)
- [Zero-Knowledge Proofs Explained](https://en.wikipedia.org/wiki/Zero-knowledge_proof)

## License

MIT
