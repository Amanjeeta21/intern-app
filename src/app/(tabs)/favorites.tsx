import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { FlatList, RefreshControl, StyleSheet, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";
import LoadingScreen from "../../components/LoadingScreen";
import ProductCard from "../../components/ProductCard";

import { Colors } from "../../constants/colors";
import { useFavorites } from "../../hooks/useFavorites";
import { getProductById } from "../../services/productService";
import { Product } from "../../types/product";

export default function FavoritesScreen() {
  const { favorites, isLoading, isFavorite, toggleFavorite } = useFavorites();

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const loadFavoriteProducts = useCallback(async () => {
    if (isLoading) return;

    if (favorites.length === 0) {
      setProducts([]);
      setError("");
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const data = await Promise.all(favorites.map((id) => getProductById(id)));

      setProducts(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load favorites.",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [favorites, isLoading]);

  useEffect(() => {
    loadFavoriteProducts();
  }, [loadFavoriteProducts, retryCount]);

  if (isLoading || loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => setRetryCount((count) => count + 1)}
      />
    );
  }

  const visibleProducts = products.filter((product) =>
    favorites.includes(product.id),
  );

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={visibleProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              setRefreshing(true);
              loadFavoriteProducts();
            }}
            tintColor={Colors.accent}
          />
        }
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.heading}>MY WISHLIST</Text>
            <Text style={styles.subtitle}>
              {favorites.length} {favorites.length === 1 ? "item" : "items"}{" "}
              saved
            </Text>
            <View style={styles.divider} />
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="Your Wishlist is Empty"
            message="Save the products you love by tapping the heart icon."
          />
        }
        renderItem={({ item }) => (
          <ProductCard
            product={item}
            isFavorite={isFavorite(item.id)}
            onToggleFavorite={() => void toggleFavorite(item.id)}
            onPress={() =>
              router.push({
                pathname: "/product/[id]",
                params: { id: item.id.toString() },
              })
            }
          />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  list: {
    paddingHorizontal: 10,
    paddingBottom: 24,
    flexGrow: 1,
  },
  row: {
    gap: 12,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 18,
  },
  heading: {
    color: Colors.text,
    fontSize: 25,
    fontWeight: "900",
    letterSpacing: 1.2,
  },
  subtitle: {
    color: Colors.muted,
    fontSize: 13,
    marginTop: 6,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginTop: 17,
  },
});
