export default function Input({ label, error, icon: Icon, type = 'text', className = '', ...props }) {
  const id = props.id || props.name || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label htmlFor={id} className="block text-sm font-medium text-gray-700">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />}
        <input id={id} type={type} className={`input-field ${Icon ? 'pl-12' : ''} ${error ? 'border-red-300' : ''}`} {...props} />
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
