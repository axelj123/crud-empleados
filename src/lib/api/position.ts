const API_URL = `${process.env.NEXT_PUBLIC_URL}/positions`;

export interface PositionData {
    id: number;
    name: string;
    
}
export const getPositions = async (): Promise<PositionData[]> => {
    try {
      const response = await fetch(API_URL); 
      if (!response.ok) {
        throw new Error("Error al obtener las posiciones");
      }
      const data = await response.json();
      return data;
    } catch (error) {

      return [];
    }
  };

