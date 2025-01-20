"use client";
import { toast } from 'sonner';
import { useAuth } from '../../context/AuthContext';
import { updateEmployee } from '../../lib/api/employees';
import { EmployeeForm } from './EmployeeForm';
import { useEmployeeForm } from './hooks/useEmployeeForm';
import { Modal } from './Modal';

export function UpdateEmployeeModal({ onClose, employee, onEmployeeUpdated }) {
  const { user } = useAuth();
  const { 
    formData, 
    positions, 
    isLoading, 
    setIsLoading,
    handleChange, 
    handleFileChange 
  } = useEmployeeForm(employee);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const employeeFormData = new FormData();
      
      if (formData.photo) {
        employeeFormData.append('imagen', formData.photo);
      }

      const selectedPosition = positions.find(pos => pos.id === parseInt(formData.positionId));
      if (!selectedPosition) {
        throw new Error('Posición no válida');
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
        uid: employee.uid || user.uid,
        user: employee.user
      };

      employeeFormData.append('empleado', new Blob([JSON.stringify(employeeData)], {
        type: 'application/json'
      }));
      employeeFormData.append('uid', employee.uid || user.uid);

      const updatedEmployee = await updateEmployee(employee.id, employeeFormData);
      onEmployeeUpdated({ ...updatedEmployee, position: selectedPosition });
      onClose();
      toast.success("¡Empleado actualizado exitosamente!", {
        className: "bg-green-500 text-white"
      });
    } catch (error) {

      toast.error("Error al actualizar el empleado. Por favor, intente nuevamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal title="Actualizar Empleado" onClose={onClose}>
      <form onSubmit={handleSubmit}>
        <EmployeeForm
          formData={formData}
          positions={positions}
          handleChange={handleChange}
          handleFileChange={handleFileChange}
          currentImage={employee.photo }
        />
        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto flex items-center justify-center px-6 py-3 mt-6 bg-indigo-600  hover:bg-indigo-500 text-white rounded-lg transition-colors duration-300"
        >
          {isLoading ? (
            'Actualizando...'
          ) : (
            <>
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
              </svg>
              Actualizar empleado
            </>
          )}
        </button>
      </form>
    </Modal>
  );
}