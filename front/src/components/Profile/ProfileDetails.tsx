import { ExtraProfile, UserProfile } from '../../interfaces/Profile';
import { FaLink, FaImage, FaInfo, FaPlus, FaTrash } from 'react-icons/fa';
import Image from 'next/image';
import Link from 'next/link';
import ProfileInfo from './ProfileInfo';

interface ProfileDetailsProps {
  profileUser: UserProfile;
  isOwnProfile: boolean;
  isEditable?: boolean;
  handleExtraProfileChange?: (index: number, field: keyof ExtraProfile, value: string | number) => void;
  handleDeleteExtraProfile?: (index: number) => void;
  addExtraProfile?: () => void;
  newContentType?: number;
  setNewContentType?: (value: number) => void;
  onDisplayNameChange?: (value: string) => void;
  onOccupationChange?: (value: string) => void;
  onIsPublicChange?: (value: boolean) => void;
}

const ProfileDetails: React.FC<ProfileDetailsProps> = ({
  profileUser,
  isOwnProfile,
  isEditable = false,
  handleExtraProfileChange,
  handleDeleteExtraProfile,
  addExtraProfile,
  newContentType,
  setNewContentType,
  onDisplayNameChange,
  onOccupationChange,
  onIsPublicChange,
}) => {
  const renderExtraProfile = (profile: ExtraProfile, index: number) => {
    const iconMap = {
      1: <FaLink className="text-indigo-600" />,
      2: <FaInfo className="text-indigo-600" />,
      3: <FaInfo className="text-indigo-600" />,
      4: <FaImage className="text-indigo-600" />,
    };

    return (
      <div
        key={profile.id}
        className="flex items-center space-x-3 p-4 bg-white rounded-lg shadow-sm border border-gray-300"
      >
        {iconMap[profile.contentTypeId as keyof typeof iconMap]}
        <div className="flex-grow">
          {isEditable ? (
            <>
              <input
                type="text"
                value={profile.title}
                onChange={(e) => handleExtraProfileChange?.(index, 'title', e.target.value)}
                className="text-lg font-semibold text-gray-800 w-full bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 px-2 py-1 mb-2"
                placeholder="Title"
              />
              <input
                type="text"
                value={profile.content}
                onChange={(e) => handleExtraProfileChange?.(index, 'content', e.target.value)}
                className="text-gray-600 w-full bg-transparent border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 px-2 py-1"
                placeholder="Content"
              />
            </>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-gray-800">{profile.title}</h3>
              {profile.contentTypeId === 1 ? (
                <a href={profile.content} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                  {profile.content}
                </a>
              ) : profile.contentTypeId === 4 ? (
                <Image src={profile.content} alt={profile.title} width={300} height={200} className="rounded-md" objectFit="cover" />
              ) : (
                <p className="text-gray-600">{profile.content}</p>
              )}
            </>
          )}
        </div>
        {isEditable && (
          <button
            type="button"
            onClick={() => handleDeleteExtraProfile?.(index)}
            className="text-red-500 hover:text-red-700"
          >
            <FaTrash />
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="px-6 py-8">
      <ProfileInfo
        displayName={profileUser.displayName}
        occupation={profileUser.occupation || undefined}
        isEditable={isEditable}
        onDisplayNameChange={onDisplayNameChange}
        onOccupationChange={onOccupationChange}
      />

      {isEditable && (
        <div className="flex items-center space-x-2 mt-4">
          <label htmlFor="isPublic" className="text-gray-800 font-semibold">
            Public Profile:
          </label>
          <input
            type="checkbox"
            id="isPublic"
            checked={Boolean(profileUser.isPublic)}
            onChange={(e) => onIsPublicChange?.(e.target.checked)}
            className="form-checkbox h-5 w-5 text-indigo-600 transition duration-150 ease-in-out"
          />
        </div>
      )}

      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-6 text-gray-800">Profiles</h2>
        <div className="space-y-4">
          {profileUser.extraProfiles && profileUser.extraProfiles.length > 0 ? (
            profileUser.extraProfiles.map((profile, index) => (
              <div key={profile.id || index}>
                {renderExtraProfile(profile, index)}
              </div>
            ))
          ) : (
            <p className="text-gray-500 italic">No profiles to display</p>
          )}
        </div>
        {isEditable && (
          <div className="mt-4 flex items-center space-x-2">
            <select
              value={newContentType}
              onChange={(e) => setNewContentType?.(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={1}>URL</option>
              <option value={2}>Text Field</option>
              <option value={3}>Short Text</option>
              <option value={4}>Image</option>
            </select>
            <button
              type="button"
              onClick={addExtraProfile}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition duration-300 flex items-center"
            >
              <FaPlus className="mr-2" /> Add Extra Profile
            </button>
          </div>
        )}
      </div>

      {isOwnProfile && !isEditable && (
        <div className="mt-12 flex justify-center">
          <Link href={`/profile/${profileUser.memberNumber}/edit`}>
            <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-6 rounded-md transition duration-300 ease-in-out">
              Edit Profile
            </button>
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProfileDetails;
