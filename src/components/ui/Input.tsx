interface InputProps {
  type?: 'text' | 'email' | 'password' | 'number' | 'tel' | 'url' | 'date'
  label?: string
  name?: string
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  className?: string
  error?: string
  disabled?: boolean
  min?: string
  max?: string
  step?: string
}

export default function Input({
  type = 'text',
  label,
  name,
  placeholder,
  value,
  onChange,
  required = false,
  className = '',
  error,
  disabled = false,
  min,
  max,
  step
}: InputProps) {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        disabled={disabled}
        min={min}
        max={max}
        step={step}
        className={`w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
          error ? 'border-red-500' : 'border-gray-300'
        } ${disabled ? 'bg-gray-100 cursor-not-allowed' : ''}`}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
}