import { Text, View, Pressable, Image, Alert, ActivityIndicator } from "react-native";
import React, { useContext, useEffect, useState } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { getProductById } from "../features/firebase/product";
import ProductContext from "../features/context/productContext";
import { ScrollView } from "react-native-gesture-handler";
import { addToCart } from "../features/firebase/cart";
import { SafeAreaView } from "react-native-safe-area-context";
import CartContext from "../features/context/cartContext";

const DetailScreen = ({ navigation, route }) => {
    const { currentProduct: product, setCurrentProduct } = useContext(ProductContext);
    const { cartItems, setCartItems } = useContext(CartContext);
    const id = route.params.productId;

    const [qty, setQty] = useState(1);
    const [loading, setLoading] = useState(true);
    const [addingToCart, setAddingToCart] = useState(false);

    const increment = () => {
        setQty(prev => prev + 1);
    };

    const decrement = () => {
        if (qty > 1) {
            setQty(prev => prev - 1);
        }
    };

    const goBack = () => {
        navigation.goBack();
    };

    const isProductInCart = (id) => {
        return cartItems.some(item => item.id === id);
    };

    const addItemToCart = async () => {
        if (isProductInCart(id)) {
            Alert.alert("Información", "Este producto ya está en el carrito.");
            return;
        }

        setAddingToCart(true);
        const res = await addToCart(id, qty);
        setAddingToCart(false);

        if (res.success === true) {
            Alert.alert("Enhorabuena", "Item añadido al carrito!");
            setCartItems(res.data);
        } else {
            Alert.alert("Error", "No se ha podido agregar el item al carrito");
        }
    };

    const fetchProductById = async (id) => {
        setLoading(true);
        const result = await getProductById(id);
        setCurrentProduct(result);
        setLoading(false);
    };

    useEffect(() => {
        fetchProductById(id);
    }, [id]);

    return (
        <SafeAreaView className="h-full bg-white">
            {loading ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <>
                    <View className="bg-black w-full">
                        <Pressable
                            onPress={goBack}
                            className="mt-2 absolute z-10 top-4 justify-center items-center h-10 w-10 mx-4 rounded-full bg-black"
                        >
                            <MaterialIcons name="chevron-left" size={34} color={"#fff"} />
                        </Pressable>
                        <Image source={{ uri: product?.image }} style={{ resizeMode: "cover" }} className="h-[470]" />
                    </View>

                    <ScrollView contentContainerStyle={{ paddingBottom: 20 }} className="rounded-[30px] bg-white mt-[-80px] p-5">
                        <View>
                            <View className="flex-row justify-between">
                                <View>
                                    <Text className="font-extrabold text-lg">{product?.title}</Text>
                                    <Text className="text-xs text-gray-500">{product?.brand}</Text>
                                </View>
                                <View>
                                    <View className="flex-row justify-center items-center">
                                        <Pressable className="px-3 py-1 bg-gray-300 border border-gray-300 rounded-tl-lg rounded-bl-lg" onPress={decrement}>
                                            <Text className="font-semibold">-</Text>
                                        </Pressable>
                                        <Text className="bg-white px-2 py-1 border border-gray-300">{qty}</Text>
                                        <Pressable className="px-3 py-1 bg-gray-300 border border-gray-300 rounded-tr-lg rounded-br-lg" onPress={increment}>
                                            <Text>+</Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>

                            <View className="mt-6">
                                <Text className="font-extrabold mb-3">Description</Text>
                                <ScrollView className="h-50 mb-4">
                                    <Text>{product?.description}</Text>
                                </ScrollView>

                                {/* Aquí se añade el precio */}
                                <Text className="font-extrabold text-lg mt-4">
                                    Price: ${product?.price.toFixed(2)}
                                </Text>
                            </View>

                            {/* Añadimos margen inferior para que no se cubra con la navegación */}
                            <Pressable
                                onPress={addItemToCart}
                                className="mt-4 justify-center items-center rounded-full py-3 px-4 w-full bg-black"
                                style={{ marginBottom: 20 }} // Asegura que haya espacio debajo
                            >
                                {addingToCart ? (
                                    <ActivityIndicator size="small" color="#ffffff" />
                                ) : (
                                    <Text className="text-white font-extrabold">Add to cart</Text>
                                )}
                            </Pressable>
                        </View>
                    </ScrollView>
                </>
            )}
        </SafeAreaView>
    );
};

export default DetailScreen;
