import React, { forwardRef } from 'react';
import { FaExclamationCircle } from 'react-icons/fa';

const Input = forwardRef(({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  onBlur,
  error,
  touched,
  required = false,
  disabled = false,
  className = '',
  containerClassName = '',
  labelClassName = '',
  icon,
  iconPosition = 'left',
  ...props
}, ref) => {
  const baseStyles = 'w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-all duration-200';
  
  const stateStyles = error && touched
    ? 'border-red-500 focus:ring-red-500 focus:border-transparent'
    : 'border-gray-300 focus:ring-primary-500 focus:border-transparent hover:border-gray-400';

  const disabledStyles = disabled ? 'bg-gray-100 cursor-not-allowed opacity-60' : 'bg-white';

  const iconStyles = icon
    ? iconPosition === 'left'
      ? 'pl-12'
      : 'pr-12'
    : '';

  const combinedClassName = `
    ${baseStyles}
    ${stateStyles}
    ${disabledStyles}
    ${iconStyles}
    ${className}
  `;

  return (
    <div className={`w-full ${containerClassName}`}>
      {label && (
        <label htmlFor={name} className={`block text-sm font-medium text-gray-700 mb-1 ${labelClassName}`}>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      
      <div className="relative">
        {icon && iconPosition === 'left' && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        <input
          ref={ref}
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          disabled={disabled}
          className={combinedClassName}
          {...props}
        />
        
        {icon && iconPosition === 'right' && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        {error && touched && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
            <FaExclamationCircle />
          </div>
        )}
      </div>
      
      {error && touched && (
        <p className="mt-1 text-sm text-red-500 animate-fade-in">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;