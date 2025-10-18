import React from 'react';

const Spinner = ({ size = 'md', color = 'blue', className = '' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-8 w-8',
        lg: 'h-12 w-12',
        xl: 'h-16 w-16'
    };

    const colorClasses = {
        blue: 'border-blue-500',
        purple: 'border-purple-500',
        green: 'border-green-500',
        red: 'border-red-500',
        white: 'border-white',
        slate: 'border-slate-400'
    };

    return (
        <div className={`animate-spin rounded-full border-2 border-gray-300 border-t-transparent ${sizeClasses[size]} ${colorClasses[color]} ${className}`}></div>
    );
};

export default Spinner;
