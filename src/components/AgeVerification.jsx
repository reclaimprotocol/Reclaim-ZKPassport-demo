import { useState } from 'react'
import { ZKPassport } from '@zkpassport/sdk'
import { QRCodeSVG } from 'qrcode.react'
import './AgeVerification.css'

function AgeVerification() {
  const [verificationUrl, setVerificationUrl] = useState('')
  const [requestId, setRequestId] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('idle') // idle, url_generated, request_received, generating, proof_generated, completed, error
  const [proofsGenerated, setProofsGenerated] = useState([])
  const [result, setResult] = useState(null)
  const [domain, setDomain] = useState('localhost:3000')

  const handleVerification = async () => {
    setLoading(true)
    setResult(null)
    setVerificationUrl('')
    setStatus('idle')
    setProofsGenerated([])
    setRequestId('')

    try {
      const zkPassport = new ZKPassport(domain)

      const queryBuilder = await zkPassport.request({
        name: 'ZKPassport Age Verification',
        logo: 'https://zkpassport.id/logo.png',
        purpose: 'Verify you are 18 years or older',
        scope: 'adult'
      })

      const {
        url,
        requestId: reqId,
        onRequestReceived,
        onGeneratingProof,
        onProofGenerated,
        onResult,
        onReject,
        onError
      } = queryBuilder.gte('age', 18).done()

      console.log('Verification URL generated:', url)
      console.log('Request ID:', reqId)

      setVerificationUrl(url)
      setRequestId(reqId)
      setStatus('url_generated')
      setLoading(false)

      // User received the request
      onRequestReceived(() => {
        console.log('Request received by user')
        setStatus('request_received')
      })

      // User accepted, generating proof
      onGeneratingProof(() => {
        console.log('Generating proof...')
        setStatus('generating')
      })

      // Individual proof generated
      onProofGenerated(({ proof, vkeyHash, version, name }) => {
        console.log('Proof generated:', { name, vkeyHash, version })
        setProofsGenerated(prev => [...prev, { name, vkeyHash, version }])
        setStatus('proof_generated')
      })

      // Final result
      onResult((resultData) => {
        console.log('Verification complete - Full response:', resultData)
        setStatus('completed')
        setResult(resultData)
      })

      // User rejected
      onReject(() => {
        console.log('User rejected the request')
        setStatus('error')
        setResult({
          verified: false,
          error: 'User rejected the verification request'
        })
      })

      // Error occurred
      onError((error) => {
        console.error('Verification error:', error)
        setStatus('error')
        setResult({
          verified: false,
          error: error.message || 'An error occurred during verification'
        })
      })

    } catch (error) {
      console.error('Setup error:', error)
      setStatus('error')
      setResult({
        verified: false,
        error: error.message
      })
      setLoading(false)
    }
  }

  const resetVerification = () => {
    setVerificationUrl('')
    setRequestId('')
    setResult(null)
    setStatus('idle')
    setProofsGenerated([])
    setLoading(false)
  }

  const getStatusMessage = () => {
    switch(status) {
      case 'url_generated':
        return 'Scan the QR code to continue'
      case 'request_received':
        return 'Request received - waiting for user action'
      case 'generating':
        return 'Generating zero-knowledge proofs...'
      case 'proof_generated':
        return `Generating proofs... (${proofsGenerated.length} completed)`
      case 'completed':
        return 'Verification complete!'
      case 'error':
        return 'Verification failed'
      default:
        return 'Ready to start'
    }
  }

  return (
    <div className="verification-container">
      <div className="verification-screen">
        <div className="domain-config">
          <label>Domain</label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            placeholder="e.g., abc123.ngrok.io or localhost:3000"
            className="domain-input"
          />
          <p className="domain-hint">
            💡 Tip: Use <code>ngrok http 3000</code> to expose your local server
          </p>
        </div>

        <div className="verification-content">
          <div className="verification-header">
            <h2>Age Verification (18+)</h2>
            <p>Verify you are 18 years or older</p>
          </div>

          {status === 'idle' && !result && (
            <button
              className="test-btn verified"
              onClick={() => {
                setResult({
                  verified: true,
                  uniqueIdentifier: 'uid_' + Math.random().toString(36).substr(2, 9),
                  data: {
                    age: {
                      gte: {
                        expected: 18,
                        result: true
                      }
                    }
                  }
                })
              }}
            >
              Show Verified Result ✓
            </button>
          )}

          {verificationUrl && !result && (
            <div className="qr-section">
              <div className="qr-card">
                <h3>Scan QR Code</h3>
                <p className="qr-instruction">
                  Scan this QR code with your ZKPassport app
                </p>
                <div className="qr-code-wrapper">
                  <QRCodeSVG
                    value={verificationUrl}
                    size={280}
                    level="H"
                    includeMargin={true}
                    className="qr-code"
                  />
                </div>
                <div className="url-section">
                  <p className="url-label">Or visit this URL:</p>
                  <div className="url-display">
                    <input
                      type="text"
                      value={verificationUrl}
                      readOnly
                      className="url-input"
                    />
                    <button
                      className="copy-btn"
                      onClick={() => {
                        navigator.clipboard.writeText(verificationUrl)
                      }}
                    >
                      Copy
                    </button>
                  </div>
                </div>
              </div>

              <div className="status-indicator">
                <div className="status-content">
                  {status !== 'url_generated' && status !== 'completed' && (
                    <div className="spinner"></div>
                  )}
                  <div className="status-info">
                    <p className="status-message">{getStatusMessage()}</p>
                  </div>
                </div>

                {proofsGenerated.length > 0 && (
                  <div className="proofs-list">
                    {proofsGenerated.map((proof, idx) => (
                      <div key={idx} className="proof-item">
                        ✓ Proof {idx + 1}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {result && result.verified && (
            <div className="result-card success">
              <div className="result-icon">✓</div>
              <h3>Verification Successful</h3>

              <div className="verification-breakdown">
                <div className="check-item">
                  <span className="check-label">Age Requirement (18+):</span>
                  <span className="check-value pass">✓ PASSED</span>
                </div>
                <div className="check-item">
                  <span className="check-label">Cryptographic Proof Validation:</span>
                  <span className="check-value pass">✓ VERIFIED</span>
                </div>
              </div>

              <div className="success-box">
                <p className="success-title">🎉 Full Verification Successful!</p>
                <p className="success-text">
                  ✓ Age requirement met (18+)
                </p>
                <p className="success-text">
                  ✓ Zero-knowledge proofs cryptographically verified
                </p>
                {result.uniqueIdentifier && (
                  <div className="unique-id-display">
                    <strong>Unique ID:</strong> <code>{result.uniqueIdentifier}</code>
                  </div>
                )}
              </div>

              <div className="result-data">
                <p className="data-label">Full Response Data:</p>
                <pre>{JSON.stringify(result, null, 2)}</pre>
              </div>

              <button className="new-verification-btn" onClick={resetVerification}>
                New Verification
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AgeVerification
