import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useTheme } from '../../constants/ThemeContext';
import Animated, { FadeIn, ZoomIn, SlideInDown } from 'react-native-reanimated';

/**
 * Premium Error Modal for FlashBasket
 * Replaces the default Alert.alert with a polished, on-brand interface.
 */
const ErrorModal = ({ visible, title = "Error", message, onDismiss }) => {
  const { theme } = useTheme();

  if (!visible) return null;

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <Animated.View 
          entering={ZoomIn.duration(300)}
          style={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}
        >
          <View style={[styles.iconContainer, { backgroundColor: theme.colors.error + '15' }]}>
            <Icon name="alert-circle" size={40} color={theme.colors.error} />
          </View>

          <Text style={[styles.title, { color: theme.colors.text }]}>
            {title}
          </Text>
          
          <Text style={[styles.message, { color: theme.colors.textSecondary }]}>
            {message || "An unexpected error occurred. Please try again later."}
          </Text>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.colors.primary }]}
            onPress={onDismiss}
            activeOpacity={0.8}
          >
            <Text style={styles.buttonText}>Dismiss</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </Modal>
  );
};

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: width * 0.85,
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 10,
  },
  iconContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  message: {
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 10,
  },
  button: {
    width: '100%',
    height: 52,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default ErrorModal;
