import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ children, className = '' }) => (
  <div className={`max-w-4xl mx-auto pb-8 mt-8 mb-8 bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
    {children}
  </div>
);

export default Card;
