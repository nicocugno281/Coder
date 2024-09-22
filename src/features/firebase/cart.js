import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../../../firebase";

export const getCartItems = async () => {
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const cart = userData.cart || []; // Usa un array vacío si no hay cart
        return { data: cart, success: true };
    } else {
        return { success: false, message: "User does not exist." };
    }
};
export const addToCart = async (itemId, qty) => {
    const productRef = doc(db, "products", itemId);
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    const productSnapshot = await getDoc(productRef);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists() && productSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const productData = productSnapshot.data();
        const cartItems = userData.cart || [];

        cartItems.push({
            id: itemId,
            title: productData.title,
            brand: productData.brand,
            price: productData.price,
            image: productData.image,
            qty: qty,
        });

        await updateDoc(userDocRef, { cart: cartItems });
        console.log("Updated cart items:", cartItems); // Log para ver el carrito actualizado
        return { success: true, message: "Item added to cart successfully!", data: cartItems };
    } else {
        return { success: false, message: "User or product does not exist." };
    }
};
export const removeItemById = async (id) => {
    const userDocRef = doc(db, "users", auth.currentUser.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const newCart = userData.cart.filter((item) => item.id !== id);
        await updateDoc(userDocRef, { cart: newCart });
        const subTotal = newCart.reduce((acc, curr) => acc + Number(curr.price), 0);
        return { data: newCart, success: true, subTotal, message: "Item removed from cart." };
    } else {
        return { success: false, message: "User does not exist." };
    }
}
