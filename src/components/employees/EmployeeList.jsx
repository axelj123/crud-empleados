'use client';
import { useState, useEffect } from "react";
import { deleteEmployee, getEmployeesByUid } from "../../lib/api/employees";
import { CreateEmployeeModal } from "./ModalCreateEmployee";
import { ModalDeleteEmployee } from "./ModalDeleteEmployee";
import {UpdateEmployeeModal } from "./ModalEditEmployee";
import { toast } from "sonner";
import { useAuth } from "../../context/AuthContext";
import TableComponent from "./EmployeeTable"

export default function EmployeeList() {
    const { user } = useAuth();
    const [tableItems, setTableItems] = useState([]);
    const [modalState, setModalState] = useState({
        isCreate: false,
        isDelete: false,
        isUpdate: false,
        employeeToUpdate: null,
        employeeToDelete: null
    });

    const [isLoading, setIsLoading] = useState(true);

    const fetchEmployees = async (uid) => {
        setIsLoading(true);
        try {
            if (uid) {
                const employees = await getEmployeesByUid(uid);
                if (Array.isArray(employees)) {
                    const employeesWithHandlers = employees.map(emp => ({
                        ...emp,
                        onEdit: () => openModal("isUpdate", emp),
                        onDelete: () => openModal("isDelete", emp)
                    }));
                    setTableItems(employeesWithHandlers);
                } else {
                    setTableItems([]);
                }
            }
        } catch (error) {

            toast.error('Error al obtener los empleados. El servidor no está disponible.');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchEmployees(user.uid);
        }
    }, [user]);

    const openModal = (type, employee = null) => {
        setModalState(prev => ({
            ...prev,
            [type]: true,
            employeeToUpdate: type === "isUpdate" ? employee : prev.employeeToUpdate,
            employeeToDelete: type === "isDelete" ? employee : prev.employeeToDelete
        }));
    };

    const closeModal = (type) => {
        setModalState(prev => ({ ...prev, [type]: false }));
    };

    const handleDeleteEmployee = async () => {
        if (modalState.employeeToDelete) {
            try {
                await deleteEmployee(modalState.employeeToDelete.id);
                setTableItems(prevItems => prevItems.filter(item => item.id !== modalState.employeeToDelete.id));
                closeModal("isDelete");
                toast.success('Empleado eliminado correctamente');
            } catch (error) {

                toast.error('Error al eliminar el empleado');
            }
        }
    };

    const handleEmployeeCreated = (newEmployee) => {
        if (newEmployee && newEmployee.position?.name) {
            const employeeWithHandlers = {
                ...newEmployee,
                onEdit: () => openModal("isUpdate", newEmployee),
                onDelete: () => openModal("isDelete", newEmployee)
            };
            setTableItems(prevItems => [...prevItems, employeeWithHandlers]);
        } else {
            fetchEmployees(user.uid);
        }
    };

    const handleEmployeeUpdated = (updatedEmployee) => {
        if (updatedEmployee && updatedEmployee.position?.name) {
            const employeeWithHandlers = {
                ...updatedEmployee,
                onEdit: () => openModal("isUpdate", updatedEmployee),
                onDelete: () => openModal("isDelete", updatedEmployee)
            };
            setTableItems(prevItems => prevItems.map(item =>
                item.id === updatedEmployee.id ? employeeWithHandlers : item
            ));
        } else {
            fetchEmployees(user.uid);
        }
    };

    return (
        <div className="max-w-screen-xl mx-auto px-4 md:px-8">
            <div className="items-start justify-between md:flex">
                <div className="max-w-lg">
                    <h3 className="text-gray-800 dark:text-white text-xl font-bold sm:text-2xl">
                        Empleados
                    </h3>
                    <p className="text-gray-600 dark:text-white mt-2">
                        Gestión de empleados
                    </p>
                </div>

                <div className="mt-3 md:mt-0">
                    <button 
                        onClick={() => openModal("isCreate")} 
                        className="inline-block px-4 py-2 text-white bg-indigo-600 rounded-lg hover:bg-indigo-500"
                    >
                        Añadir empleado
                    </button>
                </div>
            </div>

            <div className="mt-12">
                {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                        <span className="mx-4">Cargando...</span>
                    </div>
                ) : (
                    <TableComponent data={tableItems} />
                )}
            </div>

            {modalState.isUpdate && (
                <UpdateEmployeeModal 
                    onClose={() => closeModal("isUpdate")} 
                    onEmployeeUpdated={handleEmployeeUpdated} 
                    employee={modalState.employeeToUpdate} 
                />
            )}
            {modalState.isCreate && (
                <CreateEmployeeModal 
                    onClose={() => closeModal("isCreate")} 
                    onEmployeeCreated={handleEmployeeCreated} 
                />
            )}
            {modalState.isDelete && (
                <ModalDeleteEmployee 
                    onClose={() => closeModal("isDelete")} 
                    onConfirmDelete={handleDeleteEmployee} 
                />
            )}
        </div>
    );
}