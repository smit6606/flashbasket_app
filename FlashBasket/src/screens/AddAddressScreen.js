import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/ThemeContext';
import { useUser } from '../redux/UserContext';
import AddressForm from '../components/AddressForm';
import Animated, { FadeInUp } from 'react-native-reanimated';

const AddAddressScreen = ({ navigation, route }) => {
    const { theme } = useTheme();
    const { addAddress, updateAddress } = useUser();
    const editAddress = route.params?.editAddress;
    const [selectedLocation, setSelectedLocation] = useState(editAddress || null);

    const handleSubmit = async (addressData) => {
        if (!addressData.full_address || !addressData.city || !addressData.pincode) {
            Alert.alert('Error', 'Please fill all mandatory fields');
            return;
        }

        try {
            const finalData = { ...addressData, ...selectedLocation };
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

    const handleOpenMap = () => {
        navigation.navigate('MapScreen', {
            onSelect: (data) => {
                setSelectedLocation(prev => ({
                    ...prev,
                    full_address: data.address,
                    latitude: data.latitude,
                    longitude: data.longitude
                }));
            }
        });
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

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                {/* Visual Map Preview */}
                <Animated.View entering={FadeInUp.duration(600)} style={styles.mapSection}>
                    <TouchableOpacity 
                        activeOpacity={0.9} 
                        onPress={handleOpenMap}
                        style={[styles.mapPreviewContainer, { borderColor: theme.colors.border, backgroundColor: theme.colors.card }]}
                    >
                        <Image 
                            source={{ uri: 'https://maps.googleapis.com/maps/api/staticmap?center=28.6139,77.2090&zoom=15&size=600x300&key=YOUR_API_KEY_HERE' }} 
                            style={styles.staticMap}
                            resizeMode="cover"
                        />
                        <View style={[styles.mapOverlay, { backgroundColor: 'rgba(0,0,0,0.3)' }]}>
                            <View style={[styles.mapBadge, { backgroundColor: theme.colors.primary }]}>
                                <Icon name="map-marker-plus" size={20} color="#FFF" />
                                <Text style={styles.mapBadgeText}>Change Location</Text>
                            </View>
                        </View>
                    </TouchableOpacity>
                    
                    {selectedLocation?.full_address && (
                        <View style={[styles.selectedAddressBox, { backgroundColor: theme.colors.primary + '10', borderColor: theme.colors.primary + '30' }]}>
                            <Icon name="check-circle" size={18} color={theme.colors.primary} />
                            <Text style={[styles.selectedAddressText, { color: theme.colors.text }]}>
                                {selectedLocation.full_address}
                            </Text>
                        </View>
                    )}
                </Animated.View>

                {/* Form Section */}
                <View style={styles.formSection}>
                    <AddressForm 
                        initialData={selectedLocation || editAddress} 
                        onSubmit={handleSubmit} 
                        onCancel={() => navigation.goBack()} 
                    />
                </View>
            </ScrollView>
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
        paddingBottom: 40,
    },
    mapSection: {
        padding: 16,
    },
    mapPreviewContainer: {
        height: 180,
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        position: 'relative',
    },
    staticMap: {
        width: '100%',
        height: '100%',
        opacity: 0.8,
    },
    mapOverlay: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
    },
    mapBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderRadius: 100,
        elevation: 4,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 5,
    },
    mapBadgeText: {
        color: '#FFF',
        fontSize: 14,
        fontWeight: '800',
        marginLeft: 8,
    },
    selectedAddressBox: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 12,
        padding: 12,
        borderRadius: 12,
        borderWidth: 1,
    },
    selectedAddressText: {
        fontSize: 13,
        fontWeight: '600',
        marginLeft: 8,
        flex: 1,
    },
    formSection: {
        paddingTop: 0,
    },
});

export default AddAddressScreen;
