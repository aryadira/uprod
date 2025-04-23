import React from 'react';
import { LoaderIcon } from 'react-hot-toast';

const Loader = ({ text = 'Loading...', className = '' }) => {
  return (
    <div className={`flex items-center my-4 text-sm text-gray-600 gap-3 ${className}`}>
      <LoaderIcon />
      <span className='text-slate-500'>{text}</span>
    </div>
  );
};

export default Loader;
