import { StyleSheet, Text, View, Pressable, Alert, ActivityIndicator } from "react-native";
import React, { useContext, useState } from "react";
import CartContext from "../features/context/cartContext";
import { addToOrders } from "../features/firebase/order";
import OrderContext from "../features/context/orderContext";

const TotalSummaryCard = ({ totalPrice }) => {
    const { cartItems = [], setCartItems } = useContext(CartContext);  // Asegura que siempre sea un array vacío
    const { setOrderItems } = useContext(OrderContext);
    const [loading, setLoading] = useState(false);

    const placeOrder = async () => {
        if (!cartItems || cartItems.length === 0) {
            Alert.alert("Cart Empty", "You cannot place an order with an empty cart.");
            return;
        }

        setLoading(true);
        const res = await addToOrders();
        setLoading(false);
        if (res.success === true) {
            setCartItems([]);
            setOrderItems(res.data);
        } else {
            Alert.alert("Error", "Failed to place order. Please try again.");
        }
    };

    return (
        <View className="border border-gray-200 rounded-lg p-6">
            <View className="flex-row justify-between items-center">
                <Text className="font-bold text-lg">Total Price:</Text>
                <Text className="font-extrabold text-xl">${totalPrice}</Text>
            </View>
            <Pressable
                onPress={placeOrder}
                className={`bg-black py-4 rounded-lg mt-6 ${(!cartItems || cartItems.length === 0) ? "opacity-50" : ""}`}
                disabled={loading || !cartItems || cartItems.length === 0}
            >
                {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                ) : (
                    <Text className="font-semibold text-white text-center">
                        {!cartItems || cartItems.length === 0 ? "Cart is Empty" : "Place Order"}
                    </Text>
                )}
            </Pressable>
        </View>
    );
};

export default TotalSummaryCard;

const styles = StyleSheet.create({});
