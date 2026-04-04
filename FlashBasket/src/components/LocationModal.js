import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, FlatList, Dimensions, Pressable } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/ThemeContext';
import { useUser } from '../redux/UserContext';

const { height } = Dimensions.get('window');

const LocationModal = ({ visible, onClose, onSelectAddress, onUseCurrentLocation }) => {
    const { theme } = useTheme();
    const { addresses, selectedAddress } = useUser();

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="slide"
            onRequestClose={onClose}
        >
            <Pressable style={styles.overlay} onPress={onClose}>
                <View style={[styles.sheet, { backgroundColor: theme.colors.background }]}>
                    <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />
                    
                    <View style={styles.header}>
                        <Text style={[styles.title, { color: theme.colors.text }]}>Choose Location</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Icon name="close" size={24} color={theme.colors.text} />
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity 
                        style={[styles.currentLocationRow, { borderBottomColor: theme.colors.border }]}
                        onPress={onUseCurrentLocation}
                    >
                        <View style={[styles.iconCircle, { backgroundColor: theme.colors.primaryLight }]}>
                            <Icon name="crosshairs-gps" size={24} color={theme.colors.primary} />
                        </View>
                        <View style={styles.currentLocationText}>
                            <Text style={[styles.rowTitle, { color: theme.colors.primary }]}>Use my current location</Text>
                            <Text style={[styles.rowSub, { color: theme.colors.textSecondary }]}>Click to fetch address</Text>
                        </View>
                    </TouchableOpacity>

                    <View style={styles.savedSection}>
                        <Text style={[styles.sectionTitle, { color: theme.colors.textSecondary }]}>Saved Addresses</Text>
                        <FlatList
                            data={addresses}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <TouchableOpacity 
                                    style={styles.addressRow}
                                    onPress={() => onSelectAddress(item)}
                                >
                                    <View style={styles.iconContainer}>
                                        <Icon 
                                            name={item.address_title === 'Home' ? 'home' : item.address_title === 'Work' || item.address_title === 'Office' ? 'briefcase' : 'map-marker'} 
                                            size={20} 
                                            color={selectedAddress?.id === item.id ? theme.colors.primary : theme.colors.textSecondary} 
                                        />
                                    </View>
                                    <View style={styles.addressDetails}>
                                        <Text style={[
                                            styles.addressType, 
                                            { color: selectedAddress?.id === item.id ? theme.colors.primary : theme.colors.text }
                                        ]}>
                                            {item.address_title || 'Address'}
                                        </Text>
                                        <Text style={[styles.addressText, { color: theme.colors.textSecondary }]} numberOfLines={1}>
                                            {item.full_address}
                                        </Text>
                                    </View>

                                    {selectedAddress?.id === item.id && (
                                        <Icon name="check-circle" size={20} color={theme.colors.primary} />
                                    )}
                                </TouchableOpacity>
                            )}
                            ListEmptyComponent={
                                <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No saved addresses</Text>
                            }
                        />
                    </View>

                    <TouchableOpacity 
                        style={[styles.addAddressButton, { borderColor: theme.colors.primary }]}
                        onPress={() => {
                            onClose();
                            onSelectAddress('NEW');
                        }}
                    >
                        <Icon name="plus" size={20} color={theme.colors.primary} />
                        <Text style={[styles.addAddressText, { color: theme.colors.primary }]}>Add New Address</Text>
                    </TouchableOpacity>
                    
                    <View style={{ height: 40 }} />
                </View>
            </Pressable>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    sheet: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        paddingHorizontal: 20,
        maxHeight: height * 0.7,
    },
    handle: {
        width: 40,
        height: 5,
        borderRadius: 2.5,
        alignSelf: 'center',
        marginTop: 12,
        marginBottom: 20,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    currentLocationRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
    },
    iconCircle: {
        width: 48,
        height: 48,
        borderRadius: 24,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 16,
    },
    currentLocationText: {
        flex: 1,
    },
    rowTitle: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    rowSub: {
        fontSize: 13,
        marginTop: 2,
    },
    savedSection: {
        marginTop: 24,
        flexShrink: 1,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        textTransform: 'uppercase',
        marginBottom: 12,
        letterSpacing: 0.5,
    },
    addressRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
    },
    iconContainer: {
        width: 32,
        alignItems: 'center',
        marginRight: 12,
    },
    addressDetails: {
        flex: 1,
    },
    addressType: {
        fontSize: 15,
        fontWeight: '600',
    },
    addressText: {
        fontSize: 12,
        marginTop: 2,
    },
    addAddressButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderRadius: 12,
        padding: 14,
        marginTop: 24,
    },
    addAddressText: {
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
    emptyText: {
        textAlign: 'center',
        padding: 20,
        fontSize: 14,
    }
});

export default LocationModal;
