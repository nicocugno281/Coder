import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db, auth } from "../../../firebase";
import { uuidv4 } from "@firebase/util";
import { Alert } from "react-native";

export const addToOrders = async () => {
    try {
        const userDocRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnapshot = await getDoc(userDocRef);
        if (userDocSnapshot.exists()) {
            const userData = userDocSnapshot.data();
            const cartItems = userData.cart;
            const orderItems = orderItems || [];
            cartItems.map(item => {
                orderItems.push({
                    orderId: uuidv4().replace(/-/g, '').substring(0, 12),
                    id: item.id,
                    image: item.image,
                    title: item.title,
                    brand: item.brand,
                    price: item.price,
                    qty: item.qty,
                    date: new Date().toLocaleString()
                });
            });
            await updateDoc(userDocRef, { orders: orderItems, cart: [] });
            Alert.alert("Éxito", "Los artículos se añadieron al pedido");
            return { success: true, data: orderItems };
        }
    } catch (error) {
        Alert.alert("Error", "Hubo un problema al añadir los artículos al pedido");
        console.error(error);
    }
}

export const getAllOrderItems = async () => {
    try {
        const userRef = doc(db, "users", auth.currentUser.uid);
        const userDocSnapshot = await getDoc(userRef);
        const data = userDocSnapshot.data().orders;
        return { success: true, data };
    } catch (error) {
        Alert.alert("Error", "Hubo un problema al obtener los pedidos");
        console.error(error);
    }
}
