"use client";
import { useState, useEffect } from 'react';
import { getPositions } from '../../../lib/api/position';
import { toast } from 'sonner';

export const useEmployeeForm = (initialData = null) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    positionId: '',
    salary: '',
    dni: '',
    phone: '',
    photo: null,
  });
  const [positions, setPositions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const positionsData = await getPositions();
        setPositions(positionsData);
      } catch (error) {
        console.error('Error al cargar posiciones:', error);
        toast.error("Error al cargar las posiciones");
      }
    };

    fetchPositions();

    if (initialData) {
      setFormData({
        firstName: initialData.firstName || '',
        lastName: initialData.lastName || '',
        email: initialData.email || '',
        positionId: initialData.position?.id?.toString() || '',
        salary: initialData.salary?.toString() || '',
        dni: initialData.dni || '',
        phone: initialData.phone || '',
        photo: null,
      });
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    if (e.target.files?.[0]) {
      setFormData(prev => ({
        ...prev,
        photo: e.target.files[0],
      }));
    }
  };

  return {
    formData,
    positions,
    isLoading,
    setIsLoading,
    handleChange,
    handleFileChange,
    setFormData
  };
};
