import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Platform } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from 'react-native-geolocation-service';
import { request, PERMISSIONS } from 'react-native-permissions';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../constants/ThemeContext';
import ButtonPrimary from '../components/ButtonPrimary';
import Animated, { FadeIn, SlideInDown } from 'react-native-reanimated';

const MapScreen = ({ navigation, route }) => {
  const { theme } = useTheme();
  const mapRef = useRef(null);
  const [region, setRegion] = useState({
    latitude: 28.6139,
    longitude: 77.2090,
    latitudeDelta: 0.015,
    longitudeDelta: 0.0121,
  });
  const [address, setAddress] = useState('Fetching address...');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      await requestLocationPermission();
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestLocationPermission = async () => {
    const permission = Platform.OS === 'ios' ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION;
    const result = await request(permission);
    if (result === 'granted') {
      getCurrentPosition();
    } else {
      Alert.alert('Permission Denied', 'Location permission is required to fetch your current address.');
    }
  };

  const getCurrentPosition = () => {
    setLoading(true);
    Geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const newRegion = { ...region, latitude, longitude };
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
        fetchAddress(latitude, longitude);
        setLoading(false);
      },
      (error) => {
        console.error(error);
        setLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
    );
  };

  const fetchAddress = async (lat, lng) => {
    // In a real app, use Google Geocoding API or a similar service
    // For this premium demo, we'll simulate a fetch
    setAddress('C-12, Green Park, New Delhi, 110016');
  };

  const onRegionChangeComplete = (newRegion) => {
    setRegion(newRegion);
    fetchAddress(newRegion.latitude, newRegion.longitude);
  };

  const handleConfirm = () => {
    if (route.params?.onSelect) {
      route.params.onSelect({
        address,
        latitude: region.latitude,
        longitude: region.longitude
      });
    }
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={region}
        onRegionChangeComplete={onRegionChangeComplete}
      />

      {/* Floating Center Marker */}
      <View style={styles.markerFixed} pointerEvents="none">
        <Icon name="location" size={40} color={theme.colors.primary} />
      </View>

      {/* Back Button */}
      <TouchableOpacity 
        style={[styles.backBtn, { backgroundColor: theme.colors.surface }]}
        onPress={() => navigation.goBack()}
      >
        <Icon name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>

      {/* Address Card */}
      <Animated.View 
        entering={SlideInDown.duration(600)}
        style={[styles.addressCard, { backgroundColor: theme.colors.surface }]}
      >
        <View style={styles.handle} />
        <View style={styles.header}>
          <View style={[styles.iconBox, { backgroundColor: theme.colors.primary + '10' }]}>
            <Icon name="navigate" size={22} color={theme.colors.primary} />
          </View>
          <View style={styles.headerText}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Select Location</Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>Drag map to pin exact location</Text>
          </View>
        </View>

        <View style={[styles.addressBox, { borderColor: theme.palette?.divider || '#EEE' }]}>
          <Text style={[styles.addressText, { color: theme.colors.text }]}>{address}</Text>
        </View>

        <ButtonPrimary 
          title="Confirm Location" 
          onPress={handleConfirm}
          loading={loading}
          style={{ marginTop: 16 }}
        />
      </Animated.View>

      {/* My Location FAB */}
      <TouchableOpacity 
        style={[styles.myLocationFab, { backgroundColor: theme.colors.surface }]}
        onPress={getCurrentPosition}
      >
        <Icon name="locate" size={24} color={theme.colors.primary} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {
    flex: 1,
  },
  markerFixed: {
    left: '50%',
    marginLeft: -20,
    marginTop: -40,
    position: 'absolute',
    top: '50%',
    zIndex: 1,
  },
  backBtn: {
    position: 'absolute',
    top: 50,
    left: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addressCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: '#DDD',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconBox: {
    width: 46,
    height: 46,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  subtitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  addressBox: {
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    backgroundColor: 'rgba(0,0,0,0.02)',
  },
  addressText: {
    fontSize: 14,
    fontWeight: '600',
  },
  myLocationFab: {
    position: 'absolute',
    bottom: 300,
    right: 16,
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});

export default MapScreen;
