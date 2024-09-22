import { StyleSheet, Text, View, Image, Pressable, Alert, ActivityIndicator } from "react-native";
import React, { useContext, useState } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { removeItemById } from "../features/firebase/cart";
import CartContext from "../features/context/cartContext";

const CartItem = ({ title, image, price, brand, qty, id }) => {
    const { setCartItems } = useContext(CartContext);
    const [loading, setLoading] = useState(false);

    const removeItem = async () => {
        setLoading(true);
        const res = await removeItemById(id);
        setLoading(false);
        if (res.success === true) {
            Alert.alert("Success", "Removed Successfully", [{ text: "OK" }]);
            setCartItems(res.data);
        } else {
            Alert.alert("Error", "Failed to remove item", [{ text: "OK" }]);
        }
    };

    return (
        <View>
            <View className="flex-row">
                <View className="p-2">
                    <Image source={{ uri: image }} className="rounded-xl h-20 w-20 object-contain" />
                </View>
                <View className="flex-1 flex-row justify-between items-center w-[100%] px-4">
                    <View className="w-[50%]">
                        <Text className="font-bold" numberOfLines={1}>{title}</Text>
                        <Text className="text-xs">{brand}</Text>
                        <Text className="font-extrabold">Qty: {qty}</Text>
                        <Text className="font-extrabold">${price}</Text>
                    </View>
                    <View className="flex-row px-3 h-8 justify-center items-center bg-gray-200 rounded-3xl">
                        <Pressable onPress={removeItem} className="mr-2 flex-row" disabled={loading}>
                            {loading ? (
                                <ActivityIndicator size="small" color="#000" />
                            ) : (
                                <>
                                    <MaterialIcons name="delete-outline" size={20} />
                                    <Text>Remove</Text>
                                </>
                            )}
                        </Pressable>
                    </View>
                </View>
            </View>
            <View className="my-1 border border-gray-200" />
        </View>
    );
};

export default CartItem;

const styles = StyleSheet.create({});
