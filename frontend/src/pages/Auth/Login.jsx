import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Mail, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthLayout from '../../components/auth/AuthLayout';
import FormInput from '../../components/common/FormInput';
import { toast } from 'react-hot-toast';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const { login, loading } = useAuthStore();
  const { theme } = useThemeStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleAuthMessage = (event) => {
        const expectedBackendOrigin = 'http://localhost:5001';

        if (event.origin !== expectedBackendOrigin) {
            console.warn(`Login Page: Message received from unexpected origin: ${event.origin}. Expected: ${expectedBackendOrigin}. Ignoring message.`);
            return;
        }

        if (event.data && event.data.type === 'oauth_success') {
            console.log('Login Page: OAuth success signal received from popup.');
            toast.success('Login successful!');
            window.location.reload();
        }
         else if (event.data && event.data.type === 'oauth_error') {
           console.error('Login Page: OAuth error signal received:', event.data.error);
           toast.error(event.data.error || 'OAuth login failed.');
           setErrors({ form: event.data.error || 'OAuth login failed' });
        } else {           
           console.log("Login Page: Received unexpected message structure:", event.data);
        }
    };

    console.log("Login Page: Adding message listener for OAuth callbacks.");
    window.addEventListener('message', handleAuthMessage);


    return () => {
        console.log("Login Page: Removing message listener.");
        window.removeEventListener('message', handleAuthMessage);
    };
}, []);

  const validate = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'Email is required';
    if (!password) newErrors.password = 'Password is required';
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await login(email, password);
      toast.success('Logged in successfully!');
      navigate('/');
    } catch (error) {
      setErrors({ form: error.message || 'Login failed' });
      toast.error('Login failed');
    }
  };
  
  // Replace your handlers with these updated versions
  const handleGoogleLogin = () => {
    openOAuthPopup('http://localhost:5001/api/auth/google', 'google');
  };
  
  const handleGitHubLogin = () => {
    openOAuthPopup('http://localhost:5001/api/auth/github', 'github');
  };

  const openOAuthPopup = (url, provider) => {
    // Open OAuth popup window
    const width = 500;
    const height = 600;
    const left = window.screen.width / 2 - width / 2;
    const top = window.screen.height / 2 - height / 2;
    
    window.open(
      url,
      'oauthWindow',
      `width=${width},height=${height},left=${left},top=${top}`
    );
  };

  return (
    <AuthLayout title="Sign in to your account" subtitle="">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className={`
          p-6 rounded-xl 
          ${theme === 'dark' 
            ? 'bg-gray-800/70 border border-gray-700/50' 
            : 'bg-white/70 border border-gray-200/50'}
          backdrop-filter backdrop-blur-md shadow-lg
        `}>
          <form className="space-y-6" onSubmit={handleSubmit}>
            {errors.form && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`
                  rounded-lg p-4 border 
                  ${theme === 'dark'
                    ? 'bg-red-900/20 border-red-800/50 text-red-200'
                    : 'bg-red-50/80 border-red-200/50 text-red-800'}
                  backdrop-filter backdrop-blur-sm
                `}
              >
                <div className="flex">
                  <div className="ml-3">
                    <h3 className="text-sm font-medium">
                      {errors.form}
                    </h3>
                  </div>
                </div>
              </motion.div>
            )}

            <FormInput
              label="Email address"
              icon={Mail}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={errors.email}
            />

            <FormInput
              label="Password"
              icon={Lock}
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              error={errors.password}
            />

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className={`
                    h-4 w-4 rounded border-gray-300 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                    ${theme === 'dark' 
                      ? 'bg-gray-900/50 border-gray-700 text-blue-600' 
                      : 'bg-white/50 border-gray-300 text-blue-600'}
                    transition-all duration-200
                  `}
                />
                <label
                  htmlFor="remember-me"
                  className={`ml-2 block text-sm ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className={`
                    font-medium transition-all duration-200
                    ${theme === 'dark'
                      ? 'text-blue-400 hover:text-blue-300'
                      : 'text-blue-600 hover:text-blue-500'}
                  `}
                >
                  Forgot your password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className={`
                  w-full flex justify-center items-center py-2.5 px-4 rounded-lg
                  transition-all duration-200 shadow-md
                  ${theme === 'dark'
                    ? 'bg-blue-600/80 hover:bg-blue-700/80 text-white border border-blue-500/30'
                    : 'bg-blue-500/80 hover:bg-blue-600/80 text-white border border-blue-600/30'}
                  backdrop-filter backdrop-blur-sm
                  disabled:opacity-50 disabled:cursor-not-allowed
                `}
              >
                {loading ? 'Signing in...' : 'Sign in'}
                {!loading && <ArrowRight size={18} className="ml-2" />}
              </button>
            </div>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className={`w-full border-t ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`} />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className={`px-2 ${theme === 'dark' ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'}`}>
                  Or continue with
                </span>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <motion.button
                whileHover={{ y: -2 }}
                onClick={handleGoogleLogin}
                className={`
                  w-full inline-flex justify-center py-2.5 px-4 rounded-lg
                  transition-all duration-200 shadow-sm
                  ${theme === 'dark'
                    ? 'bg-gray-800/70 hover:bg-gray-700/70 text-gray-300 border border-gray-700/50'
                    : 'bg-white/70 hover:bg-gray-50/70 text-gray-700 border border-gray-200/50'}
                  backdrop-filter backdrop-blur-sm
                `}
              >
                <span className="sr-only">Sign in with Google</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                </svg>
              </motion.button>

              <motion.button
                whileHover={{ y: -2 }}
                onClick={handleGitHubLogin}
                className={`
                  w-full inline-flex justify-center py-2.5 px-4 rounded-lg
                  transition-all duration-200 shadow-sm
                  ${theme === 'dark'
                    ? 'bg-gray-800/70 hover:bg-gray-700/70 text-gray-300 border border-gray-700/50'
                    : 'bg-white/70 hover:bg-gray-50/70 text-gray-700 border border-gray-200/50'}
                  backdrop-filter backdrop-blur-sm
                `}
              >
                <span className="sr-only">Sign in with GitHub</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.button>
            </div>
          </div>

          <div className="mt-6 flex justify-center">
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Don't have an account?{' '}
              <Link
                to="/signup"
                className={`font-medium transition-all duration-200
                  ${theme === 'dark'
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-blue-600 hover:text-blue-500'}
                `}
              >
                Sign up now
              </Link>
            </span>
          </div>
        </div>
      </motion.div>
    </AuthLayout>
  );
}