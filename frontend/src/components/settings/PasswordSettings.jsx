import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Lock, Key, Save } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import FormInput from '../common/FormInput';
import { toast } from 'react-hot-toast';

export default function PasswordSettings() {
  const { changePassword } = useAuthStore();
  const { theme } = useThemeStore();
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
      toast.error('New passwords do not match');
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
      toast.success('Password changed successfully!');
      reset();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to change password');
      toast.error(err.message || 'Failed to change password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`
      rounded-xl backdrop-filter backdrop-blur-md shadow-lg p-6
      ${theme === 'dark' 
        ? 'bg-gray-800/70 border border-gray-700/50 text-white' 
        : 'bg-white/70 border border-gray-200/50 text-gray-800'}
    `}>
      <h2 className={`text-lg font-medium mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Change Password
      </h2>
      
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
          <div className={`
            p-3 text-sm rounded-lg
            ${theme === 'dark' ? 'bg-red-900/50 text-red-200 border border-red-800/50' : 'bg-red-100/80 text-red-700 border border-red-200/50'}
            backdrop-filter backdrop-blur-sm
          `}>
            {error}
          </div>
        )}

        {success && (
          <div className={`
            p-3 text-sm rounded-lg
            ${theme === 'dark' ? 'bg-green-900/50 text-green-200 border border-green-800/50' : 'bg-green-100/80 text-green-700 border border-green-200/50'}
            backdrop-filter backdrop-blur-sm
          `}>
            {success}
          </div>
        )}

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className={`
              flex items-center px-6 py-2 rounded-lg transition-all duration-200
              ${theme === 'dark' 
                ? 'bg-blue-600/80 hover:bg-blue-700/80 text-white' 
                : 'bg-blue-500/80 hover:bg-blue-600/80 text-white'}
              backdrop-filter backdrop-blur-sm
              ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
            `}
          >
            <Save size={18} className="mr-2" />
            {isLoading ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </form>
    </div>
  );
}