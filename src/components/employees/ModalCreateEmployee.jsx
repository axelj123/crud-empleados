"use client";
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { createEmployee } from '../../lib/api/employees';
import {EmployeeForm} from "../employees/EmployeeForm";
import {useEmployeeForm } from "../employees/hooks/useEmployeeForm";
import {Modal} from "../employees/Modal";

export function CreateEmployeeModal({ onClose, onEmployeeCreated }) {
  const { user } = useAuth();
  const { 
    formData, 
    positions, 
    isLoading, 
    setIsLoading,
    handleChange, 
    handleFileChange 
  } = useEmployeeForm();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const employeeFormData = new FormData();
      
      if (formData.photo) {
        employeeFormData.append('imagen', formData.photo);
      }

      const selectedPosition = positions.find(pos => pos.id === parseInt(formData.positionId));

      if (!user?.uid) {
        throw new Error("No se pudo obtener el ID del usuario");
      }

      const employeeData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        position: {
          id: parseInt(formData.positionId)
        },
        salary: parseFloat(formData.salary),
        dni: formData.dni,
        phone: formData.phone,
        uid: user.uid
      };

      employeeFormData.append('empleado', new Blob([JSON.stringify(employeeData)], {
        type: 'application/json'
      }));
      employeeFormData.append('uid', user.uid);

      const newEmployee = await createEmployee(employeeFormData);
      onEmployeeCreated({ ...newEmployee, position: selectedPosition });
      onClose();
      toast.success("¡Empleado registrado exitosamente!", {
        className: "bg-green-500 text-white"
      });
    } catch (error) {

      toast.error("Error al registrar el empleado. Haz alcanzado el limite de empleados registrados.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title="Registrar Empleado" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <EmployeeForm 
          formData={formData}
          positions={positions}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto flex items-center justify-center px-6 py-3 mt-6 bg-indigo-600 rounded-lg hover:bg-indigo-500 text-white transition-colors duration-300"
        >
          {isLoading ? (
            'Registrando...'
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Registrar empleado
            </>
          )}
        </button>
      </form>
    </Modal>
  );
}
