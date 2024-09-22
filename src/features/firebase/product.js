import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../../../firebase";
import { Alert } from "react-native"; 

export const getProducts = async () => {
    try {
        const productsRef = collection(db, "products");
        const productsSnapshot = await getDocs(productsRef);
        const products = productsSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return products;
    } catch (error) {
        Alert.alert("Error", "Hubo un problema al obtener los productos");
        console.error(error); 
    }
}

export const getProductById = async (productId) => {
    try {
        const productRef = doc(db, "products", productId);
        const productSnapshot = await getDoc(productRef);
        if (!productSnapshot.exists()) {
            Alert.alert("Error", "El producto no existe");
            return null;
        }
        const product = { id: productSnapshot.id, ...productSnapshot.data() };
        return product;
    } catch (error) {
        Alert.alert("Error", "Hubo un problema al obtener el producto");
        console.error(error); 
    }
}
