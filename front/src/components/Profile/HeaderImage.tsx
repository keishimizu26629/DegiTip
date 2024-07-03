import Image from 'next/image';
import { RefObject, ChangeEvent } from 'react';

interface HeaderImageProps {
  src: string | null;
  onClick?: () => void;
  inputRef?: RefObject<HTMLInputElement>;
  onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
}

const HeaderImage: React.FC<HeaderImageProps> = ({ src, onClick, inputRef, onChange }) => (
  <div className="relative w-full h-64">
    {onClick && (
      <div
        className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10 cursor-pointer"
        onClick={onClick}
      >
        <svg
          className="h-12 w-12 text-white"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
          />
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
          />
        </svg>
      </div>
    )}
    {src ? (
      <Image
        src={src}
        alt="Header"
        layout="fill"
        objectFit="cover"
      />
    ) : (
      <div className="w-full h-full bg-indigo-100"></div>
    )}
    {inputRef && onChange && (
      <input
        type="file"
        ref={inputRef}
        onChange={onChange}
        className="hidden"
        accept="image/*"
      />
    )}
  </div>
);

export default HeaderImage;
