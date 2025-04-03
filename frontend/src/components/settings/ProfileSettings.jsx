import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Image } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import FormInput from '../common/FormInput';

export default function ProfileSettings() {
  const { user, updateProfile } = useAuthStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      reset({
        fullName: user.fullName || '',
        email: user.email || '',
        profilePic: user.profilePic || ''
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      await updateProfile(data);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Profile Information</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Full Name"
          icon={User}
          id="fullName"
          name="fullName"
          type="text"
          register={register}
          validation={{ required: 'Full name is required' }}
          error={errors.fullName}
        />

        <FormInput
          label="Email Address"
          icon={Mail}
          id="email"
          name="email"
          type="email"
          register={register}
          validation={{ 
            required: 'Email is required',
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: 'Invalid email address'
            }
          }}
          error={errors.email}
        />

        <FormInput
          label="Profile Picture URL"
          icon={Image}
          id="profilePic"
          name="profilePic"
          type="url"
          register={register}
          error={errors.profilePic}
        />

        {error && (
          <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200">
            {error}
          </div>
        )}

        {success && (
          <div className="p-3 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-900 dark:text-green-200">
            {success}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}