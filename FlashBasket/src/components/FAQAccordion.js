import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  LayoutAnimation, 
  Platform, 
  UIManager 
} from 'react-native';
import { useTheme } from '../constants/ThemeContext';
import Icon from 'react-native-vector-icons/Ionicons';

// LayoutAnimation is enabled by default in modern React Native or handled via Reanimated

const FAQAccordion = ({ faqs }) => {
  const { theme } = useTheme();
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleAccordion = (index) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>Frequently Asked Questions</Text>
      {faqs.map((faq, index) => (
        <View key={index} style={[styles.faqItem, { borderBottomColor: theme.colors.border }]}>
          <TouchableOpacity 
            style={styles.faqHeader} 
            onPress={() => toggleAccordion(index)}
            activeOpacity={0.7}
          >
            <Text style={[styles.question, { color: theme.colors.text }]}>{faq.question}</Text>
            <Icon 
              name={expandedIndex === index ? 'chevron-up' : 'chevron-down'} 
              size={20} 
              color={theme.colors.textSecondary} 
            />
          </TouchableOpacity>
          {expandedIndex === index && (
            <View style={styles.answerContainer}>
              <Text style={[styles.answer, { color: theme.colors.textSecondary }]}>
                {faq.answer}
              </Text>
            </View>
          )}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginTop: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  faqItem: {
    borderBottomWidth: 1,
  },
  faqHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  question: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    marginRight: 10,
  },
  answerContainer: {
    paddingBottom: 16,
  },
  answer: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default FAQAccordion;
