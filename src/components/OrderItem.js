import { StyleSheet, Text, View, Image } from "react-native";
import React from "react";

const OrderItem = ({ orderId, title, image, brand, date, price, qty }) => {
    return (
        <View className="bg-white justify-center items-center rounded-lg w-full mb-2 border border-slate-200">
            <View className="flex-row justify-center items-center">
                <View className="p-2 items-center justify-center">
                    <Image source={{ uri: image }} className="rounded-xl h-24 w-24 object-contain" />
                </View>
                <View className="flex-1 pl-2">
                    <Text className="font-bold text-base" numberOfLines={1} ellipsizeMode="tail">{title}</Text>
                    <Text className="text-xs mt-1">{brand}</Text>
                    <Text className="text-xs">Quantity: {qty}</Text>
                    <Text className="text-xs">Date: {date}</Text>
                    <Text className="text-xs">OrderId: <Text className="font-semibold">#{orderId}</Text></Text>
                </View>
                <View className="flex-row items-center px-3">
                    <Text className="font-extrabold text-xl text-green-500">${price}</Text>
                </View>
            </View>
        </View>
    );
};

export default OrderItem;

const styles = StyleSheet.create({
    card: {

    },
    shadowProp: {
        shadowColor: '#111',
        elevation: 6,
        shadowRadius: 20
    },
})