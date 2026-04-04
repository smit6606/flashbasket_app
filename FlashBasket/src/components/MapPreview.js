import React from 'react';
import { View, StyleSheet, Dimensions, Text } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/ThemeContext';

const { width } = Dimensions.get('window');

const MapPreview = () => {
    const { theme } = useTheme();

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.surface }]}>
            {/* Standard Placeholder for Map */}
            <View style={styles.gridOverlay}>
                {[...Array(10)].map((_, i) => (
                    <View key={i} style={[styles.gridLine, { left: i * (width / 10), borderLeftColor: theme.colors.border }]} />
                ))}
                {[...Array(6)].map((_, i) => (
                    <View key={i} style={[styles.gridLineHorizontal, { top: i * 50, borderTopColor: theme.colors.border }]} />
                ))}
            </View>

            <View style={styles.markerContainer}>
                <View style={[styles.markerCircle, { backgroundColor: theme.colors.primary }]}>
                    <Icon name="map-marker" size={30} color="#fff" />
                </View>
                <View style={[styles.markerShadow, { backgroundColor: 'rgba(0,0,0,0.1)' }]} />
            </View>

            <View style={styles.addressLabel}>
                <Text style={[styles.labelTitle, { color: theme.colors.text }]} numberOfLines={1}>
                    Sector 62, Noida
                </Text>
                <Text style={[styles.labelSub, { color: theme.colors.textSecondary }]}>
                    Gautam Buddha Nagar, UP
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 250,
        borderRadius: 16,
        overflow: 'hidden',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
    },
    gridOverlay: {
        ...StyleSheet.absoluteFillObject,
    },
    gridLine: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        borderLeftWidth: 1,
    },
    gridLineHorizontal: {
        position: 'absolute',
        left: 0,
        right: 0,
        borderTopWidth: 1,
    },
    markerContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    markerCircle: {
        width: 50,
        height: 50,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 8,
    },
    markerShadow: {
        width: 20,
        height: 5,
        borderRadius: 50,
        marginTop: 5,
    },
    addressLabel: {
        position: 'absolute',
        bottom: 20,
        backgroundColor: '#fff',
        padding: 10,
        borderRadius: 10,
        width: '80%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 4,
        alignItems: 'center',
    },
    labelTitle: {
        fontWeight: 'bold',
        fontSize: 14,
    },
    labelSub: {
        fontSize: 12,
    },
});

export default MapPreview;
