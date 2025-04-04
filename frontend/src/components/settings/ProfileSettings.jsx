import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { User, Mail, Image, Edit, Save, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useThemeStore } from '../../store/themeStore';
import FormInput from '../common/FormInput';
import { toast } from 'react-hot-toast';

export default function ProfileSettings() {
  const { user, updateProfile } = useAuthStore();
  const { theme } = useThemeStore();
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  // Initialize form with user data when entering edit mode
  useEffect(() => {
    if (user && isEditing) {
      reset({
        fullName: user.fullName || '',
        email: user.email || '',
        profilePic: user.profilePic || ''
      });
    }
  }, [user, reset, isEditing]);

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError('');
    try {
      await updateProfile(data);
      setSuccess('Profile updated successfully!');
      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
      toast.error(err.message || 'Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setError('');
  };

  // Profile view mode
  const ProfileView = () => (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-start">
        {user?.profilePic && (
          <div className="mr-4">
            <img 
              src={user.profilePic} 
              alt={user.fullName} 
              className={`
                w-20 h-20 rounded-full object-cover border-2 shadow-md
                ${theme === 'dark' ? 'border-gray-700/70' : 'border-gray-200/70'}
              `}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/80?text=User";
              }}
            />
          </div>
        )}
        <div className="flex-1">
          <div className="mb-4">
            <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Full Name
            </h3>
            <p className={`mt-1 text-base font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {user?.fullName || 'Not set'}
            </p>
          </div>
          
          <div className="mb-4">
            <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
              Email Address
            </h3>
            <p className={`mt-1 text-base font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
              {user?.email || 'Not set'}
            </p>
          </div>
          
          {!user?.profilePic && (
            <div className="mb-4">
              <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                Profile Picture
              </h3>
              <p className={`mt-1 text-base font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                Not set
              </p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className={`
            flex items-center px-4 py-2 rounded-lg transition-all duration-200
            ${theme === 'dark' 
              ? 'bg-blue-600/80 hover:bg-blue-700/80 text-white' 
              : 'bg-blue-500/80 hover:bg-blue-600/80 text-white'}
            backdrop-filter backdrop-blur-sm
          `}
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </button>
      </div>
    </motion.div>
  );

  // Edit form mode
  const EditForm = () => (
    <motion.form 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(onSubmit)} 
      className="space-y-4"
    >
      <FormInput
        label="Full Name"
        icon={User}
        id="fullName"
        type="text"
        error={errors.fullName?.message}
        {...register("fullName", { 
          required: "Full name is required" 
        })}
      />

      <div className={`mb-4 p-3 rounded-lg ${theme === 'dark' ? 'bg-gray-900/50 border border-gray-700/50' : 'bg-gray-100/50 border border-gray-200/50'}`}>
        <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
          Email Address
        </h3>
        <p className={`mt-1 text-base font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          {user?.email || 'Not set'}
        </p>
      </div>

      <FormInput
        label="Profile Picture URL"
        icon={Image}
        id="profilePic"
        type="url"
        error={errors.profilePic?.message}
        {...register("profilePic")}
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

      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={handleCancel}
          className={`
            flex items-center px-4 py-2 rounded-lg transition-all duration-200
            ${theme === 'dark' 
              ? 'bg-gray-800/70 hover:bg-gray-700/70 text-gray-300 border border-gray-700/50' 
              : 'bg-gray-200/70 hover:bg-gray-300/70 text-gray-800 border border-gray-200/50'}
            backdrop-filter backdrop-blur-sm
          `}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className={`
            flex items-center px-4 py-2 rounded-lg transition-all duration-200
            ${theme === 'dark' 
              ? 'bg-blue-600/80 hover:bg-blue-700/80 text-white' 
              : 'bg-blue-500/80 hover:bg-blue-600/80 text-white'}
            backdrop-filter backdrop-blur-sm
            ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
          `}
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </motion.form>
  );

  return (
    <div className={`
      rounded-xl backdrop-filter backdrop-blur-md shadow-lg p-6
      ${theme === 'dark' 
        ? 'bg-gray-800/70 border border-gray-700/50 text-white' 
        : 'bg-white/70 border border-gray-200/50 text-gray-800'}
    `}>
      <h2 className={`text-lg font-medium mb-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
        Profile Information
      </h2>
      
      {success && (
        <div className={`
          p-3 mb-4 text-sm rounded-lg
          ${theme === 'dark' ? 'bg-green-900/50 text-green-200 border border-green-800/50' : 'bg-green-100/80 text-green-700 border border-green-200/50'}
          backdrop-filter backdrop-blur-sm
        `}>
          {success}
        </div>
      )}
      
      {isEditing ? <EditForm /> : <ProfileView />}
    </div>
  );
}