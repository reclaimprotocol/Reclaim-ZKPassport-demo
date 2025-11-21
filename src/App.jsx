import { useState } from 'react';
import { ZKPassport, EU_COUNTRIES } from '@zkpassport/sdk';
import QRCode from 'qrcode.react';

function App() {
  const [url, setUrl] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [verificationType, setVerificationType] = useState(null);
  const [loadingState, setLoadingState] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const closeModal = () => {
    setShowModal(false);
    setVerificationResult(null);
    setUrl('');
    setLoadingState(null);
  };

  const getAgeVerification = async () => {
    try {
      const zkPassport = new ZKPassport('https://f9e1123e3c55.ngrok-free.app');

      const queryBuilder = await zkPassport.request({
        name: 'ZKPassport',
        logo: 'https://zkpassport.id/logo.png',
        purpose: 'Prove you are 18+ years old',
        scope: 'adult',
      });

      const { url, onResult, onRequestReceived, onGeneratingProof } = queryBuilder.gte('age', 18).done();

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
        setShowModal(true);

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

      const { url, onResult, onRequestReceived, onGeneratingProof } = queryBuilder.disclose('nationality').done();

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
        setShowModal(true);

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
        setShowModal(true);

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
        setShowModal(true);

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

      const { url, onResult, onRequestReceived, onGeneratingProof } = queryBuilder.facematch('strict').done();

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
        setShowModal(true);

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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-900 to-slate-900 shadow-2xl">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1 tracking-tight">Guest Check-In System</h1>
              <p className="text-blue-200 text-sm">Secure Identity Verification Portal</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="h-12 w-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        {/* Verification Services Grid */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-slate-800 mb-2">Verification Services</h2>
          <p className="text-slate-600 mb-6">Select a verification method to begin the check-in process</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Age Verification Card */}
            <button
              onClick={getAgeVerification}
              className="group bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 hover:border-blue-300 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-blue-600 bg-blue-100 px-3 py-1 rounded-full">Age</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Age Verification</h3>
              <p className="text-sm text-slate-600">Verify guest is 18+ years old for check-in eligibility</p>
            </button>

            {/* Nationality Card */}
            <button
              onClick={getNationalityVerification}
              className="group bg-white hover:bg-gradient-to-br hover:from-purple-50 hover:to-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 hover:border-purple-300 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-14 w-14 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-purple-600 bg-purple-100 px-3 py-1 rounded-full">
                  Identity
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Nationality Disclosure</h3>
              <p className="text-sm text-slate-600">Verify and disclose guest nationality information</p>
            </button>

            {/* EU Residency Card */}
            <button
              onClick={getEUResidencyVerification}
              className="group bg-white hover:bg-gradient-to-br hover:from-emerald-50 hover:to-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 hover:border-emerald-300 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-14 w-14 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                    />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-3 py-1 rounded-full">
                  Residency
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">EU Residency Check</h3>
              <p className="text-sm text-slate-600">Verify European Union residence permit status</p>
            </button>

            {/* KYC Card */}
            <button
              onClick={getKYCVerification}
              className="group bg-white hover:bg-gradient-to-br hover:from-amber-50 hover:to-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 hover:border-amber-300 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-14 w-14 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-amber-600 bg-amber-100 px-3 py-1 rounded-full">
                  Full KYC
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Complete KYC</h3>
              <p className="text-sm text-slate-600">Full identity verification with sanctions screening</p>
            </button>

            {/* FaceMatch Card */}
            <button
              onClick={getPrivateFaceMatchVerification}
              className="group bg-white hover:bg-gradient-to-br hover:from-indigo-50 hover:to-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-slate-200 hover:border-indigo-300 text-left"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="h-14 w-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md group-hover:scale-110 transition-transform duration-300">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                </div>
                <span className="text-xs font-semibold text-indigo-600 bg-indigo-100 px-3 py-1 rounded-full">
                  Biometric
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-2">Face Match</h3>
              <p className="text-sm text-slate-600">Private biometric verification without data disclosure</p>
            </button>
          </div>
        </div>

        {/* QR Code Section */}
        {url && !showModal && (
          <div className="bg-white rounded-2xl shadow-2xl p-8 border border-slate-200">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="flex-1">
                <div className="inline-flex items-center bg-blue-100 text-blue-700 px-4 py-2 rounded-full mb-4">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z"
                    />
                  </svg>
                  <span className="font-semibold text-sm">Mobile Verification Required</span>
                </div>
                <h3 className="text-2xl font-bold text-slate-800 mb-3">Scan to Continue</h3>
                <p className="text-slate-600 mb-6">
                  Use your mobile device to scan the QR code and complete the verification process. The secure link will
                  guide you through identity confirmation.
                </p>

                {loadingState && (
                  <div className="space-y-3">
                    {loadingState === 'received' && (
                      <div className="flex items-center space-x-3 bg-blue-50 text-blue-700 px-4 py-3 rounded-xl border border-blue-200">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
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
                        <span className="font-semibold">Request Received</span>
                      </div>
                    )}

                    {loadingState === 'generating' && (
                      <div className="flex items-center space-x-3 bg-amber-50 text-amber-700 px-4 py-3 rounded-xl border border-amber-200">
                        <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
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
                        <div>
                          <span className="font-semibold block">Generating Proof</span>
                          <span className="text-xs">This may take up to 10 seconds</span>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="flex flex-col items-center">
                <div className="bg-white p-6 rounded-2xl shadow-xl border-4 border-slate-100">
                  <QRCode value={url} size={220} level="H" />
                </div>
                <p className="text-xs text-slate-500 mt-4 text-center">Secure verification link</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Results Modal */}
      {showModal && verificationResult && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fadeIn">
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>

          {/* Modal Content */}
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-slideUp">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-6 right-6 z-10 bg-white hover:bg-slate-100 text-slate-600 hover:text-slate-800 rounded-full p-2 shadow-lg transition-all duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8">
              {/* Age Result */}
              {verificationResult.type === 'age' && (
                <div
                  className={`rounded-2xl p-8 border-2 ${
                    verificationResult.data.age.gte.result
                      ? 'bg-gradient-to-br from-emerald-50 to-white border-emerald-300'
                      : 'bg-gradient-to-br from-red-50 to-white border-red-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg ${
                          verificationResult.data.age.gte.result
                            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                            : 'bg-gradient-to-br from-red-500 to-red-600'
                        }`}
                      >
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {verificationResult.data.age.gte.result ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          )}
                        </svg>
                      </div>
                      <div>
                        <h2
                          className={`text-3xl font-bold ${
                            verificationResult.data.age.gte.result ? 'text-emerald-900' : 'text-red-900'
                          }`}
                        >
                          {verificationResult.data.age.gte.result ? 'Age Verified' : 'Age Verification Failed'}
                        </h2>
                        <p className="text-slate-600 text-sm">Identity verification complete</p>
                      </div>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${
                        verificationResult.data.age.gte.result
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {verificationResult.data.age.gte.result ? 'APPROVED' : 'DECLINED'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200">
                      <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide font-semibold">Proof Status</p>
                      <p className="font-bold text-slate-800 text-lg">
                        {verificationResult.data.age.gte.result ? '✓ Complete' : '○ Incomplete'}
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200">
                      <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide font-semibold">Requirement</p>
                      <p className="font-bold text-slate-800 text-lg">
                        {verificationResult.data.age.gte.expected}+ years
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200">
                      <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide font-semibold">Result</p>
                      <p
                        className={`font-bold text-lg ${
                          verificationResult.data.age.gte.result ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {verificationResult.data.age.gte.result ? '✓ Eligible' : '✗ Not Eligible'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Nationality Result */}
              {verificationResult.type === 'nationality' && (
                <div className="bg-gradient-to-br from-purple-50 to-white rounded-2xl p-8 border-2 border-purple-300">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div className="h-16 w-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-3xl font-bold text-purple-900">Nationality Verified</h2>
                        <p className="text-slate-600 text-sm">Guest information disclosed</p>
                      </div>
                    </div>
                    <span className="px-4 py-2 rounded-full text-sm font-bold bg-purple-100 text-purple-700">
                      VERIFIED
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200">
                      <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide font-semibold">Proof Status</p>
                      <p className="font-bold text-slate-800 text-lg">
                        {verificationResult.data.nationality.disclose.result ? '✓ Complete' : '○ Incomplete'}
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200">
                      <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide font-semibold">Nationality</p>
                      <p className="font-bold text-purple-600 text-2xl">
                        {verificationResult.data.nationality.disclose.result || 'Not disclosed'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* EU Residency Result */}
              {verificationResult.type === 'eu-resident' && (
                <div
                  className={`rounded-2xl p-8 border-2 ${
                    verificationResult.data.document_type.eq.result && verificationResult.data.issuing_country.in.result
                      ? 'bg-gradient-to-br from-emerald-50 to-white border-emerald-300'
                      : 'bg-gradient-to-br from-red-50 to-white border-red-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg ${
                          verificationResult.data.document_type.eq.result &&
                          verificationResult.data.issuing_country.in.result
                            ? 'bg-gradient-to-br from-emerald-500 to-emerald-600'
                            : 'bg-gradient-to-br from-red-500 to-red-600'
                        }`}
                      >
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {verificationResult.data.document_type.eq.result &&
                          verificationResult.data.issuing_country.in.result ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          )}
                        </svg>
                      </div>
                      <div>
                        <h2
                          className={`text-3xl font-bold ${
                            verificationResult.data.document_type.eq.result &&
                            verificationResult.data.issuing_country.in.result
                              ? 'text-emerald-900'
                              : 'text-red-900'
                          }`}
                        >
                          {verificationResult.data.document_type.eq.result &&
                          verificationResult.data.issuing_country.in.result
                            ? 'EU Residency Confirmed'
                            : 'EU Residency Not Verified'}
                        </h2>
                        <p className="text-slate-600 text-sm">Document verification complete</p>
                      </div>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${
                        verificationResult.data.document_type.eq.result &&
                        verificationResult.data.issuing_country.in.result
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {verificationResult.data.document_type.eq.result &&
                      verificationResult.data.issuing_country.in.result
                        ? 'APPROVED'
                        : 'DECLINED'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200">
                      <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide font-semibold">Proof Status</p>
                      <p className="font-bold text-slate-800 text-lg">
                        {verificationResult.data.document_type.eq.result &&
                        verificationResult.data.issuing_country.in.result
                          ? '✓ Complete'
                          : '○ Incomplete'}
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200">
                      <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide font-semibold">Document Type</p>
                      <p
                        className={`font-bold text-lg ${
                          verificationResult.data.document_type.eq.result ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {verificationResult.data.document_type.eq.result ? '✓ Valid Permit' : '✗ Invalid'}
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200">
                      <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide font-semibold">
                        Issuing Country
                      </p>
                      <p
                        className={`font-bold text-lg ${
                          verificationResult.data.issuing_country.in.result ? 'text-emerald-600' : 'text-red-600'
                        }`}
                      >
                        {verificationResult.data.issuing_country.in.result ? '✓ EU Country' : '✗ Non-EU'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* KYC Result */}
              {verificationResult.type === 'kyc' && (
                <div
                  className={`rounded-2xl p-8 border-2 ${
                    verificationResult.data.sanctions.passed
                      ? 'bg-gradient-to-br from-amber-50 to-white border-amber-300'
                      : 'bg-gradient-to-br from-red-50 to-white border-red-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg ${
                          verificationResult.data.sanctions.passed
                            ? 'bg-gradient-to-br from-amber-500 to-amber-600'
                            : 'bg-gradient-to-br from-red-500 to-red-600'
                        }`}
                      >
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {verificationResult.data.sanctions.passed ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          )}
                        </svg>
                      </div>
                      <div>
                        <h2
                          className={`text-3xl font-bold ${
                            verificationResult.data.sanctions.passed ? 'text-amber-900' : 'text-red-900'
                          }`}
                        >
                          {verificationResult.data.sanctions.passed ? 'KYC Complete' : 'KYC Failed'}
                        </h2>
                        <p className="text-slate-600 text-sm">Full identity verification processed</p>
                      </div>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${
                        verificationResult.data.sanctions.passed
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {verificationResult.data.sanctions.passed ? 'APPROVED' : 'DECLINED'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200">
                      <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide font-semibold">Full Name</p>
                      <p className="font-bold text-slate-800 text-lg">
                        {verificationResult.data.fullname.disclose.result}
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200">
                      <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide font-semibold">Date of Birth</p>
                      <p className="font-bold text-slate-800 text-lg">
                        {new Date(verificationResult.data.birthdate.disclose.result).toLocaleDateString()}
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200">
                      <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide font-semibold">Nationality</p>
                      <p className="font-bold text-slate-800 text-lg">
                        {verificationResult.data.nationality.disclose.result}
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200">
                      <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide font-semibold">
                        Document Number
                      </p>
                      <p className="font-bold text-slate-800 text-lg">
                        {verificationResult.data.document_number.disclose.result}
                      </p>
                    </div>

                    <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200">
                      <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide font-semibold">
                        Document Expiry
                      </p>
                      <p className="font-bold text-slate-800 text-lg">
                        {new Date(verificationResult.data.expiry_date.disclose.result).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl p-6 shadow-md border border-slate-200">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-bold text-slate-800">Sanctions Screening</h3>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          verificationResult.data.sanctions.passed
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {verificationResult.data.sanctions.passed ? '✓ CLEAR' : '✗ FLAGGED'}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <p className="text-xs font-bold text-slate-600 mb-3 uppercase tracking-wide">Country Checks</p>
                        <div className="space-y-2">
                          {Object.entries(verificationResult.data.sanctions.countries).map(([country, data]) => (
                            <div
                              key={country}
                              className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg"
                            >
                              <span className="text-sm font-medium text-slate-700">{country}</span>
                              <span className={`font-bold ${data.passed ? 'text-emerald-600' : 'text-red-600'}`}>
                                {data.passed ? '✓' : '✗'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-slate-600 mb-3 uppercase tracking-wide">Sanctions Lists</p>
                        <div className="space-y-2">
                          {Object.entries(verificationResult.data.sanctions.lists).map(([list, data]) => (
                            <div
                              key={list}
                              className="flex items-center justify-between bg-slate-50 px-3 py-2 rounded-lg"
                            >
                              <span className="text-xs font-medium text-slate-700">{list}</span>
                              <span className={`font-bold ${data.passed ? 'text-emerald-600' : 'text-red-600'}`}>
                                {data.passed ? '✓' : '✗'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* FaceMatch Result */}
              {verificationResult.type === 'facematch' && (
                <div
                  className={`rounded-2xl p-8 border-2 ${
                    verificationResult.data.facematch.passed
                      ? 'bg-gradient-to-br from-indigo-50 to-white border-indigo-300'
                      : 'bg-gradient-to-br from-red-50 to-white border-red-300'
                  }`}
                >
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`h-16 w-16 rounded-2xl flex items-center justify-center shadow-lg ${
                          verificationResult.data.facematch.passed
                            ? 'bg-gradient-to-br from-indigo-500 to-indigo-600'
                            : 'bg-gradient-to-br from-red-500 to-red-600'
                        }`}
                      >
                        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {verificationResult.data.facematch.passed ? (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          ) : (
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          )}
                        </svg>
                      </div>
                      <div>
                        <h2
                          className={`text-3xl font-bold ${
                            verificationResult.data.facematch.passed ? 'text-indigo-900' : 'text-red-900'
                          }`}
                        >
                          {verificationResult.data.facematch.passed ? 'Identity Matched' : 'Identity Mismatch'}
                        </h2>
                        <p className="text-slate-600 text-sm">Biometric verification complete</p>
                      </div>
                    </div>
                    <span
                      className={`px-4 py-2 rounded-full text-sm font-bold ${
                        verificationResult.data.facematch.passed
                          ? 'bg-indigo-100 text-indigo-700'
                          : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {verificationResult.data.facematch.passed ? 'MATCHED' : 'FAILED'}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white rounded-xl p-5 shadow-md border border-slate-200">
                      <p className="text-xs text-slate-500 mb-2 uppercase tracking-wide font-semibold">
                        Verification Status
                      </p>
                      <p
                        className={`font-bold text-lg ${
                          verificationResult.data.facematch.passed ? 'text-indigo-600' : 'text-red-600'
                        }`}
                      >
                        {verificationResult.data.facematch.passed ? '✓ Face matches ID' : '✗ Face does not match'}
                      </p>
                    </div>

                    <div className="bg-gradient-to-r from-indigo-50 to-blue-50 rounded-xl p-5 shadow-md border border-indigo-200">
                      <p className="text-xs text-indigo-600 mb-2 uppercase tracking-wide font-semibold">
                        Privacy Notice
                      </p>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        No personal information was disclosed. Only identity match status verified.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <div className="mt-8 flex justify-center">
                <button
                  onClick={closeModal}
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  Start New Verification
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;
