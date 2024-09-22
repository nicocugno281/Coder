import { Text, View, Image, Pressable, Alert, TextInput, StyleSheet } from "react-native";
import React, { useContext, useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import AuthContext from "../features/context/authContext";
import { logout } from "../features/firebase/userAuth";

const ProfileScreen = () => {
    const { currentUser, setCurrentUser, isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
    
    const [image, setImage] = useState(currentUser?.profileImage || null); 
    const [description, setDescription] = useState(currentUser?.description || ''); 
    const [address, setAddress] = useState(currentUser?.address || ''); 
    const [editing, setEditing] = useState(false); 

    const pickImage = async () => {
        const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
        if (permissionResult.granted === false) {
            Alert.alert("Camera access is required!", "Please allow camera access to change your profile picture.");
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const handleLogout = async () => {
        const res = await logout();
        if (res.success === true) {
            Alert.alert("Success", "Logged Out Successfully");
            setIsLoggedIn(false);
            setCurrentUser(null);
        }
    };

    const handleSave = () => {
        setCurrentUser(prev => ({
            ...prev,
            description,
            address,
            profileImage: image,
        }));
        setEditing(false);
        Alert.alert("Success", "Profile Updated Successfully");
    };

    const getLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert('Permission denied', 'Permission to access location was denied');
            return;
        }

        const location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const reverseGeocode = await Location.reverseGeocodeAsync({
            latitude,
            longitude,
        });

        if (reverseGeocode.length > 0) {
            const { city, region, street, postalCode } = reverseGeocode[0];
            setAddress(`${street}, ${city}, ${region}, ${postalCode}`);
        }
    };

    useEffect(() => {
        if (image && currentUser) {
            setCurrentUser(prev => ({
                ...prev,
                profileImage: image,
            }));
        }
    }, [image]);

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <View style={styles.imageContainer}>
                    <Pressable onPress={pickImage} style={styles.imageWrapper}>
                        <Image
                            source={image ? { uri: image } : require("../../assets/images/user.png")} 
                            style={styles.profileImage}
                        />
                    </Pressable>
                    <Text style={styles.imageHint}>Tap the image to change your profile picture</Text>
                </View>

                <View style={styles.profileDetails}>
                    {isLoggedIn ? (
                        <View style={styles.centeredContent}>
                            <Text style={styles.userName}>{currentUser?.name}</Text>
                            <Text style={styles.userEmail}>{currentUser?.email}</Text>

                            {editing ? (
                                <>
                                    <TextInput
                                        placeholder="Description"
                                        value={description}
                                        onChangeText={setDescription}
                                        style={styles.input}
                                        placeholderTextColor="#888"
                                    />
                                    <TextInput
                                        placeholder="Address"
                                        value={address}
                                        onChangeText={setAddress}
                                        style={styles.input}
                                        placeholderTextColor="#888"
                                    />
                                    <Pressable onPress={getLocation} style={styles.locationButton}>
                                        <Text style={styles.buttonText}>Use Current Location</Text>
                                    </Pressable>
                                    <Pressable onPress={handleSave} style={styles.saveButton}>
                                        <Text style={styles.buttonText}>Save Profile</Text>
                                    </Pressable>
                                </>
                            ) : (
                                <>
                                    <Text style={styles.profileText}>
                                        {description || "No description provided"}
                                    </Text>
                                    <Text style={styles.profileText}>
                                        {address || "No address provided"}
                                    </Text>
                                    <Pressable onPress={() => setEditing(true)} style={styles.editButton}>
                                        <Text style={styles.buttonText}>Edit Profile</Text>
                                    </Pressable>
                                </>
                            )}
                        </View>
                    ) : (
                        <View style={styles.centeredContent}>
                            <Text style={styles.loginPrompt}>Login to view your Profile!</Text>
                        </View>
                    )}
                </View>
            </View>

            {isLoggedIn && (
                <View style={styles.centeredContent}>
                    <Pressable onPress={handleLogout} style={styles.logoutButton}>
                        <Text style={styles.buttonText}>Log Out</Text>
                    </Pressable>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 16,
        justifyContent: 'space-between',
    },
    imageContainer: {
        marginTop: 32,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imageWrapper: {
        borderColor: '#ddd',
        borderWidth: 1,
        borderRadius: 16,
        overflow: 'hidden',
    },
    profileImage: {
        width: 128,
        height: 128,
        resizeMode: 'cover',
    },
    imageHint: {
        color: '#888',
        marginTop: 8,
    },
    profileDetails: {
        marginTop: 24,
    },
    centeredContent: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    userEmail: {
        fontSize: 12,
        color: '#555',
        marginTop: 4,
    },
    input: {
        backgroundColor: '#f3f3f3',
        width: '100%',
        padding: 12,
        borderRadius: 8,
        marginTop: 16,
        fontSize: 16,
    },
    profileText: {
        marginTop: 12,
        fontSize: 16,
        color: '#555',
    },
    editButton: {
        backgroundColor: '#333',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginTop: 16,
        width: '100%',
    },
    saveButton: {
        backgroundColor: '#28a745',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginTop: 16,
        width: '100%',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    logoutButton: {
        backgroundColor: '#dc3545',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        width: '100%',
    },
    locationButton: {
        backgroundColor: '#007bff',
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderRadius: 8,
        marginTop: 16,
        width: '100%',
    },
    loginPrompt: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default ProfileScreen;
