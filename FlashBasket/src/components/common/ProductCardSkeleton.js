import React from 'react';
import { View, StyleSheet } from 'react-native';
import Skeleton from './Skeleton';
import { useTheme } from '../../constants/ThemeContext';

const ProductCardSkeleton = () => {
  const { theme } = useTheme();

  return (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}>
      <View style={styles.imagePlaceholder}>
        <Skeleton width="100%" height="100%" borderRadius={16} />
      </View>
      <View style={styles.content}>
        <Skeleton width="80%" height={16} style={{ marginBottom: 8 }} />
        <Skeleton width="40%" height={12} style={{ marginBottom: 12 }} />
        <View style={styles.footer}>
          <View>
            <Skeleton width={50} height={20} />
          </View>
          <Skeleton width={70} height={32} borderRadius={10} />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    padding: 12,
    marginBottom: 16,
    marginHorizontal: 6,
    borderWidth: 1,
    flex: 1,
  },
  imagePlaceholder: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: 10,
  },
  content: {
    flex: 1,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 'auto',
  },
});

export default ProductCardSkeleton;
