import React from 'react';
import image from '../../public/assets/split-img.jpg';

const AuthImagePattern = ({ title, subtitle }) => {
  return (
    <div className="relative">
      <div className="absolute top-8 left-8 p-4 text-black">
        <h1 className="text-3xl mb-4">{title}</h1>
        <h3 className="text-xl">{subtitle}</h3>
      </div>
      <img src={image} alt="Split Img" className="w-full h-auto" />
    </div>
  );
};

export default AuthImagePattern;
