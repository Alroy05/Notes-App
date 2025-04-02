import { useAuthStore } from '../../store/authStore';
import { useForm } from 'react-hook-form';
import { User, Mail, Image, Save } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import FormInput from '../common/FormInput';

export default function ProfileSettings() {
  const { user, updateProfile, isLoading: storeLoading } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      fullName: '',
      email: '',
      profilePic: ''
    }
  });

  // Update form when user data loads
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
    try {
      await updateProfile(data);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Profile update error:', error);
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
      <h2 className="text-xl font-medium text-gray-900 dark:text-white mb-6">Profile Information</h2>
      
      {user ? (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-1">
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
            </div>
            
            <div className="sm:w-1/3 flex justify-center">
              <div className="relative group">
                <img 
                  src={user.profilePic || 'https://via.placeholder.com/150'} 
                  alt="Profile"
                  className="rounded-full w-32 h-32 object-cover border-4 border-gray-100 dark:border-gray-700 shadow-md"
                />
              </div>
            </div>
          </div>

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-900/30 dark:text-green-200"
            >
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
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>Save Changes</span>
                </>
              )}
            </button>
          </motion.div>
        </form>
      ) : (
        <div className="flex justify-center p-8">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      )}
    </motion.div>
  );
}