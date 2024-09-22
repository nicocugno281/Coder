import { Text, View, ScrollView } from "react-native";
import React, { useContext, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import OrderItem from "../components/OrderItem";
import { getAllOrderItems } from "../features/firebase/order";
import OrderContext from "../features/context/orderContext";
import AuthContext from "../features/context/authContext";

const OrderScreen = ({ navigation }) => {
    const { orderItems, setOrderItems } = useContext(OrderContext);
    const { isLoggedIn } = useContext(AuthContext);

    const fetchAllOrders = async () => {
        const res = await getAllOrderItems();
        if (res.success === true) {
            setOrderItems(res.data);
            console.log("res.data", res.data);
        }
    };

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });
        fetchAllOrders();
    }, []);

    return (
        <SafeAreaView className="flex-1 w-full p-5 bg-white">
            <View>
                <Text className="font-bold text-xl">My Orders</Text>
            </View>
            {isLoggedIn ? (
                orderItems.length > 0 ? (
                    <ScrollView className="mt-4 pt-4" showsVerticalScrollIndicator={false}>
                        {orderItems.map((order) => (
                            <OrderItem key={order.id} {...order} />
                        ))}
                    </ScrollView>
                ) : (
                    <View className="flex-1 items-center justify-center">
                        <Text className="font-bold text-lg">No orders found!</Text>
                    </View>
                )
            ) : (
                <View className="flex-1 items-center justify-center">
                    <Text className="font-bold text-lg">Login to view your Orders!</Text>
                </View>
            )}
        </SafeAreaView>
    );
};

export default OrderScreen;
