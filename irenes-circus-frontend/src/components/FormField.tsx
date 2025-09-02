import React from 'react';
import { UseFormRegister, FieldError, FieldValues, Path } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertCircle } from 'lucide-react';

interface BaseFieldProps<T extends FieldValues> {
  name: Path<T>;
  label: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  disabled?: boolean;
  required?: boolean;
  icon?: React.ReactNode;
  helpText?: string;
  className?: string;
}

interface InputFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  type?: 'text' | 'email' | 'password' | 'url' | 'tel' | 'number' | 'date' | 'datetime-local';
  placeholder?: string;
}

interface TextareaFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  placeholder?: string;
  rows?: number;
}

interface SelectFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  options: { value: string; label: string }[];
  placeholder?: string;
}

interface CheckboxFieldProps<T extends FieldValues> extends BaseFieldProps<T> {
  description?: string;
}

// Input Field Component
export function InputField<T extends FieldValues>({
  name,
  label,
  register,
  error,
  disabled = false,
  required = false,
  icon,
  helpText,
  className = "",
  type = "text",
  placeholder,
}: InputFieldProps<T>) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name} className="flex items-center gap-2 text-sm font-medium">
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      
      <div className="relative">
        <Input
          id={name}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className={`${error ? 'border-red-500 focus:border-red-500' : ''}`}
          {...register(name)}
        />
        {error && (
          <AlertCircle size={16} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500" />
        )}
      </div>
      
      {helpText && !error && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
      
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={12} />
          {error.message}
        </p>
      )}
    </div>
  );
}

// Textarea Field Component
export function TextareaField<T extends FieldValues>({
  name,
  label,
  register,
  error,
  disabled = false,
  required = false,
  icon,
  helpText,
  className = "",
  placeholder,
  rows = 4,
}: TextareaFieldProps<T>) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name} className="flex items-center gap-2 text-sm font-medium">
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      
      <Textarea
        id={name}
        placeholder={placeholder}
        disabled={disabled}
        rows={rows}
        className={`${error ? 'border-red-500 focus:border-red-500' : ''}`}
        {...register(name)}
      />
      
      {helpText && !error && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
      
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={12} />
          {error.message}
        </p>
      )}
    </div>
  );
}

// Select Field Component
export function SelectField<T extends FieldValues>({
  name,
  label,
  register,
  error,
  disabled = false,
  required = false,
  icon,
  helpText,
  className = "",
  options,
  placeholder = "Select an option...",
}: SelectFieldProps<T>) {
  return (
    <div className={`space-y-2 ${className}`}>
      <Label htmlFor={name} className="flex items-center gap-2 text-sm font-medium">
        {icon}
        {label}
        {required && <span className="text-red-500">*</span>}
      </Label>
      
      <select
        id={name}
        disabled={disabled}
        className={`
          flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background 
          file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground 
          focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
          disabled:cursor-not-allowed disabled:opacity-50
          ${error ? 'border-red-500 focus:border-red-500' : ''}
        `}
        {...register(name)}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      
      {helpText && !error && (
        <p className="text-xs text-gray-500">{helpText}</p>
      )}
      
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1">
          <AlertCircle size={12} />
          {error.message}
        </p>
      )}
    </div>
  );
}

// Checkbox Field Component
export function CheckboxField<T extends FieldValues>({
  name,
  label,
  register,
  error,
  disabled = false,
  required = false,
  description,
  className = "",
}: CheckboxFieldProps<T>) {
  return (
    <div className={`space-y-2 ${className}`}>
      <div className="flex items-start space-x-3">
        <input
          id={name}
          type="checkbox"
          disabled={disabled}
          className={`
            mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500
            ${error ? 'border-red-500' : ''}
          `}
          {...register(name)}
        />
        <div className="flex-1">
          <Label htmlFor={name} className="text-sm font-medium">
            {label}
            {required && <span className="text-red-500 ml-1">*</span>}
          </Label>
          {description && (
            <p className="text-xs text-gray-500 mt-1">{description}</p>
          )}
        </div>
      </div>
      
      {error && (
        <p className="text-xs text-red-500 flex items-center gap-1 ml-7">
          <AlertCircle size={12} />
          {error.message}
        </p>
      )}
    </div>
  );
}

// Form Section Component for grouping fields
export function FormSection({ 
  title, 
  description, 
  children, 
  className = "" 
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-500 mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

// Form Actions Component
export function FormActions({
  isSubmitting,
  submitLabel = "Save",
  onCancel,
  cancelLabel = "Cancel",
  className = "",
}: {
  isSubmitting: boolean;
  submitLabel?: string;
  onCancel?: () => void;
  cancelLabel?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-end gap-4 pt-6 border-t border-gray-200 ${className}`}>
      {onCancel && (
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          {cancelLabel}
        </Button>
      )}
      <Button
        type="submit"
        disabled={isSubmitting}
        className="min-w-[100px]"
      >
        {isSubmitting ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            Saving...
          </div>
        ) : (
          submitLabel
        )}
      </Button>
    </div>
  );
}
