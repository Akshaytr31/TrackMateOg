// src/components/TruncatedText.js
import React from 'react';

const TruncatedText = ({ text }) => {
  return (
    <p
    className="font-medium bg-blue-500 p-[10px] px-[20px] text-blue-50 rounded-lg 
        max-w-[150px] truncate whitespace-nowrap overflow-hidden 
        hover:max-w-[500px] hover:overflow-visible hover:whitespace-nowrap 
        transition-all duration-300 ease-in-out cursor-pointer"
    title={text}
    >
      {text}
    </p>
  );
};

export default TruncatedText