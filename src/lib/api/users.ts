const API_URL=`${process.env.NEXT_PUBLIC_URL}/api/users`;


export const createUser = async (userData) => {
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error al registrar el usuario: ${errorText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error al registrar usuario en la base de datos:", error);
      throw error;
    }
  };