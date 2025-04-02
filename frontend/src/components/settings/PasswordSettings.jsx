import { useForm } from 'react-hook-form';
import { Lock, Key, Shield, CheckCircle } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore } from '../../store/authStore';
import FormInput from '../common/FormInput';

export default function PasswordSettings() {
  const { changePassword, isLoading: storeLoading } = useAuthStore();
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const onSubmit = async (data) => {
    if (data.newPassword !== data.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    setIsLoading(true);
    setError('');
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword
      });
      setSuccess('Password changed successfully!');
      reset();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">Change Password</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-6">
          <FormInput
            label="Current Password"
            icon={Lock}
            id="currentPassword"
            name="currentPassword"
            type="password"
            register={register}
            validation={{ required: 'Current password is required' }}
            error={errors.currentPassword}
          />

          <div className="border-t border-gray-200 dark:border-gray-700 my-4 pt-4">
            <div className="flex items-center mb-4">
              <Shield className="h-5 w-5 text-blue-500 mr-2" />
              <h3 className="text-md font-medium text-gray-900 dark:text-white">New Password</h3>
            </div>
          </div>

          <FormInput
            label="New Password"
            icon={Key}
            id="newPassword"
            name="newPassword"
            type="password"
            register={register}
            validation={{ 
              required: 'New password is required',
              minLength: {
                value: 8,
                message: 'Password must be at least 8 characters'
              }
            }}
            error={errors.newPassword}
          />

          <FormInput
            label="Confirm New Password"
            icon={Key}
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            register={register}
            validation={{ required: 'Please confirm your new password' }}
            error={errors.confirmPassword}
          />
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900/30 dark:text-red-200"
          >
            {error}
          </motion.div>
        )}

        {success && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 text-sm text-green-700 bg-green-100 rounded-lg flex items-center dark:bg-green-900/30 dark:text-green-200"
          >
            <CheckCircle className="h-5 w-5 mr-2" />
            {success}
          </motion.div>
        )}

        <motion.div 
          className="flex justify-end"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <button
            type="submit"
            disabled={isLoading || storeLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center space-x-2 shadow-md transition-all duration-200"
          >
            {(isLoading || storeLoading) ? (
              <>
                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                <span>Changing...</span>
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" />
                <span>Change Password</span>
              </>
            )}
          </button>
        </motion.div>
      </form>
    </motion.div>
  );
}