
const API_URL = `${process.env.NEXT_PUBLIC_URL}/api/empleados`;
const API_URL_USER = `${process.env.NEXT_PUBLIC_URL}/api/empleados/user/`;

export interface Position {
    id: number;
    name: string;
}

export interface EmployeeData {
    id: number;
    firstName: string;  
    lastName: string;
    email: string;
    phone: string;
    position: Position; 
    salary: number;
    photo: string;
    dni: string;
    uid: string;
}
 
export const getEmployeesByUid = async (uid: string): Promise<EmployeeData[]> => {
    try {
        const response = await fetch(`${API_URL_USER}${uid}`);
        
        if (!response.ok) {
            if (response.status === 404) {
                return [];  
            }
            throw new Error(`Error al obtener empleados para el UID: ${uid}`);
        }

        const data = await response.json();  
        


        return data;
    } catch (error) {

        throw error;
    }
};

export const createEmployee = async (employeeFormData: FormData): Promise<EmployeeData> => {
    try {
        const response = await fetch(API_URL, {
            method: "POST",
            body: employeeFormData,
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al crear el empleado , haz alcanzado el limite de empleados registrados: ${errorText}`);
        }

        const data: EmployeeData = await response.json();
        return data;
    } catch (error) {

        throw error;
    }
};

export const getEmployees = async (): Promise<EmployeeData[]> => {
    try {
        const response = await fetch(API_URL);
        if (!response.ok) {
            throw new Error("Error al obtener los empleados");

        }
        const data: EmployeeData[] = await response.json(); 
        return data;
    } catch (error) {

        throw error;
    }
};
export const updateEmployee = async (id: number, employeeFormData: FormData): Promise<EmployeeData> => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "PUT",
            body: employeeFormData, 
        });
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Error al actualizar el empleado: ${errorText}`);
        }
        
        const data: EmployeeData = await response.json();
        return data;
    } catch (error) {

        throw error;
    }
};



export const getEmployeeById = async (id: number): Promise<EmployeeData> => {
    try {
        const response = await fetch(`${API_URL}/${id}`);
        if (!response.ok) {
            throw new Error(`Error al obtener el empleado con ID: ${id}`);
        }
        const data: EmployeeData = await response.json(); 
        return data;
    } catch (error) {

        throw error;
    }
};





export const deleteEmployee = async (id: number): Promise<{ success: boolean }> => {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: "DELETE",
        });
        if (!response.ok) {
            throw new Error(`Error al eliminar el empleado con ID: ${id}`);
        }
        return { success: true }; 
    } catch (error) {

        throw error;
    }
};
