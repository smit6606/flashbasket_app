import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Animated, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import WalletCard from '../components/WalletCard';
import AddMoneyModal from '../components/AddMoneyModal';
import FAQAccordion from '../components/FAQAccordion';
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

const WalletScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { wallet, walletLoading, addMoneyToWallet } = useUser();
  const [modalVisible, setModalVisible] = useState(false);
  const [addingMoney, setAddingMoney] = useState(false);

  const handleAddMoney = async (amount) => {
    setAddingMoney(true);
    try {
      await addMoneyToWallet(amount);
      setModalVisible(false);
    } catch (error) {
      alert('Failed to add money: ' + error.message);
    } finally {
      setAddingMoney(false);
    }
  };

  const walletFaqs = [
    {
      question: "How does Flash Wallet work?",
      answer: "Flash Wallet is a secure digital wallet that lets you store money for faster checkouts."
    },
    {
      question: "Is wallet money refundable?",
      answer: "Yes, the money you add to your wallet is fully refundable to your original payment source."
    }
  ];

  if (walletLoading && !wallet) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Icon name="arrow-left" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Flash Wallet</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <WalletCard balance={wallet?.balance || 0} theme={theme} />

        <View style={styles.actionContainer}>
          <TouchableOpacity 
            style={[styles.addMoneyBtn, { backgroundColor: theme.colors.primary }]}
            onPress={() => setModalVisible(true)}
            disabled={addingMoney}
          >
            {addingMoney ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : (
              <>
                <Icon name="plus" size={24} color="#FFF" />
                <Text style={styles.addMoneyText}>Add Money</Text>
              </>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Recent Transactions</Text>
            <TouchableOpacity>
               <Text style={[styles.viewAll, { color: theme.colors.primary }]}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {(wallet?.transactions || []).length > 0 ? (
            <View style={[styles.transactionCard, { backgroundColor: theme.colors.surface }]}>
              {wallet.transactions.slice(0, 5).map((tx, index) => (
                <TransactionItem 
                  key={tx.id}
                  title={tx.description}
                  date={new Date(tx.createdAt).toLocaleDateString()}
                  amount={tx.amount}
                  type={tx.type}
                  theme={theme}
                  isLast={index === (wallet.transactions.slice(0, 5).length - 1)}
                />
              ))}
            </View>
          ) : (
            <View style={styles.emptyTransactions}>
              <Icon name="history" size={48} color={theme.colors.border} />
              <Text style={{ marginTop: 12, color: theme.colors.textSecondary }}>No transactions yet</Text>
            </View>
          )}
        </View>

        <View style={styles.faqSection}>
           <Text style={[styles.sectionTitle, { color: theme.colors.text, marginLeft: 16, marginBottom: 12 }]}>Flash Wallet FAQs</Text>
           <FAQAccordion faqs={walletFaqs} />
        </View>
      </ScrollView>

      <AddMoneyModal 
        visible={modalVisible} 
        onClose={() => setModalVisible(false)} 
        onAdd={handleAddMoney}
        theme={theme}
      />
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
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  actionContainer: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  addMoneyBtn: {
    flexDirection: 'row',
    height: 56,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  addMoneyText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  section: {
    padding: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  viewAll: {
    fontSize: 14,
    fontWeight: '600',
  },
  transactionCard: {
    borderRadius: 24,
    padding: 8,
    paddingHorizontal: 16,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 15,
    fontWeight: '600',
  },
  transactionDate: {
    fontSize: 12,
    marginTop: 2,
  },
  transactionAmount: {
    fontSize: 15,
    fontWeight: 'bold',
  },
  emptyTransactions: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  faqSection: {
    marginTop: 8,
    paddingBottom: 40,
  },
});

export default WalletScreen;
