
const Spinner = ({ size = 'md', color = 'green', className = '' }) => {
    const sizeClasses = {
        sm: 'h-4 w-4 border-2',
        md: 'h-8 w-8 border-3',
        lg: 'h-12 w-12 border-4',
        xl: 'h-16 w-16 border-4'
    };

    const colorClasses = {
        blue: 'border-gray-800 border-t-blue-500',
        gray: 'border-gray-800 border-t-gray-300',
        green: 'border-gray-800 border-t-green-500',
        red: 'border-gray-800 border-t-red-500',
        white: 'border-gray-700 border-t-white',
        slate: 'border-gray-800 border-t-slate-300'
    };

    return (
        <div className={`animate-spin rounded-full ${colorClasses[color]} ${sizeClasses[size]} ${className}`}></div>
    );
};

export default Spinner;
