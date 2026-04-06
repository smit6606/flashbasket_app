import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/ThemeContext';
import { useUser } from '../redux/UserContext';
import AddressForm from '../components/AddressForm';

const AddAddressScreen = ({ navigation, route }) => {
    const { theme } = useTheme();
    const { addAddress, updateAddress } = useUser();
    const editAddress = route.params?.address || route.params?.editAddress;
    const isEdit = route.params?.isEdit || !!editAddress;
    const [selectedLocation, setSelectedLocation] = useState(editAddress || null);

    const handleSubmit = async (addressData) => {
        if (!addressData.fullAddress || !addressData.city || !addressData.pincode) {
            Alert.alert('Error', 'Please fill all mandatory fields');
            return;
        }

        try {
            const finalData = { ...selectedLocation, ...addressData };
            if (editAddress) {
                await updateAddress(editAddress.id, finalData);
                Alert.alert('Success', 'Address updated successfully');
            } else {
                await addAddress(finalData);
                Alert.alert('Success', 'Address saved successfully');
            }
            navigation.goBack();
        } catch (error) {
            Alert.alert('Error', error.message || 'Failed to save address');
        }
    };


    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {/* Header */}
            <View style={[styles.header, { borderBottomColor: theme.colors.border, backgroundColor: theme.colors.surface }]}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="close" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                    {editAddress ? 'Edit Address' : 'Add New Address'}
                </Text>
            </View>

            <KeyboardAvoidingView 
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'} 
                style={{ flex: 1 }}
                keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
            >
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                    {/* Form Section */}
                    <View style={styles.formSection}>
                        <AddressForm 
                            initialData={selectedLocation || editAddress} 
                            onSubmit={handleSubmit} 
                            onCancel={() => navigation.goBack()} 
                        />
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    backButton: {
        padding: 4,
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '800',
    },
    scrollContent: {
        paddingBottom: 100, // Increased for keyboard clearance
    },
    formSection: {
        paddingTop: 0,
    },
});

export default AddAddressScreen;
