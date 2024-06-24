import Image from 'next/image';

const Logo = () => (
  <div className="flex items-center space-x-2">
    {/* <Image src="/images/logo.svg" alt="Logo" width={32} height={32} /> */}
    <span className="text-2xl font-bold text-gray-800">DegiTip</span>
  </div>
);

export default Logo;
