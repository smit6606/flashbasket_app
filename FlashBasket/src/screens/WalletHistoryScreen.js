import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useTheme } from '../constants/ThemeContext';
import { useUser } from '../redux/UserContext';

const TransactionItem = ({ title, date, amount, type, theme, isLast }) => (
  <View style={[styles.transactionItem, { borderBottomColor: theme.colors.border, borderBottomWidth: isLast ? 0 : 1 }]}>
    <View style={[styles.iconBox, { backgroundColor: type === 'CREDIT' ? '#E8F5E9' : '#FFEBEE' }]}>
      <Icon 
        name={type === 'CREDIT' ? 'plus' : 'minus'} 
        size={20} 
        color={type === 'CREDIT' ? '#4CAF50' : '#F44336'} 
      />
    </View>
    <View style={styles.transactionInfo}>
      <Text style={[styles.transactionTitle, { color: theme.colors.text }]}>{title}</Text>
      <Text style={[styles.transactionDate, { color: theme.colors.textSecondary }]}>{date}</Text>
    </View>
    <Text style={[styles.transactionAmount, { color: type === 'CREDIT' ? '#4CAF50' : theme.colors.text }]}>
      {type === 'CREDIT' ? '+' : '-'} ₹{amount}
    </Text>
  </View>
);

const WalletHistoryScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { wallet } = useUser();

  const transactions = wallet?.transactions || [];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Wallet History</Text>
      </View>

      {transactions.length > 0 ? (
        <FlatList
          data={transactions}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item, index }) => (
            <TransactionItem
              title={item.description}
              date={new Date(item.createdAt).toLocaleDateString()}
              amount={item.amount}
              type={item.type?.toUpperCase()}
              theme={theme}
              isLast={index === transactions.length - 1}
            />
          )}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Icon name="history" size={64} color={theme.colors.border} />
          <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>No transactions found</Text>
        </View>
      )}
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
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  transactionDate: {
    fontSize: 12,
    marginTop: 4,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    marginTop: 16,
    fontSize: 16,
  },
});

export default WalletHistoryScreen;
