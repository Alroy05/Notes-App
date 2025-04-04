import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import { Mail, Lock, User, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import AuthLayout from '../../components/auth/AuthLayout';
import FormInput from '../../components/common/FormInput';
import { toast } from 'react-hot-toast';

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const { signup, loading } = useAuthStore();
  const { theme } = useThemeStore();
  const navigate = useNavigate();

  const validate = () => {
    const newErrors = {};
    if (!formData.fullName) newErrors.fullName = 'Full name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    try {
      await signup(formData);
      toast.success('Account created! Please verify your email.');
      navigate('/verify-email', { state: { email: formData.email } });
    } catch (error) {
      setErrors({ form: error.message || 'Signup failed' });
      toast.error('Signup failed');
    }
  };

  return (
    <AuthLayout 
      title="Create a new account" 
      subtitle=""
    >
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
              label="Full name"
              icon={User}
              id="fullName"
              name="fullName"
              type="text"
              autoComplete="name"
              required
              value={formData.fullName}
              onChange={handleChange}
              error={errors.fullName}
            />

            <FormInput
              label="Email address"
              icon={Mail}
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
            />

            <FormInput
              label="Password"
              icon={Lock}
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
            />

            <FormInput
              label="Confirm password"
              icon={Lock}
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              value={formData.confirmPassword}
              onChange={handleChange}
              error={errors.confirmPassword}
            />

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
                {loading ? 'Creating account...' : 'Create account'}
                {!loading && <ArrowRight size={18} className="ml-2" />}
              </button>
            </div>
          </form>

          <div className="mt-6 flex justify-center">
            <span className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'}`}>
              Already have an account?{' '}
              <Link
                to="/login"
                className={`font-medium transition-all duration-200
                  ${theme === 'dark'
                    ? 'text-blue-400 hover:text-blue-300'
                    : 'text-blue-600 hover:text-blue-500'}
                `}
              >
                Sign in
              </Link>
            </span>
          </div>
        </div>
      </motion.div>
    </AuthLayout>
  );
}