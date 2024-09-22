import React, { useContext, useEffect, useState } from "react";
import {
    Modal,
    Text,
    TouchableOpacity,
    View,
    TextInput,
    StyleSheet,
    Pressable,
    ActivityIndicator,
    Alert
} from "react-native";
import AuthContext from "../features/context/authContext";
import { loginWithEmailAndPassword, registerWithEmailAndPassword } from "../features/firebase/userAuth";

const AuthenticationModal = ({ modalVisible, setModalVisible }) => {
    const [type, setType] = useState("login");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const { currentUser, setCurrentUser, isLoggedIn, setIsLoggedIn } = useContext(AuthContext);


    const validateEmail = (email) => {
        const re = /\S+@\S+\.\S+/;
        return re.test(email);
    };

    
    const validatePassword = (password) => {
        return password.length >= 6;
    };


    const validateRegistration = () => {
        if (name.trim() === "") {
            setError("El nombre no puede estar vacío.");
            return false;
        }
        if (!validateEmail(email)) {
            setError("El formato del correo electrónico es inválido.");
            return false;
        }
        if (!validatePassword(password)) {
            setError("La contraseña debe tener al menos 6 caracteres.");
            return false;
        }
        setError(""); 
        return true;
    };

    const handleLogin = async () => {
        setLoading(true);
        const res = await loginWithEmailAndPassword(email, password);
        if (res.success === true) {
            setCurrentUser(res.user);
            setModalVisible(false);
            setIsLoggedIn(true);
        } else {
            Alert.alert("Error", res.error);
        }
        setLoading(false);
    };

    const handleRegister = async () => {
        if (!validateRegistration()) return; // Si la validación falla, no continuar
        setLoading(true);
        const res = await registerWithEmailAndPassword(name, email, password);
        if (res.success) {
            setCurrentUser({ name, email });
            setModalVisible(false);
            setIsLoggedIn(true);
        } else {
            Alert.alert("Error", res.error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (currentUser) {
            setIsLoggedIn(true);
        }
    }, [currentUser]);

    return (
        <View style={{ flex: 1, width: 1150, backgroundColor: "red" }}>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setModalVisible(false);
                }}
            >
                {type === "login" ? (
                    <Pressable onPress={() => setModalVisible(false)} className="flex-1 justify-center items-center bg-black/[0.5]">
                        <View className="w-[80%] p-6 bg-white rounded-lg z-10">
                            <Text className="font-bold mb-2">Email:</Text>
                            <TextInput
                                className="border border-slate-300 px-3 py-2"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                            />
                            <Text className="font-bold mt-4 mb-2">Password:</Text>
                            <TextInput
                                className="border border-slate-300 px-3 py-2"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={true}
                            />

                            <TouchableOpacity
                                className="bg-black py-4 mt-6 rounded-lg"
                                onPress={handleLogin}
                            >
                                <Text className="text-white font-semibold text-center">
                                    Login
                                </Text>
                            </TouchableOpacity>
                            <View className="flex-row justify-center items-center mt-4">
                                <Text className="text-slate-500">Not a User?</Text>
                                <Pressable onPress={() => setType("register")}>
                                    <Text className="font-bold"> Register</Text>
                                </Pressable>
                            </View>
                            {loading && <ActivityIndicator />}
                        </View>
                    </Pressable>
                ) : (
                    <Pressable onPress={() => setModalVisible(false)} className="flex-1 justify-center items-center bg-black/[0.5]">
                        <View className="w-[80%] p-6 bg-white">
                            <Text className="font-bold mb-2">Name:</Text>
                            <TextInput
                                className="border border-slate-300 px-3 py-2"
                                value={name}
                                onChangeText={setName}
                            />
                            <Text className="font-bold mb-2">Email:</Text>
                            <TextInput
                                className="border border-slate-300 px-3 py-2"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                            />
                            <Text className="font-bold mb-2">Password:</Text>
                            <TextInput
                                className="border border-slate-300 px-3 py-2"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={true}
                            />

                            {error ? <Text style={{ color: "red" }}>{error}</Text> : null}

                            <TouchableOpacity
                                className="bg-black py-4 mt-6 rounded-lg"
                                onPress={handleRegister}
                            >
                                <Text className="text-white font-semibold text-center">
                                    Register
                                </Text>
                            </TouchableOpacity>

                            <View className="flex-row justify-center items-center mt-4">
                                <Text className="text-slate-500">Already a User?</Text>
                                <Pressable onPress={() => setType("login")}>
                                    <Text className="font-bold"> Login</Text>
                                </Pressable>
                            </View>
                            {loading && <ActivityIndicator />}
                        </View>
                    </Pressable>
                )}
            </Modal>
        </View>
    );
};

export default AuthenticationModal;
