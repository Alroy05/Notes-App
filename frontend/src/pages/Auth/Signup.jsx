import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { Mail, Lock, User } from 'lucide-react';
import AuthLayout from '../../components/auth/AuthLayout';
import FormInput from '../../components/common/FormInput';

export default function Signup() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const { signup, loading } = useAuthStore();
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
      navigate('/verify-email');
    } catch (error) {
      setErrors({ form: error.message || 'Signup failed' });
    }
  };

  return (
    <AuthLayout 
      title="Create a new account" 
      subtitle="Already have an account? "
      subtitleLink={<Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300">Sign in</Link>}
    >
      <form className="space-y-6" onSubmit={handleSubmit}>
        {errors.form && (
          <div className="rounded-md bg-red-50 p-4 dark:bg-red-900 dark:bg-opacity-20">
            <div className="flex">
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                  {errors.form}
                </h3>
              </div>
            </div>
          </div>
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
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </div>
      </form>
    </AuthLayout>
  );
}