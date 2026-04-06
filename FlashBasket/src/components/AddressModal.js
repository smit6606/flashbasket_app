import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Dimensions,
  Animated,
  Pressable
} from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

const AddressModal = ({ visible, onClose, addresses, onSelect, onEdit, onDelete, onAdd }) => {
  const { theme, isDark } = useTheme();

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          <View style={styles.header}>
            <View style={styles.headerIndicator} />
            <View style={styles.headerTop}>
              <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Choose Address</Text>
              <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
                <Icon name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {addresses.filter(addr => !!addr).map((addr) => (
              <TouchableOpacity
                key={addr.id}
                style={[
                  styles.addressCard,
                  { 
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.border 
                  }
                ]}
                onPress={() => onSelect(addr)}
              >
                <View style={styles.addressHeader}>
                  <View style={styles.addressTitleContainer}>
                    <Icon 
                      name={addr.type?.toLowerCase() === 'home' ? 'home' : 'business'} 
                      size={20} 
                      color={theme.colors.primary} 
                    />
                    <Text style={[styles.addressTitle, { color: theme.colors.text }]}>
                      {addr.name || 'Other'}
                    </Text>
                  </View>
                  <View style={styles.addressActions}>
                    <TouchableOpacity onPress={() => onEdit(addr)} style={styles.actionIcon}>
                      <Icon name="pencil" size={18} color={theme.colors.textSecondary} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onDelete(addr.id)} style={styles.actionIcon}>
                      <Icon name="trash" size={18} color="#FF4D4D" />
                    </TouchableOpacity>
                  </View>
                </View>
                <Text style={[styles.addressText, { color: theme.colors.textSecondary }]} numberOfLines={2}>
                  {addr.fullAddress}
                </Text>
                <Text style={[styles.phoneNumber, { color: theme.colors.textSecondary }]}>
                  {addr.phone || '9********9'}
                </Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity 
              style={[
                styles.addBtn, 
                { borderStyle: 'dashed', borderColor: theme.colors.primary, backgroundColor: theme.colors.primary + '10' }
              ]}
              onPress={onAdd}
            >
              <Icon name="add-circle" size={24} color={theme.colors.primary} />
              <Text style={[styles.addBtnText, { color: theme.colors.primary }]}>Add New Address</Text>
            </TouchableOpacity>
            
            <View style={{ height: 40 }} />
          </ScrollView>
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
  modalContainer: {
    height: SCREEN_HEIGHT * 0.7,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
  },
  header: {
    alignItems: 'center',
    paddingBottom: 16,
  },
  headerIndicator: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    marginBottom: 16,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  closeBtn: {
    padding: 4,
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  addressCard: {
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  addressTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  addressTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
  addressActions: {
    flexDirection: 'row',
  },
  actionIcon: {
    marginLeft: 16,
  },
  addressText: {
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 4,
  },
  phoneNumber: {
    fontSize: 13,
    fontWeight: '500',
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    marginTop: 8,
  },
  addBtnText: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
  },
});

export default AddressModal;
