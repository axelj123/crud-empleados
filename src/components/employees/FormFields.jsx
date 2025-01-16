import React, { useRef, useState } from 'react';

export function InputField({
    label,
    name,
    value,
    onChange,
    placeholder,
    required,
    type = 'text',
    keydown,
    minLength,
    maxLength,
    min,
    max,
  }) {
    const handleKeyDown = (event) => {
        if (keydown) {
          keydown(event);
        }
  
        if (event.key === "Enter") {
          event.preventDefault();
        }
  
        if (type === 'number') {
          const allowedKeys = ['Backspace', 'ArrowLeft', 'ArrowRight', 'Tab', 'Delete'];
  
          if (!/^\d$/.test(event.key) && !allowedKeys.includes(event.key)) {
            event.preventDefault();
          }
        }
  
        if (type === 'text' || type === 'textarea') {
          if (maxLength && value.length >= maxLength && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight'].includes(event.key)) {
            event.preventDefault();
          }
        }
      };
  
    return (
      <div>
        <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
          {label}
        </label>
        <input
          type={type}
          name={name}
          id={name}
          className="bg-transparent border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          onKeyDown={handleKeyDown}
          minLength={minLength}
          maxLength={maxLength}
          min={min}
          max={max}
        />
      </div>
    );
  }
  

export function SelectField({ label, name, value, onChange, required, options }) {
    
    return (
        <div>
            <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                {label}
            </label>
            <select
                id={name}
                name={name}
                className="bg-white dark:bg-black border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500"
                value={value}
                onChange={onChange}
                required={required}
            >
                <option value="">Seleccione {label.toLowerCase()}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
}

export function FileUpload({ onChange, currentImage }) {
    const [isDragging, setIsDragging] = useState(false);
    const [previewImage, setPreviewImage] = useState(currentImage);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {

            const reader = new FileReader();
            reader.onload = () => {
                setPreviewImage(reader.result); 
            };
            reader.readAsDataURL(file);

            onChange(e);
        }
    };

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const handleDragIn = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDragOut = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const file = files[0];
            if (file.type === "image/png" || file.type === "image/jpeg") {
                const reader = new FileReader();
                reader.onload = () => {
                    setPreviewImage(reader.result);
                };
                reader.readAsDataURL(file);

                const event = {
                    target: {
                        files: [file],
                    },
                };
                onChange(event);
            }
        }
    };

    return (
        <div className="relative w-32 h-32 mx-auto">
            <div
                className={`relative group w-full h-full rounded-full overflow-hidden ${
                    isDragging ? 'ring-2 ring-indigo-600' : ''
                }`}
                onDragEnter={handleDragIn}
                onDragLeave={handleDragOut}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                {previewImage ? (
                    <img
                        src={previewImage}
                        alt="Empleado"
                        className="w-full h-full object-cover border-4 border-white shadow-lg"
                    />
                ) : (
                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                        <svg
                            className="w-16 h-16 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                        >
                            <path
                                fillRule="evenodd"
                                d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                                clipRule="evenodd"
                            />
                        </svg>
                    </div>
                )}

                {/* Overlay al hacer hover */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col items-center justify-center">
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-white text-gray-800 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors duration-200"
                    >
                        Cambiar foto
                    </button>
                    <p className="text-white text-xs mt-2">PNG o JPG, max 10MB</p>
                </div>
            </div>

            <input
                ref={fileInputRef}
                type="file"
                accept="image/png, image/jpeg"
                hidden
                onChange={handleFileChange}
            />
        </div>
    );
}