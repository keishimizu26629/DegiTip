import React from 'react';
import { UserSettings } from '../../interfaces/User';
import { FaPencilAlt } from 'react-icons/fa';

interface UserSettingsFormProps {
  userSettings: UserSettings;
  editingUserSettings: boolean;
  onInputChange: (name: string, value: string) => void;
  onSaveUserSettings: () => void;
  setEditingUserSettings: (editing: boolean) => void;
}

const UserSettingsForm: React.FC<UserSettingsFormProps> = ({
  userSettings,
  editingUserSettings,
  onInputChange,
  onSaveUserSettings,
  setEditingUserSettings,
}) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">User Settings</h2>
        <button
          onClick={() => setEditingUserSettings(!editingUserSettings)}
          className="text-indigo-600 hover:text-indigo-800"
        >
          <FaPencilAlt />
        </button>
      </div>
      <div className="space-y-4">
        {['name', 'email', 'memberNumber'].map((field) => (
          <div key={field}>
            <label className="block text-sm font-medium text-gray-700">
              {field.charAt(0).toUpperCase() + field.slice(1)}
            </label>
            {editingUserSettings ? (
              <input
                type="text"
                value={userSettings[field as keyof UserSettings] as string}
                onChange={(e) => onInputChange(field, e.target.value)}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            ) : (
              <div className="mt-1 block w-full rounded-md border-gray-300 bg-gray-100 p-2">
                {userSettings[field as keyof UserSettings] as string}
              </div>
            )}
          </div>
        ))}
      </div>
      {editingUserSettings && (
        <button
          onClick={onSaveUserSettings}
          className="mt-4 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save Changes
        </button>
      )}
    </div>
  );
};

export default UserSettingsForm;
