import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/ThemeContext';
import { useUser } from '../redux/UserContext';
import AddressCard from '../components/AddressCard';
import { ActivityIndicator } from 'react-native';

const AddressScreen = ({ navigation }) => {
    const { theme } = useTheme();
    const { addresses, setSelectedAddress, deleteAddress, addressLoading: loading } = useUser();

    const handleSelect = (address) => {
        setSelectedAddress(address);
        navigation.goBack();
    };

    const handleMenu = (address) => {
        Alert.alert(
            'Address Options',
            'Choose an action for this address',
            [
                { text: 'Edit', onPress: () => handleEdit(address) },
                { text: 'Delete', onPress: () => handleDelete(address.id), style: 'destructive' },
                { text: 'Cancel', style: 'cancel' },
            ]
        );
    };

    const handleEdit = (address) => {
        navigation.navigate('AddAddressScreen', { editAddress: address });
    };

    const handleDelete = (id) => {
        deleteAddress(id);
    };

    return (
        <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Icon name="arrow-left" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Manage Addresses</Text>
            </View>

            {loading ? (
                <View style={[styles.emptyContainer, { flex: 1 }]}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : (
                <FlatList
                    data={addresses?.filter(addr => !!addr) || []}
                    keyExtractor={(item) => item.id.toString()}
                    contentContainerStyle={styles.listContent}
                    renderItem={({ item }) => (
                        <AddressCard 
                            address={item} 
                            onSelect={() => handleSelect(item)}
                            onEdit={() => handleMenu(item)}
                        />
                    )}
                    ListEmptyComponent={
                        <View style={styles.emptyContainer}>
                            <Icon name="map-marker-off" size={64} color={theme.colors.textSecondary} />
                            <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                                No saved addresses found
                            </Text>
                        </View>
                    }
                />
            )}

            <View style={[styles.footer, { backgroundColor: theme.colors.background }]}>
                <TouchableOpacity 
                    style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
                    onPress={() => navigation.navigate('AddAddressScreen')}
                >
                    <Icon name="plus" size={24} color="#fff" />
                    <Text style={styles.addButtonText}>Add New Address</Text>
                </TouchableOpacity>
            </View>
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
        borderBottomColor: '#f0f0f0',
    },
    backButton: {
        padding: 4,
        marginRight: 12,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    listContent: {
        padding: 16,
        paddingBottom: 100,
    },
    emptyContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 100,
    },
    emptyText: {
        marginTop: 16,
        fontSize: 16,
    },
    footer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: 16,
        borderTopWidth: 1,
        borderTopColor: '#f0f0f0',
        elevation: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    addButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        borderRadius: 12,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 8,
    },
});

export default AddressScreen;
