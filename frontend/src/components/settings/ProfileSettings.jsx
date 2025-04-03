import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Mail, Image, Edit, Save, X } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import FormInput from '../common/FormInput';

export default function ProfileSettings() {
  const { user, updateProfile } = useAuthStore();
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
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err.message || 'Failed to update profile');
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
    <div className="space-y-6">
      <div className="flex items-start">
        {user?.profilePic && (
          <div className="mr-4">
            <img 
              src={user.profilePic} 
              alt={user.fullName} 
              className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://via.placeholder.com/80?text=User";
              }}
            />
          </div>
        )}
        <div className="flex-1">
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</h3>
            <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">{user?.fullName || 'Not set'}</p>
          </div>
          
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</h3>
            <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">{user?.email || 'Not set'}</p>
          </div>
          
          {!user?.profilePic && (
            <div className="mb-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Profile Picture</h3>
              <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">Not set</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <button
          type="button"
          onClick={() => setIsEditing(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <Edit className="w-4 h-4 mr-2" />
          Edit Profile
        </button>
      </div>
    </div>
  );

  // Edit form mode
  const EditForm = () => (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

      {/* <FormInput
        label="Email Address"
        icon={Mail}
        id="email"
        type="email"
        error={errors.email?.message}
        {...register("email", { 
          required: "Email is required",
          pattern: {
            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
            message: "Invalid email address"
          }
        })}
      /> */}
      <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</h3>
            <p className="mt-1 text-base font-medium text-gray-900 dark:text-white">{user?.email || 'Not set'}</p>
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
        <div className="p-3 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-900 dark:text-red-200">
          {error}
        </div>
      )}

      <div className="flex justify-end space-x-3 pt-2">
        <button
          type="button"
          onClick={handleCancel}
          className="flex items-center px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4 mr-2" />
          {isLoading ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </form>
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-lg font-medium text-gray-900 dark:text-white mb-6">Profile Information</h2>
      
      {success && (
        <div className="p-3 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-900 dark:text-green-200">
          {success}
        </div>
      )}
      
      {isEditing ? <EditForm /> : <ProfileView />}
    </div>
  );
}