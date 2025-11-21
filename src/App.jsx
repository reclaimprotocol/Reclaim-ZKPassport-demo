import { useState } from 'react';
import { ZKPassport, EU_COUNTRIES } from '@zkpassport/sdk';
import QRCode from 'qrcode.react';

function App() {
  const [url, setUrl] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationType, setVerificationType] = useState(null);
  const [loadingState, setLoadingState] = useState(null); // 'received', 'generating', 'complete'

  const getAgeVerification = async () => {
    try {
      const zkPassport = new ZKPassport('https://f9e1123e3c55.ngrok-free.app');

      const queryBuilder = await zkPassport.request({
        name: 'ZKPassport',
        logo: 'https://zkpassport.id/logo.png',
        purpose: 'Prove you are 18+ years old',
        scope: 'adult',
      });

      const { url, onResult, onRequestReceived, onGeneratingProof } = queryBuilder
        .gte('age', 18)
        .done();

      console.log('url', url);

      setUrl(url);
      setVerificationType('age');
      setVerificationResult(null);
      setLoadingState(null);

      onRequestReceived(() => {
        console.log('Request received');
        setLoadingState('received');
      });

      onGeneratingProof(() => {
        console.log('Generating proof');
        setLoadingState('generating');
      });

      onResult(({ verified, result }) => {
        console.log('verified', verified);
        console.log('result', result);

        setLoadingState('complete');
        setVerificationResult({
          verified,
          data: result,
          type: 'age',
        });

        const isOver18 = result.age.gte.result;
        console.log('User is 18+ years old:', isOver18);
        console.log('ZK Proof verified:', verified);
      });
    } catch (error) {
      console.log('error', error);
      setLoadingState(null);
    }
  };

  const getNationalityVerification = async () => {
    try {
      const zkPassport = new ZKPassport('https://f9e1123e3c55.ngrok-free.app');

      const queryBuilder = await zkPassport.request({
        name: 'ZKPassport',
        logo: 'https://zkpassport.id/logo.png',
        purpose: 'Prove your nationality',
        scope: 'nationality',
      });

      const { url, onResult, onRequestReceived, onGeneratingProof } = queryBuilder
        .disclose('nationality')
        .done();

      console.log('url', url);

      setUrl(url);
      setVerificationType('nationality');
      setVerificationResult(null);
      setLoadingState(null);

      onRequestReceived(() => {
        console.log('Request received');
        setLoadingState('received');
      });

      onGeneratingProof(() => {
        console.log('Generating proof');
        setLoadingState('generating');
      });

      onResult(({ verified, result }) => {
        console.log('verified', verified);
        console.log('result', result);

        setLoadingState('complete');
        setVerificationResult({
          verified,
          data: result,
          type: 'nationality',
        });

        if (verified) {
          const nationality = result.nationality.disclose.result;
          console.log("User's nationality", nationality);
        } else {
          console.log('Verification failed');
        }
      });
    } catch (error) {
      console.log('error', error);
      setLoadingState(null);
    }
  };

  const getEUResidencyVerification = async () => {
    try {
      const zkPassport = new ZKPassport('https://f9e1123e3c55.ngrok-free.app');

      const queryBuilder = await zkPassport.request({
        name: 'ZKPassport',
        logo: 'https://zkpassport.id/logo.png',
        purpose: 'Prove you are resident in Eu',
        scope: 'eu-resident',
      });

      console.log('query builder', queryBuilder);

      const { url, onResult, onRequestReceived, onGeneratingProof } = queryBuilder
        .eq('document_type', 'residence_permit')
        .in('issuing_country', EU_COUNTRIES)
        .done();

      console.log('url', url);

      setUrl(url);
      setVerificationType('eu-resident');
      setVerificationResult(null);
      setLoadingState(null);

      onRequestReceived(() => {
        console.log('Request received');
        setLoadingState('received');
      });

      onGeneratingProof(() => {
        console.log('Generating proof');
        setLoadingState('generating');
      });

      onResult(({ verified, result }) => {
        console.log('verified', verified);
        console.log('result', result);

        setLoadingState('complete');
        setVerificationResult({
          verified,
          data: result,
          type: 'eu-resident',
        });

        if (verified) {
          const isEUResident = result.document_type.eq.result && result.issuing_country.in.result;
          console.log('User is resident in EU', isEUResident);
        } else {
          console.log('Verification failed');
        }
      });
    } catch (error) {
      console.log('error', error);
      setLoadingState(null);
    }
  };

  const getKYCVerification = async () => {
    try {
      const zkPassport = new ZKPassport('https://f9e1123e3c55.ngrok-free.app');

      const queryBuilder = await zkPassport.request({
        name: 'ZKPassport',
        logo: 'https://zkpassport.id/logo.png',
        purpose: 'Prove your identity',
        scope: 'identity',
      });

      const { url, onResult, onRequestReceived, onGeneratingProof } = queryBuilder
        .disclose('nationality')
        .disclose('birthdate')
        .disclose('fullname')
        .disclose('expiry_date')
        .disclose('document_number')
        .sanctions()
        .done();

      console.log('url', url);

      setUrl(url);
      setVerificationType('kyc');
      setVerificationResult(null);
      setLoadingState(null);

      onRequestReceived(() => {
        console.log('Request received');
        setLoadingState('received');
      });

      onGeneratingProof(() => {
        console.log('Generating proof');
        setLoadingState('generating');
      });

      onResult(({ verified, result }) => {
        console.log('verified', verified);
        console.log('result', result);

        setLoadingState('complete');
        setVerificationResult({
          verified,
          data: result,
          type: 'kyc',
        });

        if (verified) {
          const nationality = result.nationality.disclose.result;
          const dateOfBirth = result.birthdate.disclose.result;
          const fullname = result.fullname.disclose.result;
          const expiryDate = result.expiry_date.disclose.result;
          const documentNumber = result.document_number.disclose.result;
          const sanctionsVerified = result.sanctions.passed;

          if (!sanctionsVerified) {
            console.log('Sanctions check failed');
          }

          console.log('User is verified', nationality, dateOfBirth, fullname, expiryDate, documentNumber);
        } else {
          console.log('Verification failed');
        }
      });
    } catch (error) {
      console.log('error', error);
      setLoadingState(null);
    }
  };

  const getPrivateFaceMatchVerification = async () => {
    try {
      const zkPassport = new ZKPassport('https://f9e1123e3c55.ngrok-free.app');

      const queryBuilder = await zkPassport.request({
        name: 'ZKPassport',
        logo: 'https://zkpassport.id/logo.png',
        purpose: 'Prove you are the person on the ID',
        scope: 'facematch',
      });

      const { url, onResult, onRequestReceived, onGeneratingProof } = queryBuilder
        .facematch('strict')
        .done();

      console.log('url', url);

      setUrl(url);
      setVerificationType('facematch');
      setVerificationResult(null);
      setLoadingState(null);

      onRequestReceived(() => {
        console.log('Request received');
        setLoadingState('received');
      });

      onGeneratingProof(() => {
        console.log('Generating proof');
        setLoadingState('generating');
      });

      onResult(({ verified, result }) => {
        console.log('verified', verified);
        console.log('result', result);

        setLoadingState('complete');
        setVerificationResult({
          verified,
          data: result,
          type: 'facematch',
        });

        if (verified) {
          const faceMatchVerified = result.facematch.passed;
          if (faceMatchVerified) {
            console.log('FaceMatch verification passed');
          } else {
            console.log('FaceMatch verification failed');
          }
        } else {
          console.log('Verification failed');
        }
      });
    } catch (error) {
      console.log('error', error);
      setLoadingState(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">ZK Passport Verification</h1>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="space-y-3">
            <button
              onClick={getAgeVerification}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Get Age Verification
            </button>

            <button
              onClick={getNationalityVerification}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Disclose Nationality
            </button>

            <button
              onClick={getEUResidencyVerification}
              className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Check EU Residency
            </button>

            <button
              onClick={getKYCVerification}
              className="w-full bg-orange-600 hover:bg-orange-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Complete KYC Verification
            </button>

            <button
              onClick={getPrivateFaceMatchVerification}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200"
            >
              Private FaceMatch
            </button>
          </div>

          {url && (
            <div className="mt-6 flex flex-col items-center">
              <p className="text-sm text-gray-600 mb-3">Scan QR Code to verify</p>
              <QRCode value={url} size={200} />

              {loadingState && (
                <div className="mt-4 w-full">
                  {loadingState === 'received' && (
                    <div className="flex items-center justify-center space-x-2 text-blue-600">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span className="text-sm font-medium">Request received...</span>
                    </div>
                  )}

                  {loadingState === 'generating' && (
                    <div className="flex items-center justify-center space-x-2 text-orange-600">
                      <svg
                        className="animate-spin h-5 w-5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      <span className="text-sm font-medium">Generating proof... (up to 10 seconds)</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {verificationResult && verificationResult.type === 'age' && (
          <div
            className={`rounded-lg shadow-md p-6 ${
              verificationResult.data.age.gte.result
                ? 'bg-green-50 border-2 border-green-500'
                : 'bg-red-50 border-2 border-red-500'
            }`}
          >
            <div className="flex items-center justify-center mb-4">
              {verificationResult.data.age.gte.result ? (
                <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>

            <h2
              className={`text-2xl font-bold text-center mb-4 ${
                verificationResult.data.age.gte.result ? 'text-green-700' : 'text-red-700'
              }`}
            >
              {verificationResult.data.age.gte.result ? 'Age Verification Passed!' : 'Age Verification Failed'}
            </h2>

            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">ZK Proof Status</p>
                <p className="font-semibold text-gray-800">
                  {verificationResult.data.age.gte.result ? '✓ Proof Complete' : '○ Proof Incomplete'}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Age Requirement</p>
                <p className="font-semibold text-gray-800">
                  Must be {verificationResult.data.age.gte.expected}+ years old
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Age Check Result</p>
                <p
                  className={`font-semibold text-lg ${
                    verificationResult.data.age.gte.result ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {verificationResult.data.age.gte.result ? '✓ User is 18+ years old' : '✗ User is not 18+ years old'}
                </p>
              </div>
            </div>
          </div>
        )}

        {verificationResult && verificationResult.type === 'nationality' && (
          <div className="rounded-lg shadow-md p-6 bg-blue-50 border-2 border-blue-500">
            <div className="flex items-center justify-center mb-4">
              <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>

            <h2 className="text-2xl font-bold text-center mb-4 text-blue-700">Nationality Disclosed</h2>

            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">ZK Proof Status</p>
                <p className="font-semibold text-gray-800">
                  {verificationResult.data.nationality.disclose.result ? '✓ Proof Complete' : '○ Proof Incomplete'}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Nationality</p>
                <p className="font-semibold text-lg text-blue-700">
                  {verificationResult.data.nationality.disclose.result || 'Not disclosed'}
                </p>
              </div>
            </div>
          </div>
        )}

        {verificationResult && verificationResult.type === 'eu-resident' && (
          <div
            className={`rounded-lg shadow-md p-6 ${
              verificationResult.data.document_type.eq.result && verificationResult.data.issuing_country.in.result
                ? 'bg-green-50 border-2 border-green-500'
                : 'bg-red-50 border-2 border-red-500'
            }`}
          >
            <div className="flex items-center justify-center mb-4">
              {verificationResult.data.document_type.eq.result && verificationResult.data.issuing_country.in.result ? (
                <svg className="w-16 h-16 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              )}
            </div>

            <h2
              className={`text-2xl font-bold text-center mb-4 ${
                verificationResult.data.document_type.eq.result && verificationResult.data.issuing_country.in.result
                  ? 'text-green-700'
                  : 'text-red-700'
              }`}
            >
              {verificationResult.data.document_type.eq.result && verificationResult.data.issuing_country.in.result
                ? 'EU Residency Verified!'
                : 'EU Residency Not Verified'}
            </h2>

            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">ZK Proof Status</p>
                <p className="font-semibold text-gray-800">
                  {verificationResult.data.document_type.eq.result && verificationResult.data.issuing_country.in.result
                    ? '✓ Proof Complete'
                    : '○ Proof Incomplete'}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Document Type Check</p>
                <p
                  className={`font-semibold ${
                    verificationResult.data.document_type.eq.result ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {verificationResult.data.document_type.eq.result
                    ? '✓ Valid Residence Permit'
                    : '✗ Not a Residence Permit'}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Issuing Country Check</p>
                <p
                  className={`font-semibold ${
                    verificationResult.data.issuing_country.in.result ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {verificationResult.data.issuing_country.in.result ? '✓ Issued in EU Country' : '✗ Not issued in EU'}
                </p>
              </div>
            </div>
          </div>
        )}

        {verificationResult && verificationResult.type === 'kyc' && (
          <div
            className={`rounded-lg shadow-md p-6 ${
              verificationResult.data.sanctions.passed
                ? 'bg-orange-50 border-2 border-orange-500'
                : 'bg-red-50 border-2 border-red-500'
            }`}
          >
            <div className="flex items-center justify-center mb-4">
              {verificationResult.data.sanctions.passed ? (
                <svg className="w-16 h-16 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              ) : (
                <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              )}
            </div>

            <h2
              className={`text-2xl font-bold text-center mb-4 ${
                verificationResult.data.sanctions.passed ? 'text-orange-700' : 'text-red-700'
              }`}
            >
              {verificationResult.data.sanctions.passed ? 'KYC Verification Complete!' : 'KYC Verification Failed'}
            </h2>

            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Full Name</p>
                <p className="font-semibold text-gray-800">{verificationResult.data.fullname.disclose.result}</p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Date of Birth</p>
                <p className="font-semibold text-gray-800">
                  {new Date(verificationResult.data.birthdate.disclose.result).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Nationality</p>
                <p className="font-semibold text-gray-800">{verificationResult.data.nationality.disclose.result}</p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Document Number</p>
                <p className="font-semibold text-gray-800">{verificationResult.data.document_number.disclose.result}</p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Document Expiry Date</p>
                <p className="font-semibold text-gray-800">
                  {new Date(verificationResult.data.expiry_date.disclose.result).toLocaleDateString()}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-2">Sanctions Check</p>
                <p
                  className={`font-semibold mb-3 ${
                    verificationResult.data.sanctions.passed ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {verificationResult.data.sanctions.passed ? '✓ No Sanctions Found' : '✗ Sanctions Check Failed'}
                </p>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Country Checks:</p>
                  <div className="grid grid-cols-2 gap-2">
                    {Object.entries(verificationResult.data.sanctions.countries).map(([country, data]) => (
                      <div key={country} className="flex items-center space-x-1">
                        <span className={data.passed ? 'text-green-600' : 'text-red-600'}>
                          {data.passed ? '✓' : '✗'}
                        </span>
                        <span className="text-xs text-gray-700">{country}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-xs font-semibold text-gray-700 mb-2">Sanctions Lists:</p>
                  <div className="space-y-1">
                    {Object.entries(verificationResult.data.sanctions.lists).map(([list, data]) => (
                      <div key={list} className="flex items-center space-x-1">
                        <span className={data.passed ? 'text-green-600' : 'text-red-600'}>
                          {data.passed ? '✓' : '✗'}
                        </span>
                        <span className="text-xs text-gray-700">{list}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {verificationResult && verificationResult.type === 'facematch' && (
          <div
            className={`rounded-lg shadow-md p-6 ${
              verificationResult.data.facematch.passed
                ? 'bg-indigo-50 border-2 border-indigo-500'
                : 'bg-red-50 border-2 border-red-500'
            }`}
          >
            <div className="flex items-center justify-center mb-4">
              {verificationResult.data.facematch.passed ? (
                <svg className="w-16 h-16 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              ) : (
                <svg className="w-16 h-16 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              )}
            </div>

            <h2
              className={`text-2xl font-bold text-center mb-4 ${
                verificationResult.data.facematch.passed ? 'text-indigo-700' : 'text-red-700'
              }`}
            >
              {verificationResult.data.facematch.passed
                ? 'FaceMatch Verification Passed!'
                : 'FaceMatch Verification Failed'}
            </h2>

            <div className="space-y-3">
              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Verification Status</p>
                <p
                  className={`font-semibold text-lg ${
                    verificationResult.data.facematch.passed ? 'text-green-700' : 'text-red-700'
                  }`}
                >
                  {verificationResult.data.facematch.passed
                    ? '✓ You match the person on the ID'
                    : '✗ Face does not match the ID'}
                </p>
              </div>

              <div className="bg-white rounded-lg p-4">
                <p className="text-sm text-gray-600 mb-1">Privacy Notice</p>
                <p className="text-xs text-gray-600">
                  No personal information was disclosed during this verification. Only your identity match status was
                  verified.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
