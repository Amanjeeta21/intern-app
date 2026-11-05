import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import EmptyState from "../../components/EmptyState";
import ErrorMessage from "../../components/ErrorMessage";
import LoadingScreen from "../../components/LoadingScreen";
import ProductCard from "../../components/ProductCard";

import { Colors } from "../../constants/colors";
import { useFavorites } from "../../hooks/useFavorites";
import { getProducts } from "../../services/productService";
import { Product } from "../../types/product";

export default function ProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { isFavorite, toggleFavorite } = useFavorites();

  const fetchProducts = useCallback(async () => {
    try {
      setError("");

      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(new Set(products.map((product) => product.category))),
    ];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.title.toLowerCase().includes(search.toLowerCase()) ||
        product.brand?.toLowerCase().includes(search.toLowerCase()) ||
        product.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        selectedCategory === "All" || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, search, selectedCategory]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchProducts();
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error && products.length === 0) {
    return (
      <ErrorMessage
        message={error}
        onRetry={() => {
          setLoading(true);
          fetchProducts();
        }}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={Colors.accent}
          />
        }
        ListHeaderComponent={
          <View>
            <Text style={styles.brandHeading}>PRODUCT CATALOG</Text>
            <Text style={styles.heading}>Discover Products</Text>
            <Text style={styles.subtitle}>Find something you love.</Text>

            <TextInput
              style={styles.search}
              placeholder="Search products, brands..."
              placeholderTextColor={Colors.muted}
              value={search}
              onChangeText={setSearch}
            />

            {search.length > 0 && (
              <Pressable onPress={() => setSearch("")}>
                <Ionicons name="close-circle" size={22} color="#A1A1AA" />
              </Pressable>
            )}

            <Text style={styles.sectionTitle}>CATEGORIES</Text>

            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item}
              contentContainerStyle={styles.categoryList}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => setSelectedCategory(item)}
                  style={[
                    styles.categoryButton,
                    selectedCategory === item && styles.selectedCategory,
                  ]}
                >
                  <Text
                    style={[
                      styles.categoryText,
                      selectedCategory === item && styles.selectedCategoryText,
                    ]}
                  >
                    {item.toUpperCase()}
                  </Text>
                </Pressable>
              )}
            />

            <View style={styles.productsHeading}>
              <Text style={styles.sectionTitle}>ALL PRODUCTS</Text>
              <Text style={styles.count}>{filteredProducts.length} items</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          <EmptyState
            title="No Products Found"
            message="Try another search or category."
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
  brandHeading: {
    color: Colors.accent,
    fontSize: 18,
    textAlign: "center",
    fontWeight: "900",
    letterSpacing: 3,
    marginTop: 16,
  },
  heading: {
    color: Colors.text,
    fontSize: 27,
    fontWeight: "bold",
    marginTop: 8,
  },
  subtitle: {
    color: Colors.muted,
    fontSize: 14,
    marginTop: 5,
  },
  search: {
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 13,
    color: Colors.text,
    marginTop: 20,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "bold",
    letterSpacing: 1,
    marginTop: 14,
  },
  categoryList: {
    gap: 8,
    paddingVertical: 13,
  },
  categoryButton: {
    backgroundColor: Colors.card,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  selectedCategory: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  categoryText: {
    color: Colors.muted,
    fontSize: 10,
    fontWeight: "bold",
  },
  selectedCategoryText: {
    color: "#FFFFFF",
  },
  productsHeading: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
    marginBottom: 14,
  },
  count: {
    color: Colors.muted,
    fontSize: 12,
  },
});
