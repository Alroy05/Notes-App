import { useForm } from 'react-hook-form';
import { Lock, Key } from 'lucide-react';
import { useState } from 'react';
import { useAuthStore } from '../../store/authStore';
import FormInput from '../common/FormInput';

export default function PasswordSettings() {
  const { changePassword } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  
  const { 
    register, 
    handleSubmit, 
    reset, 
    watch, 
    formState: { errors } 
  } = useForm({
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }
  });

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
      setError(err.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Change Password</h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <FormInput
          label="Current Password"
          icon={Lock}
          id="currentPassword"
          type="password"
          error={errors.currentPassword?.message}
          {...register("currentPassword", { 
            required: "Current password is required" 
          })}
        />

        <FormInput
          label="New Password"
          icon={Key}
          id="newPassword"
          type="password"
          error={errors.newPassword?.message}
          {...register("newPassword", { 
            required: "New password is required",
            minLength: {
              value: 8,
              message: "Password must be at least 8 characters"
            }
          })}
        />

        <FormInput
          label="Confirm New Password"
          icon={Key}
          id="confirmPassword"
          type="password"
          error={errors.confirmPassword?.message}
          {...register("confirmPassword", { 
            required: "Please confirm your new password",
            validate: (value) => value === watch('newPassword') || "Passwords do not match"
          })}
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
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
}