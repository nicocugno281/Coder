import { Text, View, Image, ScrollView, StyleSheet, Pressable, TextInput, ActivityIndicator } from "react-native";
import React, { useCallback, useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import OfferCard from "../components/OfferCard";
import UserLogo from "../../assets/images/user.png";
import NewArrivalsCard from "../components/NewArrivalsCard";
import AuthContext from "../features/context/authContext";
import AuthenticationModal from "../components/AuthenticationModal";
import { getProducts } from "../features/firebase/product";
import ProductContext from "../features/context/productContext";

const HomeScreen = ({ navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const { isLoggedIn, currentUser } = useContext(AuthContext);
    const { products, setProducts } = useContext(ProductContext);
    const [loading, setLoading] = useState(true); // Nuevo estado para manejar el loading

    const fetchAllProducts = async () => {
        setLoading(true); // Inicia el loading
        const result = await getProducts();
        setProducts(result);
        setLoading(false); // Finaliza el loading cuando los productos estén cargados
    };

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
        });

        fetchAllProducts();
    }, []);

    return (
        <SafeAreaView style={{ flex: 1 }}>
            {/* Indicador de carga */}
            {loading ? (
                <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                    <ActivityIndicator size="large" color="#0000ff" />
                </View>
            ) : (
                <>
                    <View className="flex-row px-5 mt-6 justify-between items-center">
                        <View className="bg-black rounded-full w-10 h-10 justify-center items-center">
                            <MaterialIcons name="menu" size={24} color={"#fff"} />
                        </View>
                        {!isLoggedIn && (
                            <Pressable onPress={() => setModalVisible(!modalVisible)} className="flex-row items-center justify-center border border-slate-400 rounded-full ">
                                <Image
                                    source={UserLogo}
                                    style={{
                                        height: 40,
                                        width: 40,
                                        backgroundColor: "#aaaaaa",
                                        borderRadius: 50,
                                    }}
                                />
                                <Text className="font-semibold py-2 pr-4 pl-2">Login</Text>
                            </Pressable>
                        )}
                    </View>

                    <View className="mt-6 px-5">
                        <Text className="font-bold text-2xl">
                            Welcome, <Text className="font-bold text-slate-500">{currentUser?.name}</Text>
                        </Text>
                        <Text className="font-semibold text-xl text-gray-500">
                            Our Fashions App
                        </Text>
                    </View>

                    <View className="mt-6 px-5">
                        <View className="flex-row bg-gray-200 p-2 px-3 items-center rounded-3xl">
                            <View className="">
                                <MaterialIcons name="search" size={24} color={"#111"} />
                            </View>
                            <TextInput
                                placeholder="Search..."
                                placeholderTextColor={"#666666"}
                                className="px-2"
                            />
                        </View>
                    </View>

                    <View className="mt-6 p-5">
                        <OfferCard />
                    </View>
                    <View className="mt-4">
                        <View className="flex-row justify-between items-center px-5">
                            <Text className="text-lg font-extrabold">New Arrivals</Text>
                            <Pressable onPress={() => navigation.navigate("productlistscreen")}>
                                <Text className="text-xs text-gray-500">View All</Text>
                            </Pressable>
                        </View>
                        <ScrollView
                            className="mt-4 ml-5"
                            horizontal={true}
                            showsHorizontalScrollIndicator={false}
                        >
                            {products?.map(product => (
                                <Pressable
                                    key={product.id}
                                    onPress={() => navigation.navigate("detailscreen", { productId: product.id })}
                                >
                                    <NewArrivalsCard
                                        title={product.title}
                                        image={product.image}
                                        price={product.price}
                                        brand={product.brand}
                                    />
                                </Pressable>
                            ))}
                        </ScrollView>
                    </View>

                    <View>
                        <AuthenticationModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
                    </View>
                </>
            )}
        </SafeAreaView>
    );
};

export default HomeScreen;
