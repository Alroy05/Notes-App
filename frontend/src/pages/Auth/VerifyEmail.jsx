import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { MailCheck, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import AuthLayout from '../../components/auth/AuthLayout';

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState('');
  const [resent, setResent] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('pending'); // 'pending', 'success', 'error'
  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    // Get token from URL if available
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    }
    
    // Get email from location state if available
    if (location.state?.email) {
      setEmail(location.state.email);
    } else if (!tokenFromUrl) {
      // Only redirect if we don't have a token in the URL
      navigate('/signup');
    }
  }, [location, navigate, searchParams]);

  const handleVerify = async () => {
    try {
      setVerificationStatus('pending');
      
      const response = await axios.get(`http://localhost:5001/api/auth/verify`, {
        params: { token },
        withCredentials: true
      });
      
      setVerificationStatus('success');
      
      // Redirect to login after successful verification (with a delay)
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Email verified successfully! You can now log in.' } 
        });
      }, 3000);
      
    } catch (error) {
      setVerificationStatus('error');
      setErrorMessage(error.response?.data?.message || 'Verification failed. Please try again.');
    }
  };

  const handleResend = async () => {
    try {
      await axios.post('/api/auth/resend-verification', { email }, { 
        withCredentials: true 
      });
      
      setResent(true);
      setTimeout(() => setResent(false), 5000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to resend verification email.');
    }
  };

  return (
    <AuthLayout title="Verify your email address">
      <div className="text-center">
        {verificationStatus === 'success' ? (
          <div className="flex flex-col items-center">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <h2 className="mt-4 text-xl font-semibold">Email Verified Successfully!</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              You will be redirected to the login page shortly.
            </p>
          </div>
        ) : verificationStatus === 'error' ? (
          <div className="flex flex-col items-center">
            <XCircle className="h-12 w-12 text-red-500" />
            <h2 className="mt-4 text-xl font-semibold">Verification Failed</h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {errorMessage}
            </p>
          </div>
        ) : (
          <>
            <MailCheck className="mx-auto h-12 w-12 text-blue-500" />
            <p className="mt-4 text-gray-600 dark:text-gray-300">
              {token ? (
                "Click the button below to verify your email address."
              ) : (
                <>
                  We've sent a verification link to <span className="font-medium">{email}</span>.
                  Please check your email and click the link to verify your account.
                </>
              )}
            </p>
            
            {token && (
              <button
                onClick={handleVerify}
                className="mt-6 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              >
                Verify Email
              </button>
            )}
            
            <div className="mt-6">
              <button
                onClick={handleResend}
                disabled={resent}
                className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 disabled:opacity-50"
              >
                {resent ? 'Email resent!' : "Didn't receive an email? Resend"}
              </button>
            </div>
          </>
        )}
      </div>
    </AuthLayout>
  );
}