import { motion } from 'framer-motion';

export default function Button({ children, variant = 'primary', size = 'md', icon: Icon, iconPosition = 'left', loading = false, disabled = false, className = '', ...props }) {
  const variants = {
    primary: 'btn-primary',
    secondary: 'btn-secondary',
    ghost: 'hover:bg-gray-100 text-gray-700 font-medium py-3 px-6 rounded-xl transition-all duration-200',
    danger: 'bg-red-500 hover:bg-red-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg'
  };
  const sizes = { sm: 'py-2 px-4 text-sm', md: 'py-3 px-6 text-base', lg: 'py-4 px-8 text-lg' };
  const iconSizes = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      className={`inline-flex items-center justify-center gap-2 ${variants[variant]} ${sizes[size]} ${disabled || loading ? 'opacity-60 cursor-not-allowed' : ''} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <svg className={`animate-spin ${iconSizes[size]}`} viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.196A8 8 0 0112 4V0C3.373 0 0 5.373 0 12h4zm2 5.196a8 8 0 010 0V0C5.373 0 0 5.373 0 12h4zm2 5.196a8 8 0 010 0V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : Icon && iconPosition === 'left' ? <Icon className={iconSizes[size]} /> : null}
      <span>{children}</span>
      {!loading && Icon && iconPosition === 'right' && <Icon className={iconSizes[size]} />}
    </motion.button>
  );
}
