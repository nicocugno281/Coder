import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { app } from "../../../firebase"; 
import { Alert } from "react-native";

const auth = getAuth(app);
const db = getFirestore(app);

const registerWithEmailAndPassword = async (name, email, password) => {
    try {
        const res = await createUserWithEmailAndPassword(auth, email, password);
        const user = res.user;
        const userDocRef = doc(db, "users", user.uid);
        await setDoc(userDocRef, {
            uid: user.uid,
            name,
            email,
        });
        Alert.alert("Registro Exitoso", "Te has registrado con éxito.");
        return { success: true };
    } catch (error) {
        Alert.alert("Error", "Contraseña o Nombre de usuario incorrectos");
        return { success: false, error: error.message };
    }
};

const loginWithEmailAndPassword = async (email, password) => {
    try {
        const res = await signInWithEmailAndPassword(auth, email, password);
        const userId = res.user.uid;
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        Alert.alert("Inicio de Sesión Exitoso", "Has iniciado sesión correctamente.");
        return {
            success: true,
            user: userDoc.data()
        };
    } catch (err) {
        Alert.alert("Error", "Contraseña o Nombre de usuario incorrectos");
        return ;
    }
};

const logout = async () => {
    try {
        await signOut(auth);
        Alert.alert("Sesión Cerrada", "Has cerrado sesión correctamente.");
        return { success: true };
    } catch (error) {
        Alert.alert("Error", "Hubo un problema al cerrar sesión.");
        return { success: false, error: error.message };
    }
};

export { loginWithEmailAndPassword, logout, registerWithEmailAndPassword };
