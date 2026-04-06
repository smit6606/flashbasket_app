import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useTheme } from '../constants/ThemeContext';

const AddressForm = ({ initialData, onSubmit, onCancel }) => {
    const { theme } = useTheme();
    const [name, setName] = useState(initialData?.name || '');
    const [type, setType] = useState(initialData?.type || 'Home');
    const [fullAddress, setFullAddress] = useState(initialData?.fullAddress || '');
    const [landmark, setLandmark] = useState(initialData?.landmark || '');
    const [city, setCity] = useState(initialData?.city || '');
    const [pincode, setPincode] = useState(initialData?.pincode || '');
    const [phone, setPhone] = useState(initialData?.phone || '');

    const handleSubmit = () => {
        onSubmit({
            name: name || type,
            type,
            fullAddress,
            landmark,
            city,
            pincode,
            phone,
        });
    };

    const handleTypeSelect = (t) => {
        const types = ['Home', 'Office', 'Other', 'Work'];
        setType(t);
        // If name is empty or just matches an old type default, update it to the new type
        if (!name || types.includes(name)) {
            setName(t);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Save As</Text>
            <View style={styles.typeRow}>
                {['Home', 'Office', 'Other'].map((t) => (
                    <TouchableOpacity
                        key={t}
                        style={[
                            styles.typeChip,
                            { 
                                backgroundColor: type === t ? theme.colors.primaryLight : theme.colors.surface,
                                borderColor: type === t ? theme.colors.primary : 'transparent',
                                borderWidth: 1,
                            }
                        ]}
                        onPress={() => handleTypeSelect(t)}
                    >
                        <Text style={[
                            styles.typeText, 
                            { color: type === t ? theme.colors.primary : theme.colors.textSecondary }
                        ]}>
                            {t}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Address Name (Optional)</Text>
                <TextInput
                    style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
                    placeholder="E.g. Home, My Office..."
                    placeholderTextColor={theme.colors.textSecondary}
                    value={name}
                    onChangeText={setName}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Full Address</Text>
                <TextInput
                    style={[styles.input, styles.textArea, { borderColor: theme.colors.border, color: theme.colors.text }]}
                    placeholder="House No., Building Name, Street"
                    placeholderTextColor={theme.colors.textSecondary}
                    multiline
                    numberOfLines={3}
                    value={fullAddress}
                    onChangeText={setFullAddress}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Landmark</Text>
                <TextInput
                    style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
                    placeholder="Near Stellar IT Park"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={landmark}
                    onChangeText={setLandmark}
                />
            </View>

            <View style={styles.row}>
                <View style={[styles.inputContainer, { flex: 1, marginRight: 8 }]}>
                    <Text style={[styles.label, { color: theme.colors.textSecondary }]}>City</Text>
                    <TextInput
                        style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
                        placeholder="Noida"
                        placeholderTextColor={theme.colors.textSecondary}
                        value={city}
                        onChangeText={setCity}
                    />
                </View>
                <View style={[styles.inputContainer, { flex: 1, marginLeft: 8 }]}>
                    <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Pincode</Text>
                    <TextInput
                        style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
                        placeholder="201309"
                        placeholderTextColor={theme.colors.textSecondary}
                        keyboardType="numeric"
                        value={pincode}
                        onChangeText={setPincode}
                    />
                </View>
            </View>

            <View style={styles.inputContainer}>
                <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Mobile Number</Text>
                <TextInput
                    style={[styles.input, { borderColor: theme.colors.border, color: theme.colors.text }]}
                    placeholder="10 digit mobile number"
                    placeholderTextColor={theme.colors.textSecondary}
                    keyboardType="phone-pad"
                    maxLength={10}
                    value={phone}
                    onChangeText={setPhone}
                />
            </View>

            <TouchableOpacity 
                style={[styles.submitButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleSubmit}
            >
                <Text style={styles.submitButtonText}>Save Address</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                style={[styles.cancelButton]}
                onPress={onCancel}
            >
                <Text style={[styles.cancelButtonText, { color: theme.colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            
            <View style={{ height: 40 }} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 12,
        textTransform: 'uppercase',
    },
    typeRow: {
        flexDirection: 'row',
        marginBottom: 24,
    },
    typeChip: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
        marginRight: 10,
    },
    typeText: {
        fontWeight: 'bold',
    },
    inputContainer: {
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
    },
    label: {
        fontSize: 12,
        marginBottom: 8,
    },
    input: {
        borderWidth: 1,
        borderRadius: 10,
        padding: 12,
        fontSize: 16,
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    submitButton: {
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginTop: 10,
    },
    submitButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButton: {
        padding: 16,
        alignItems: 'center',
        marginTop: 5,
    },
    cancelButtonText: {
        fontSize: 14,
    },
});

export default AddressForm;
