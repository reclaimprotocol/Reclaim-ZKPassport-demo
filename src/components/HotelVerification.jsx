import { useState } from 'react'
import { ZKPassport } from '@zkpassport/sdk'
import { QRCodeSVG } from 'qrcode.react'

const verificationOptions = [
  { id: 'age', title: 'Age Verification', description: 'Verify guest is 18 years or older', required: 'Age 18+' },
  { id: 'nationality', title: 'Nationality Check', description: 'Verify guest nationality', required: 'Nationality' },
  { id: 'residency', title: 'Residency Verification', description: 'Verify country of residence', required: 'Residency' },
  { id: 'personhood', title: 'Personhood Verification', description: 'Unique person identity check', required: 'Unique ID' },
  { id: 'comprehensive', title: 'Complete Verification', description: 'Full guest profile verification', required: 'All Information' }
]

function HotelVerification() {
  const [selectedOption, setSelectedOption] = useState(null)
  const [verificationUrl, setVerificationUrl] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type })
    setTimeout(() => setToast(null), 3500)
  }

  const handleVerification = async (option) => {
    setSelectedOption(option)
    setLoading(true)
    setResult(null)
    setVerificationUrl('')

    try {
      const zkPassport = new ZKPassport(window.location.host)

      const queryBuilder = await zkPassport.request({
        name: 'InstantCheck',
        logo: 'https://via.placeholder.com/150',
        purpose: option.description,
        scope: option.id,
        devMode: true
      })

      let query
      if (option.id === 'age') {
        query = queryBuilder.gte('age', 18)
      } else if (option.id === 'nationality') {
        query = queryBuilder.disclose('nationality')
      } else if (option.id === 'residency') {
        query = queryBuilder.disclose('nationality')
      } else if (option.id === 'personhood') {
        query = queryBuilder.gte('age', 18)
      } else if (option.id === 'comprehensive') {
        query = queryBuilder
          .disclose('firstname')
          .disclose('lastname')
          .disclose('nationality')
          .disclose('dateofbirth')
          .gte('age', 18)
      }

      const {
        url,
        onResult,
        onRequestReceived,
        onGeneratingProof,
        onProofGenerated,
        onReject,
        onError
      } = query.done()

      setVerificationUrl(url)
      setLoading(false)

      onRequestReceived(() => {
        console.log('Guest scanned QR code')
        showToast('Guest scanned QR code', 'success')
      })

      onGeneratingProof(() => {
        console.log('Generating verification proofs...')
        showToast('Generating verification proofs...', 'success')
      })

      onProofGenerated(() => {
        console.log('Proofs generated successfully')
        showToast('Proofs generated!', 'success')

        // Manually trigger result after 2 seconds if SDK doesn't call onResult
        setTimeout(() => {
          console.log('⏱️ Manual timeout check - has result been set?')
        }, 2000)
      })

      onResult((resultData) => {
        console.log('✅ ✅ ✅ RESULT CALLBACK FIRED ✅ ✅ ✅')
        console.log('Verification result received:', resultData)
        console.log('Result data type:', typeof resultData)
        console.log('Result is truthy?', !!resultData)
        console.log('Full result object:', JSON.stringify(resultData, null, 2))

        setVerificationUrl('')
        setResult(resultData)
        console.log('State updated - result set to:', resultData)

        if (resultData?.verified) {
          showToast('Verification successful!', 'success')
        } else {
          showToast('Verification completed', 'success')
        }
      })

      onReject(() => {
        console.log('❌ User rejected verification')
        showToast('Verification rejected by user', 'warning')
        setVerificationUrl('')
        setLoading(false)
      })

      onError((error) => {
        console.log('❌ Verification error:', error)
        showToast('Verification error: ' + error.message, 'error')
        setVerificationUrl('')
        setLoading(false)
      })

    } catch (error) {
      setLoading(false)
      showToast(error.message, 'error')
    }
  }


  const reset = () => {
    setSelectedOption(null)
    setVerificationUrl('')
    setResult(null)
  }

  console.log('Current state:', { result, verificationUrl, selectedOption })

  // Success Screen
  if (result) {
    console.log('Rendering result screen with:', result)
    return (
      <div className="w-full">
        {toast && (
          <div className={`fixed top-24 right-8 px-6 py-4 rounded-lg shadow-lg border-l-4 animate-slideIn ${
            toast.type === 'success' ? 'bg-white border-green-500 text-green-800' :
            toast.type === 'error' ? 'bg-white border-red-500 text-red-800' :
            'bg-white border-yellow-500 text-yellow-800'
          }`}>
            {toast.message}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="bg-gray-50 px-8 py-5 border-b border-gray-200 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Verification Result</h2>
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wide ${
              result.verified ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {result.verified ? 'Verified' : 'Completed'}
            </span>
          </div>

          <div className="p-8">
            <div className="text-center mb-8">
              <svg className="w-20 h-20 mx-auto mb-4 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">
                {result.verified ? 'Guest Verified Successfully' : 'Verification Completed'}
              </h3>
              <p className="text-gray-600">{selectedOption.title}</p>
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden mb-6">
              {selectedOption.id === 'age' && (
                <div className="grid grid-cols-2 px-6 py-4 border-b border-gray-200">
                  <span className="text-sm text-gray-600 font-medium">Age Requirement</span>
                  <span className="text-sm text-gray-900 font-semibold text-right">18+ CONFIRMED</span>
                </div>
              )}

              {(selectedOption.id === 'nationality' || selectedOption.id === 'residency') && result.result?.nationality && (
                <div className="grid grid-cols-2 px-6 py-4 border-b border-gray-200">
                  <span className="text-sm text-gray-600 font-medium">Nationality</span>
                  <span className="text-sm text-gray-900 font-semibold text-right">{result.result.nationality.disclose.result}</span>
                </div>
              )}

              {selectedOption.id === 'personhood' && (
                <div className="grid grid-cols-2 px-6 py-4 border-b border-gray-200">
                  <span className="text-sm text-gray-600 font-medium">Unique Person</span>
                  <span className="text-sm text-gray-900 font-semibold text-right">VERIFIED</span>
                </div>
              )}

              {selectedOption.id === 'comprehensive' && (
                <>
                  {result.result?.firstname && (
                    <div className="grid grid-cols-2 px-6 py-4 border-b border-gray-200">
                      <span className="text-sm text-gray-600 font-medium">First Name</span>
                      <span className="text-sm text-gray-900 font-semibold text-right">{result.result.firstname.disclose.result}</span>
                    </div>
                  )}
                  {result.result?.lastname && (
                    <div className="grid grid-cols-2 px-6 py-4 border-b border-gray-200">
                      <span className="text-sm text-gray-600 font-medium">Last Name</span>
                      <span className="text-sm text-gray-900 font-semibold text-right">{result.result.lastname.disclose.result}</span>
                    </div>
                  )}
                  {result.result?.dateofbirth && (
                    <div className="grid grid-cols-2 px-6 py-4 border-b border-gray-200">
                      <span className="text-sm text-gray-600 font-medium">Date of Birth</span>
                      <span className="text-sm text-gray-900 font-semibold text-right">{result.result.dateofbirth.disclose.result}</span>
                    </div>
                  )}
                  {result.result?.nationality && (
                    <div className="grid grid-cols-2 px-6 py-4 border-b border-gray-200">
                      <span className="text-sm text-gray-600 font-medium">Nationality</span>
                      <span className="text-sm text-gray-900 font-semibold text-right">{result.result.nationality.disclose.result}</span>
                    </div>
                  )}
                  <div className="grid grid-cols-2 px-6 py-4 border-b border-gray-200">
                    <span className="text-sm text-gray-600 font-medium">Age Requirement</span>
                    <span className="text-sm text-gray-900 font-semibold text-right">18+ CONFIRMED</span>
                  </div>
                </>
              )}

              {result.uniqueIdentifier && (
                <div className="grid grid-cols-2 px-6 py-4 border-b border-gray-200">
                  <span className="text-sm text-gray-600 font-medium">Verification ID</span>
                  <span className="text-sm text-gray-900 font-mono text-xs text-right">{result.uniqueIdentifier}</span>
                </div>
              )}

              <div className="grid grid-cols-2 px-6 py-4">
                <span className="text-sm text-gray-600 font-medium">Verification Status</span>
                <span className={`text-sm font-semibold text-right ${result.verified ? 'text-green-600' : 'text-gray-600'}`}>
                  {result.verified ? 'VERIFIED' : 'NOT VERIFIED'}
                </span>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={reset}
                className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
              >
                New Verification
              </button>
              <button className="px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Complete Check-In
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Scanner Screen
  if (verificationUrl && !result) {
    return (
      <div className="w-full">
        {toast && (
          <div className={`fixed top-24 right-8 px-6 py-4 rounded-lg shadow-lg border-l-4 animate-slideIn ${
            toast.type === 'success' ? 'bg-white border-green-500 text-green-800' :
            toast.type === 'error' ? 'bg-white border-red-500 text-red-800' :
            'bg-white border-yellow-500 text-yellow-800'
          }`}>
            {toast.message}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="bg-gray-50 px-8 py-5 border-b border-gray-200 flex items-center justify-between">
            <button
              onClick={reset}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              ← Back
            </button>
            <h2 className="text-xl font-bold text-gray-900">{selectedOption.title}</h2>
            <span className="px-4 py-1.5 bg-blue-100 text-blue-700 rounded-full text-xs font-bold uppercase tracking-wide">
              Waiting
            </span>
          </div>

          <div className="flex items-center justify-center py-16 px-8">
            <div className="max-w-md w-full text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Scan QR Code to Verify</h3>
              <p className="text-gray-600 mb-8">Guest should scan this code with their mobile device</p>

              <div className="inline-block p-8 bg-white border-2 border-gray-200 rounded-2xl shadow-lg mb-6">
                <QRCodeSVG value={verificationUrl} size={280} />
              </div>

              <div className="flex items-center justify-center gap-3 px-6 py-4 bg-gray-50 rounded-xl">
                <div className="w-5 h-5 border-3 border-gray-300 border-t-blue-600 rounded-full animate-spin"></div>
                <span className="text-gray-700 font-medium">Waiting for guest to complete verification...</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Main Selection Screen
  return (
    <div className="w-full">
      {toast && (
        <div className={`fixed top-24 right-8 px-6 py-4 rounded-lg shadow-lg border-l-4 animate-slideIn ${
          toast.type === 'success' ? 'bg-white border-green-500 text-green-800' :
          toast.type === 'error' ? 'bg-white border-red-500 text-red-800' :
          'bg-white border-yellow-500 text-yellow-800'
        }`}>
          {toast.message}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
        <div className="bg-gray-50 px-8 py-5 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Guest Verification</h2>
        </div>

        <div className="p-8">
          <div className="hidden md:grid grid-cols-3 gap-6 px-6 py-3 bg-gray-50 rounded-lg mb-4 text-sm font-semibold text-gray-600 uppercase tracking-wide">
            <span>Verification Type</span>
            <span>Requirements</span>
            <span className="text-right">Action</span>
          </div>

          <div className="space-y-3">
            {verificationOptions.map((option) => (
              <div
                key={option.id}
                className="grid md:grid-cols-3 gap-6 items-center px-6 py-6 border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all duration-200"
              >
                <div>
                  <h4 className="text-lg font-semibold text-gray-900 mb-1">{option.title}</h4>
                  <p className="text-sm text-gray-600">{option.description}</p>
                </div>
                <div className="flex justify-center md:justify-start">
                  <span className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium">
                    {option.required}
                  </span>
                </div>
                <div className="flex justify-end">
                  <button
                    onClick={() => handleVerification(option)}
                    disabled={loading}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-200"
                  >
                    Start Verification
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HotelVerification
