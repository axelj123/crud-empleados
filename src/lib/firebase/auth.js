import { createUserWithEmailAndPassword, sendPasswordResetEmail, signInWithEmailAndPassword, updateProfile,GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from './config';


export const registerUser = async (email, password, displayName) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    await updateProfile(user, {
      displayName: displayName,
    });
    return userCredential;
  } catch (error) {
    console.error("Error al registrar el usuario:", error.message);
    throw error;
  }
};

export const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    throw new Error(error.message);
  }
};

export const resetPassword = async () => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { success: true, message: "Correo de restablecimiento enviado." };

  } catch (error) {
    throw new Error(error.message);
  }
}


export const LoginWithGoogle = async ()=>{
  const provider =new GoogleAuthProvider();

  try {
    const result =await signInWithPopup(auth,provider);
    const user=result.user;


    return user;
  } catch (error) {

    throw new Error(error.message); 
  }

}
