import React from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import Skeleton from './Skeleton';
import { useTheme } from '../../constants/ThemeContext';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.44;

export const BannerSkeleton = () => (
  <View style={styles.bannerWrapper}>
    <Skeleton width={width - 32} height={width * 0.4} borderRadius={16} />
  </View>
);

export const CategoryItemSkeleton = () => (
  <View style={styles.categorySkeletonItem}>
    <Skeleton width={62} height={62} borderRadius={18} />
    <View style={{ marginTop: 8 }}>
      <Skeleton width={50} height={10} borderRadius={4} />
    </View>
  </View>
);

export const ProductCardSkeleton = ({ variant = 'previous' }) => {
  const { isDark } = useTheme();
  return (
    <View style={[
      styles.productCardSkeleton, 
      { 
        backgroundColor: isDark ? '#1A1A1A' : '#FFFFFF',
        borderColor: isDark ? '#2A2A2A' : '#E2E8F0',
        width: variant === 'previous' ? 170 : '100%'
      }
    ]}>
      {/* Image square */}
      <Skeleton width="100%" height={variant === 'previous' ? 100 : 85} borderRadius={8} />
      
      <View style={{ marginTop: 12, gap: 6 }}>
        {/* Title lines */}
        <Skeleton width="90%" height={12} borderRadius={4} />
        <Skeleton width="60%" height={12} borderRadius={4} />
        
        {/* Weight/Size */}
        <Skeleton width="40%" height={10} borderRadius={4} style={{ marginTop: 4 }} />
        
        <View style={styles.priceRowSkeleton}>
          {/* Price */}
          <Skeleton width="30%" height={16} borderRadius={4} />
          {/* Old Price */}
          <Skeleton width="20%" height={12} borderRadius={4} />
        </View>
      </View>
      
      {/* Button */}
      <View style={{ marginTop: 12 }}>
        <Skeleton width="100%" height={34} borderRadius={8} />
      </View>
    </View>
  );
};

export const SidebarItemSkeleton = () => (
    <View style={styles.sidebarItem}>
        <Skeleton width={40} height={40} borderRadius={10} />
        <View style={{ marginTop: 4 }}>
            <Skeleton width={30} height={8} borderRadius={4} />
        </View>
    </View>
);

export const HomeSkeleton = () => {
  const { theme } = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
      {/* Search Bar Skeleton */}
      <View style={styles.searchSkeleton}>
        <Skeleton width="100%" height={48} borderRadius={14} />
      </View>

      {/* Category Header */}
      <View style={styles.headerSkeleton}>
        <Skeleton width={150} height={20} borderRadius={4} />
      </View>

      {/* Categories Row */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
        {[1, 2, 3, 4, 5].map((i) => (
          <CategoryItemSkeleton key={i} />
        ))}
      </ScrollView>

      {/* Banner */}
      <BannerSkeleton />

      {/* Product Section Title */}
      <View style={styles.headerSkeleton}>
        <Skeleton width={120} height={22} borderRadius={4} />
      </View>

      {/* Product Horizontal List */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productScroll}>
        {[1, 2, 3].map((i) => (
          <ProductCardSkeleton key={i} variant="previous" />
        ))}
      </ScrollView>

      {/* Another Section */}
      <View style={styles.headerSkeleton}>
        <Skeleton width={140} height={22} borderRadius={4} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.productScroll}>
        {[1, 2, 3].map((i) => (
          <ProductCardSkeleton key={i} variant="previous" />
        ))}
      </ScrollView>
    </View>
  );
};

export const BuyAgainSkeleton = () => {
    const { theme } = useTheme();
    return (
        <View style={{ flex: 1, backgroundColor: theme.colors.background }}>
            <View style={styles.grid}>
                {[1,2,3,4,5,6].map(i => (
                    <View key={i} style={styles.gridItem}>
                        <ProductCardSkeleton variant="modern" />
                    </View>
                ))}
            </View>
        </View>
    );
};

export const CategoriesPageSkeleton = () => {
    return (
        <View style={styles.row}>
            {/* Sidebar */}
            <View style={styles.sidebar}>
                {[1,2,3,4,5,6,7,8].map(i => <SidebarItemSkeleton key={i} />)}
            </View>
            {/* Main Content */}
            <View style={styles.main}>
                <View style={styles.categoryHeader}>
                    <Skeleton width={120} height={20} borderRadius={4} />
                    <Skeleton width={60} height={16} borderRadius={4} />
                </View>
                <View style={styles.filterRow}>
                    <Skeleton width="45%" height={36} borderRadius={8} />
                    <Skeleton width="45%" height={36} borderRadius={8} />
                </View>
                <View style={styles.grid}>
                    {[1,2,3,4].map(i => (
                        <View key={i} style={styles.gridItem}>
                            <ProductCardSkeleton variant="modern" />
                        </View>
                    ))}
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
  bannerWrapper: {
    width: width,
    paddingHorizontal: 16,
    marginVertical: 12,
  },
  categorySkeletonItem: {
    alignItems: 'center',
    width: 70,
    marginRight: 16,
  },
  productCardSkeleton: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 5,
    minHeight: 210,
  },
  priceRowSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  searchSkeleton: {
    paddingHorizontal: 16,
    paddingTop: 8,
    marginBottom: 16,
  },
  headerSkeleton: {
    paddingHorizontal: 16,
    paddingTop: 16,
    marginBottom: 12,
  },
  categoryScroll: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  productScroll: {
    paddingHorizontal: 12,
    paddingBottom: 16,
  },
  row: { flexDirection: 'row', flex: 1 },
  sidebar: { width: 85, paddingVertical: 10, alignItems: 'center', borderRightWidth: 1, borderColor: '#eee' },
  sidebarItem: { marginBottom: 20, alignItems: 'center' },
  main: { flex: 1 },
  categoryHeader: { padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  filterRow: { flexDirection: 'row', paddingHorizontal: 12, justifyContent: 'space-between', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: 8 },
  gridItem: { width: '50%', padding: 4 },
});
