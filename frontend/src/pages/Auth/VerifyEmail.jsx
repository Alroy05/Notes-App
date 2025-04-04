import { useEffect, useState } from 'react';
import { useLocation, useNavigate, useSearchParams, Link } from 'react-router-dom';
import { useThemeStore } from '../../store/themeStore';
import { MailCheck, CheckCircle, XCircle, RefreshCw,ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import AuthLayout from '../../components/auth/AuthLayout';
import { toast } from 'react-hot-toast';

export default function VerifyEmail() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { theme } = useThemeStore();
  const [email, setEmail] = useState('');
  const [resent, setResent] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState('pending'); // 'pending', 'success', 'error'
  const [token, setToken] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      setVerificationStatus('pending');
      
      const response = await axios.get(`http://localhost:5001/api/auth/verify`, {
        params: { token },
        withCredentials: true
      });
      
      setVerificationStatus('success');
      toast.success('Email verified successfully!');
      
      // Redirect to login after successful verification (with a delay)
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Email verified successfully! You can now log in.' } 
        });
      }, 3000);
      
    } catch (error) {
      setVerificationStatus('error');
      setErrorMessage(error.response?.data?.message || 'Verification failed. Please try again.');
      toast.error('Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      setIsLoading(true);
      await axios.post('/api/auth/resend-verification', { email }, { 
        withCredentials: true 
      });
      
      setResent(true);
      toast.success('Verification email resent!');
      setTimeout(() => setResent(false), 5000);
    } catch (error) {
      setErrorMessage(error.response?.data?.message || 'Failed to resend verification email.');
      toast.error('Failed to resend verification email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthLayout title="Verify your email address">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`
          p-6 rounded-xl text-center
          ${theme === 'dark' 
            ? 'bg-gray-800/70 border border-gray-700/50' 
            : 'bg-white/70 border border-gray-200/50'}
          backdrop-filter backdrop-blur-md shadow-lg
        `}>
          {verificationStatus === 'success' ? (
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center p-4"
            >
              <div className={`
                p-3 rounded-full
                ${theme === 'dark' ? 'bg-green-900/20' : 'bg-green-100/80'}
                backdrop-filter backdrop-blur-sm
              `}>
                <CheckCircle className="h-12 w-12 text-green-500" />
              </div>
              <h2 className={`mt-4 text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Email Verified Successfully!
              </h2>
              <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                You will be redirected to the login page shortly.
              </p>
              <Link
                to="/login"
                className={`
                  mt-6 inline-flex items-center py-2 px-4 rounded-lg
                  transition-all duration-200 shadow-sm text-sm font-medium
                  ${theme === 'dark'
                    ? 'bg-gray-700/80 hover:bg-gray-600/80 text-white border border-gray-600/50'
                    : 'bg-gray-200/80 hover:bg-gray-300/80 text-gray-800 border border-gray-300/50'}
                  backdrop-filter backdrop-blur-sm
                `}
              >
                Go to Login
              </Link>
            </motion.div>
          ) : verificationStatus === 'error' ? (
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center p-4"
            >
              <div className={`
                p-3 rounded-full
                ${theme === 'dark' ? 'bg-red-900/20' : 'bg-red-100/80'}
                backdrop-filter backdrop-blur-sm
              `}>
                <XCircle className="h-12 w-12 text-red-500" />
              </div>
              <h2 className={`mt-4 text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                Verification Failed
              </h2>
              <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                {errorMessage}
              </p>
              <button
                onClick={() => setVerificationStatus('pending')}
                className={`
                  mt-6 inline-flex items-center py-2 px-4 rounded-lg
                  transition-all duration-200 shadow-sm text-sm font-medium
                  ${theme === 'dark'
                    ? 'bg-blue-600/80 hover:bg-blue-700/80 text-white border border-blue-500/30'
                    : 'bg-blue-500/80 hover:bg-blue-600/80 text-white border border-blue-600/30'}
                  backdrop-filter backdrop-blur-sm
                `}
              >
                <RefreshCw size={16} className="mr-2" />
                Try Again
              </button>
            </motion.div>
          ) : (
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="flex flex-col items-center p-4"
            >
              <div className={`
                p-3 rounded-full
                ${theme === 'dark' ? 'bg-blue-900/20' : 'bg-blue-100/80'}
                backdrop-filter backdrop-blur-sm
              `}>
                <MailCheck className="h-12 w-12 text-blue-500" />
              </div>
              <h2 className={`mt-4 text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                {token ? "Verify Your Email" : "Check Your Inbox"}
              </h2>
              <p className={`mt-2 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
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
                  disabled={isLoading}
                  className={`
                    mt-6 inline-flex items-center py-2.5 px-6 rounded-lg
                    transition-all duration-200 shadow-md font-medium
                    ${theme === 'dark'
                      ? 'bg-blue-600/80 hover:bg-blue-700/80 text-white border border-blue-500/30'
                      : 'bg-blue-500/80 hover:bg-blue-600/80 text-white border border-blue-600/30'}
                    backdrop-filter backdrop-blur-sm
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {isLoading ? 'Verifying...' : 'Verify Email'}
                  {!isLoading && <ArrowRight size={18} className="ml-2" />}
                </button>
              )}
              
              <div className="mt-6">
                <button
                  onClick={handleResend}
                  disabled={resent || isLoading}
                  className={`
                    text-sm font-medium transition-all duration-200
                    ${theme === 'dark'
                      ? 'text-blue-400 hover:text-blue-300'
                      : 'text-blue-600 hover:text-blue-500'}
                    disabled:opacity-50 disabled:cursor-not-allowed
                  `}
                >
                  {resent ? 'Email resent!' : "Didn't receive an email? Resend"}
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AuthLayout>
  );
}