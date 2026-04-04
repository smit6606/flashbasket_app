import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const QuickOption = ({ amount, onPress, theme }) => (
  <TouchableOpacity 
    style={[styles.quickOption, { borderColor: theme.colors.border }]} 
    onPress={() => onPress(amount)}
  >
    <Text style={[styles.quickOptionText, { color: theme.colors.text }]}>+ ₹{amount}</Text>
  </TouchableOpacity>
);

const AddMoneyModal = ({ visible, onClose, onAdd, theme }) => {
  const [amount, setAmount] = useState('');

  const handleQuickAdd = (value) => {
    setAmount(value.toString());
  };

  const handleAdd = () => {
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount > 0) {
      onAdd(numAmount);
      setAmount('');
      onClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.modalOverlay}
      >
        <TouchableOpacity style={styles.dismissOverlay} onPress={onClose} activeOpacity={1} />
        <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
          <View style={styles.dragHandle} />
          
          <View style={styles.header}>
            <Text style={[styles.title, { color: theme.colors.text }]}>Add Money to Wallet</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close" size={24} color={theme.colors.textSecondary} />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Enter Amount (₹)</Text>
            <View style={[styles.inputWrapper, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.currencyPrefix, { color: theme.colors.text }]}>₹</Text>
              <TextInput
                style={[styles.input, { color: theme.colors.text }]}
                value={amount}
                onChangeText={setAmount}
                keyboardType="numeric"
                placeholder="0"
                placeholderTextColor={theme.colors.textSecondary}
                autoFocus
              />
            </View>

            <View style={styles.quickOptionsRow}>
              <QuickOption amount={100} onPress={handleQuickAdd} theme={theme} />
              <QuickOption amount={500} onPress={handleQuickAdd} theme={theme} />
              <QuickOption amount={1000} onPress={handleQuickAdd} theme={theme} />
            </View>

            <TouchableOpacity 
              style={[styles.addButton, { backgroundColor: theme.colors.primary, opacity: amount ? 1 : 0.6 }]}
              onPress={handleAdd}
              disabled={!amount}
            >
              <Text style={styles.addButtonText}>Add ₹{amount || '0'}</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  dismissOverlay: {
    flex: 1,
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    paddingTop: 12,
    maxHeight: '60%',
  },
  dragHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: '500',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 16,
    paddingHorizontal: 16,
    height: 60,
    marginBottom: 20,
  },
  currencyPrefix: {
    fontSize: 24,
    fontWeight: 'bold',
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 24,
    fontWeight: 'bold',
  },
  quickOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  quickOption: {
    flex: 0.3,
    height: 48,
    borderWidth: 1,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quickOptionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  addButton: {
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  addButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddMoneyModal;
