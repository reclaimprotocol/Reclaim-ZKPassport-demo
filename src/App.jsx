import { useState } from 'react';
import { ZKPassport, EU_COUNTRIES } from '@zkpassport/sdk';
import { motion } from 'framer-motion';
import { Shield, Globe, UserCheck, ScanFace, Building2, ConciergeBell } from 'lucide-react';
import { VerificationCard } from "./components/VerificationCard.jsx";
import { ResultModal } from "./components/ResultModal.jsx";

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
      const zkPassport = new ZKPassport('https://zk-passport-ten.vercel.app/');

      const queryBuilder = await zkPassport.request({
        name: 'Grand Hotel Check-in',
        logo: 'https://zkpassport.id/logo.png',
        purpose: 'Verify age for check-in',
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
      const zkPassport = new ZKPassport('https://zk-passport-ten.vercel.app/');

      const queryBuilder = await zkPassport.request({
        name: 'Grand Hotel Check-in',
        logo: 'https://zkpassport.id/logo.png',
        purpose: 'Verify nationality for guest records',
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
      const zkPassport = new ZKPassport('https://zk-passport-ten.vercel.app/');

      const queryBuilder = await zkPassport.request({
        name: 'Grand Hotel Check-in',
        logo: 'https://zkpassport.id/logo.png',
        purpose: 'Verify EU residency for tax exemption',
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
      const zkPassport = new ZKPassport('https://zk-passport-ten.vercel.app/');

      const queryBuilder = await zkPassport.request({
        name: 'Grand Hotel Check-in',
        logo: 'https://zkpassport.id/logo.png',
        purpose: 'Complete guest identity verification',
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
      const zkPassport = new ZKPassport('https://zk-passport-ten.vercel.app/');

      const queryBuilder = await zkPassport.request({
        name: 'Grand Hotel Check-in',
        logo: 'https://zkpassport.id/logo.png',
        purpose: 'Biometric verification for keyless entry',
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
    <div className="min-h-screen bg-[#f8f9fa] text-stone-900 selection:bg-stone-200">
      <div className="relative max-w-7xl mx-auto px-6 py-12 md:py-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-24"
        >
          <div className="flex justify-center mb-12">
            <img
              src="https://cdn.brandfetch.io/accor.com/logo/theme/dark"
              alt="Accor"
              className="h-12 md:h-16 object-contain opacity-90"
            />
          </div>

          <h1 className="text-4xl md:text-5xl font-serif text-stone-900 mb-6 tracking-tight leading-tight">
            Digital Check-in<br />
            <span className="text-stone-600 text-3xl md:text-4xl font-light italic">Identity Verification</span>
          </h1>

          <p className="text-stone-700 max-w-lg mx-auto leading-relaxed font-medium text-sm md:text-base tracking-wide">
            Welcome to Accor. For your security and convenience, please complete the required verification steps below.
          </p>
        </motion.div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          <VerificationCard
            title="Age Verification"
            description="Confirm you meet the minimum age (18+) requirement for check-in."
            icon={UserCheck}
            onClick={getAgeVerification}
            delay={0}
          />
          <VerificationCard
            title="Nationality Check"
            description="Verify citizenship for international guest registration."
            icon={Globe}
            onClick={getNationalityVerification}
            delay={0.1}
          />
          <VerificationCard
            title="EU Residency"
            description="Confirm EU residency status for VAT exemption eligibility."
            icon={Building2}
            onClick={getEUResidencyVerification}
            delay={0.2}
          />
          <VerificationCard
            title="Full Guest KYC"
            description="Complete identity verification for secure check-in process."
            icon={Shield}
            onClick={getKYCVerification}
            delay={0.3}
          />
          <VerificationCard
            title="Biometric Check"
            description="Secure face match for automated keyless room entry."
            icon={ScanFace}
            onClick={getPrivateFaceMatchVerification}
            delay={0.4}
          />
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-20 text-center text-stone-400 text-sm font-light"
        >
          <p>Reclaim Protocol• Privacy First Guest Experience</p>
        </motion.div>
      </div>

      <ResultModal
        show={showModal}
        url={url}
        loadingState={loadingState}
        result={verificationResult}
        onClose={closeModal}
      />
    </div>
  );
}

export default App;
