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

import { ThemeColors } from "../../constants/colors";
import { useAppTheme } from "../../context/ThemeContext";
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
  const { theme, colors, toggleTheme } = useAppTheme();

  const themedStyles = useMemo(() => createStyles(colors), [colors]);

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
    <SafeAreaView style={themedStyles.container} edges={["top"]}>
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={themedStyles.row}
        contentContainerStyle={themedStyles.list}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={colors.accent}
          />
        }
        ListHeaderComponent={
          <View>
            <View style={themedStyles.topBar}>
              <Text style={themedStyles.brandHeading}>PRODUCT CATALOG</Text>

              <Pressable
                onPress={toggleTheme}
                style={themedStyles.themeButton}
                accessibilityRole="button"
                accessibilityLabel={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              >
                <Ionicons
                  name={theme === "dark" ? "sunny-outline" : "moon-outline"}
                  size={23}
                  color={colors.accent}
                />
              </Pressable>
            </View>

            <Text style={themedStyles.heading}>Discover Products</Text>
            <Text style={themedStyles.subtitle}>Find something you love.</Text>

            <View style={themedStyles.searchContainer}>
              <Ionicons name="search-outline" size={19} color={colors.muted} />

              <TextInput
                style={themedStyles.search}
                placeholder="Search products, brands..."
                placeholderTextColor={colors.muted}
                value={search}
                onChangeText={setSearch}
              />

              {search.length > 0 && (
                <Pressable onPress={() => setSearch("")}>
                  <Ionicons
                    name="close-circle"
                    size={22}
                    color={colors.muted}
                  />
                </Pressable>
              )}
            </View>

            <Text style={themedStyles.sectionTitle}>CATEGORIES</Text>

            <FlatList
              data={categories}
              horizontal
              showsHorizontalScrollIndicator={false}
              keyExtractor={(item) => item}
              contentContainerStyle={themedStyles.categoryList}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => setSelectedCategory(item)}
                  style={[
                    themedStyles.categoryButton,
                    selectedCategory === item && themedStyles.selectedCategory,
                  ]}
                >
                  <Text
                    style={[
                      themedStyles.categoryText,
                      selectedCategory === item &&
                        themedStyles.selectedCategoryText,
                    ]}
                  >
                    {item.toUpperCase()}
                  </Text>
                </Pressable>
              )}
            />

            <View style={themedStyles.productsHeading}>
              <Text style={themedStyles.sectionTitle}>ALL PRODUCTS</Text>
              <Text style={themedStyles.count}>
                {filteredProducts.length} items
              </Text>
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

function createStyles(colors: typeof ThemeColors.dark) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    list: {
      paddingHorizontal: 10,
      paddingBottom: 24,
      flexGrow: 1,
    },
    row: {
      gap: 12,
    },
    topBar: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      position: "relative",
      marginTop: 16,
    },
    themeButton: {
      position: "absolute",
      right: 4,
      padding: 9,
      borderRadius: 22,
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    brandHeading: {
      color: colors.accent,
      fontSize: 18,
      textAlign: "center",
      fontWeight: "900",
      fontStyle: "italic",
      letterSpacing: 3,
    },
    heading: {
      color: colors.text,
      fontSize: 27,
      fontWeight: "bold",
      marginTop: 8,
    },
    subtitle: {
      color: colors.muted,
      fontSize: 14,
      marginTop: 5,
    },
    searchContainer: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: colors.card,
      borderRadius: 10,
      paddingHorizontal: 13,
      marginTop: 20,
      borderWidth: 1,
      borderColor: colors.border,
    },
    search: {
      flex: 1,
      paddingHorizontal: 10,
      paddingVertical: 13,
      color: colors.text,
    },
    sectionTitle: {
      color: colors.text,
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
      backgroundColor: colors.card,
      borderRadius: 20,
      paddingHorizontal: 14,
      paddingVertical: 9,
      borderWidth: 1,
      borderColor: colors.border,
    },
    selectedCategory: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
    },
    categoryText: {
      color: colors.muted,
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
      color: colors.muted,
      fontSize: 12,
    },
  });
}
