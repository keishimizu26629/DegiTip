import React from 'react';

interface ProfileInfoProps {
  displayName: string;
  occupation: string | undefined;
  isEditable: boolean;
  onDisplayNameChange?: (value: string) => void;
  onOccupationChange?: (value: string) => void;
}

const ProfileInfo: React.FC<ProfileInfoProps> = ({
  displayName,
  occupation,
  isEditable,
  onDisplayNameChange,
  onOccupationChange,
}) => {
  if (isEditable) {
    return (
      <div>
        <input
          type="text"
          value={displayName}
          onChange={(e) => onDisplayNameChange?.(e.target.value)}
          className="text-3xl font-bold text-center text-gray-800 mb-2 w-full bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 px-2 py-1"
          placeholder="Display Name"
        />
        <input
          type="text"
          value={occupation || ''}
          onChange={(e) => onOccupationChange?.(e.target.value)}
          className="text-center text-gray-600 text-xl mb-6 w-full bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 px-2 py-1"
          placeholder="Occupation"
        />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">{displayName}</h1>
      {occupation && (
        <p className="text-center text-gray-600 text-xl mb-6">{occupation}</p>
      )}
    </div>
  );
};

export default ProfileInfo;
