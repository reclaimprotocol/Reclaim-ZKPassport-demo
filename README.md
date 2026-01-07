# ZKPassport Demo - Privacy-First Hotel Check-In

A demonstration of zero-knowledge proof identity verification for seamless, privacy-preserving hotel check-in experiences.

## Demo

https://github.com/user-attachments/assets/750f7654-678e-4181-8842-08dd7b5e65ef

## About This Project

This project simulates a **digital hotel check-in experience** for Accor hotels, showcasing how guests can verify their identity without exposing sensitive personal information.

### The Problem

Traditional hotel check-ins require guests to hand over passports or IDs, exposing sensitive data like:
- Full name and date of birth
- Passport/ID numbers
- Address and nationality
- Biometric photos

This data is often photocopied, stored insecurely, and creates privacy risks for travelers.

### The Solution

With ZKPassport, guests can prove only what's necessary:
- **"I am over 18"** - without revealing exact birthdate
- **"I am an EU resident"** - without showing full document
- **"My face matches my passport"** - without storing biometric data

The hotel gets verified claims, the guest keeps their privacy.

## What is ZKPassport?

ZKPassport is a privacy-first identity verification system that uses **zero-knowledge proofs** (ZKPs) to enable secure credential verification without exposing personal data.

### How Zero-Knowledge Proofs Work

```
Traditional Verification:          ZK Verification:
┌──────────────┐                   ┌──────────────┐
│  Show full   │                   │  Generate    │
│  passport    │                   │  ZK proof    │
└──────┬───────┘                   └──────┬───────┘
       │                                  │
       v                                  v
┌──────────────┐                   ┌──────────────┐
│  Hotel sees  │                   │  Hotel sees  │
│  ALL data    │                   │  ONLY claim  │
│  - Name      │                   │  "User is    │
│  - DOB       │                   │   over 18"   │
│  - Photo     │                   │              │
│  - ID number │                   │  (verified   │
└──────────────┘                   │   true)      │
                                   └──────────────┘
```

1. **User scans passport** with the ZKPassport mobile app
2. **Cryptographic proof generated** locally on the user's device
3. **Only the verified claim is shared** (e.g., "user is 18+" without revealing actual birthdate)
4. **No personal data leaves the device** - only mathematical proofs

## Hotel Check-In Simulation

This demo simulates a complete digital check-in flow where guests can:

### 1. Age Verification
Verify the guest is 18+ years old for check-in eligibility. Required by most hotels for room booking.

### 2. Nationality Disclosure
Guest chooses to share their nationality for registration purposes, often required for tourism statistics.

### 3. EU Residency Check
Verify if guest holds an EU residence permit - useful for VAT exemptions or special EU guest programs.

### 4. Full KYC Verification
Complete identity verification including:
- Full name disclosure
- Document number verification
- Expiry date check
- International sanctions screening (OFAC, EU, UK lists)

Required for premium services, loyalty program enrollment, or regulatory compliance.

### 5. Biometric Face Match
Verify the person checking in matches their passport photo - enables keyless room entry and enhanced security without storing biometric data.

## Verification Flow

```
┌─────────────────┐
│  Guest arrives  │
│  at hotel kiosk │
└────────┬────────┘
         │
         v
┌─────────────────┐     ┌─────────────────┐
│  Select what to │────>│  QR code shown  │
│  verify         │     │  on screen      │
└─────────────────┘     └────────┬────────┘
                                 │
                                 v
                        ┌─────────────────┐
                        │  Guest scans QR │
                        │  with ZKPassport│
                        │  mobile app     │
                        └────────┬────────┘
                                 │
                                 v
                        ┌─────────────────┐
                        │  Proof generated│
                        │  on guest's     │
                        │  phone (local)  │
                        └────────┬────────┘
                                 │
                                 v
┌─────────────────┐     ┌─────────────────┐
│  Check-in       │<────│  Hotel receives │
│  complete!      │     │  verified claim │
└─────────────────┘     └─────────────────┘
```

## Technical Implementation

### SDK Usage Example

```javascript
import { ZKPassport } from "@zkpassport/sdk";

// Initialize SDK
const zkPassport = new ZKPassport('https://your-domain.com/');

// Age verification - prove guest is 18+
const { url, verify } = await zkPassport
  .request()
  .gte('age', 18)
  .done();

// Display QR code from 'url'
// Wait for verification result
const result = await verify({
  onRequestReceived: () => console.log("Guest scanned QR"),
  onGeneratingProof: () => console.log("Generating proof..."),
  onResult: (result) => console.log("Verified:", result)
});
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

### Testing with Mobile

To test with the ZKPassport mobile app, expose your local server:

```bash
ngrok http 3000
```

Then scan the QR code with the ZKPassport app.

### Build for Production

```bash
npm run build
npm run preview
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

## Use Cases Beyond Hotels

This same technology can be applied to:
- **Airlines** - Age verification for alcohol, visa status checks
- **Car rentals** - License verification, age requirements
- **Casinos** - Age and sanctions verification
- **Banks** - KYC without document storage
- **Healthcare** - Identity verification for patient records

## Learn More

- [ZKPassport Documentation](https://docs.zkpassport.id)
- [Zero-Knowledge Proofs Explained](https://en.wikipedia.org/wiki/Zero-knowledge_proof)

## License

MIT
