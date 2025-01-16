import React from 'react';
import { InputField, SelectField, FileUpload } from './FormFields';

export const EmployeeForm = ({ 
  formData, 
  positions, 
  handleChange, 
  handleFileChange, 
  currentImage = null 
}) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-center mb-8">
        <FileUpload
          currentImage={currentImage}
          onChange={handleFileChange}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <InputField 
          label="Nombre" 
          name="firstName" 
          value={formData.firstName} 
          onChange={handleChange} 
          placeholder="Ingrese nombre" 
          required 
   
          
        />
        <InputField 
          label="Apellido" 
          name="lastName" 
          value={formData.lastName} 
          onChange={handleChange} 
          placeholder="Ingrese apellido" 
          required 
        />
        <InputField 
          label="Email" 
          name="email" 
          value={formData.email} 
          onChange={handleChange} 
          placeholder="correo@ejemplo.com" 
          type="email" 
          required 
        />
        <InputField 
          label="DNI" 
          type="number" 
          name="dni"
          value={formData.dni} 
          onChange={handleChange} 
          placeholder="Ingrese DNI" 
          required 
          maxLength={8}
        />
        <InputField 
          label="Teléfono" 
          name="phone" 
          value={formData.phone} 
          onChange={handleChange} 
          placeholder="Ingrese teléfono" 
          type="number" 
          required 
          minLength={9}
          maxLength={9}
        />
        <SelectField 
          label="Cargo" 
          name="positionId" 
          value={formData.positionId} 
          onChange={handleChange} 
          required
          options={positions.map(position => ({
            value: position.id.toString(),
            label: position.name,
          }))}
        />
        <InputField 
          label="Salario" 
          name="salary" 
          value={formData.salary} 
          onChange={handleChange} 
          placeholder="Ingrese salario" 
          type="number" 
          required 
        />
      </div>
    </div>
  );
};