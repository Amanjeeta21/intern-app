import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
    Dimensions,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import ErrorMessage from "../../components/ErrorMessage";
import LoadingScreen from "../../components/LoadingScreen";

import { Colors } from "../../constants/colors";
import { useFavorites } from "../../hooks/useFavorites";
import { getProductById } from "../../services/productService";
import { Product } from "../../types/product";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [retryCount, setRetryCount] = useState(0);

  const { isFavorite, toggleFavorite } = useFavorites();

  useEffect(() => {
    let active = true;

    async function loadProduct() {
      try {
        setLoading(true);
        setError("");

        const data = await getProductById(Number(id));

        if (active) {
          setProduct(data);
          setSelectedImage(0);
        }
      } catch (err) {
        if (active) {
          setError(
            err instanceof Error ? err.message : "Unable to load product.",
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    if (id) {
      loadProduct();
    }

    return () => {
      active = false;
    };
  }, [id, retryCount]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (error || !product) {
    return (
      <ErrorMessage
        message={error || "Product not found."}
        onRetry={() => setRetryCount((count) => count + 1)}
      />
    );
  }

  const images =
    product.images?.length > 0 ? product.images : [product.thumbnail];

  const favorite = isFavorite(product.id);

  const discountedPrice = (
    product.price *
    (1 - product.discountPercentage / 100)
  ).toFixed(2);

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topBar}>
          <Pressable onPress={() => router.back()} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={23} color={Colors.text} />
          </Pressable>

          <Text style={styles.topTitle}>PRODUCT DETAILS</Text>

          <Pressable
            onPress={() => void toggleFavorite(product.id)}
            style={styles.iconButton}
          >
            <Ionicons
              name={favorite ? "heart" : "heart-outline"}
              size={24}
              color={favorite ? Colors.accent : Colors.text}
            />
          </Pressable>
        </View>

        <View style={styles.gallery}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(event) => {
              const index = Math.round(
                event.nativeEvent.contentOffset.x / SCREEN_WIDTH,
              );
              setSelectedImage(index);
            }}
          >
            {images.map((image, index) => (
              <View key={`${image}-${index}`} style={styles.imageSlide}>
                <Image
                  source={{ uri: image }}
                  style={styles.productImage}
                  resizeMode="contain"
                />
              </View>
            ))}
          </ScrollView>

          <View style={styles.dots}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  selectedImage === index && styles.activeDot,
                ]}
              />
            ))}
          </View>

          <View style={styles.discountBadge}>
            <Text style={styles.discountText}>
              {Math.round(product.discountPercentage)}% OFF
            </Text>
          </View>
        </View>

        <View style={styles.details}>
          <Text style={styles.brand}>{product.brand || product.category}</Text>

          <Text style={styles.title}>{product.title}</Text>

          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>★ {product.rating.toFixed(1)}</Text>
            <Text style={styles.ratingLabel}>Customer Rating</Text>
          </View>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>PRICE</Text>

          <View style={styles.priceRow}>
            <Text style={styles.discountedPrice}>${discountedPrice}</Text>

            <Text style={styles.originalPrice}>
              ${product.price.toFixed(2)}
            </Text>

            <Text style={styles.discountPercentage}>
              ({Math.round(product.discountPercentage)}% OFF)
            </Text>
          </View>

          <Text style={styles.taxText}>Inclusive of applicable taxes</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>PRODUCT DESCRIPTION</Text>

          <Text style={styles.description}>{product.description}</Text>

          <View style={styles.divider} />

          <Text style={styles.sectionTitle}>PRODUCT INFORMATION</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Category</Text>
            <Text style={styles.infoValue}>{product.category}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Brand</Text>
            <Text style={styles.infoValue}>
              {product.brand || "Not specified"}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Availability</Text>
            <Text style={styles.infoValue}>
              {product.availabilityStatus ||
                (product.stock > 0 ? "In Stock" : "Out of Stock")}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Stock</Text>
            <Text style={styles.infoValue}>{product.stock} units</Text>
          </View>

          {product.shippingInformation && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Shipping</Text>
              <Text style={styles.infoValue}>
                {product.shippingInformation}
              </Text>
            </View>
          )}

          {product.warrantyInformation && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Warranty</Text>
              <Text style={styles.infoValue}>
                {product.warrantyInformation}
              </Text>
            </View>
          )}

          {product.returnPolicy && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Returns</Text>
              <Text style={styles.infoValue}>{product.returnPolicy}</Text>
            </View>
          )}

          <View style={styles.bottomSpace} />
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable
          style={styles.wishlistButton}
          onPress={() => void toggleFavorite(product.id)}
        >
          <Ionicons
            name={favorite ? "heart" : "heart-outline"}
            size={20}
            color={favorite ? Colors.accent : Colors.text}
          />
          <Text style={styles.wishlistText}>
            {favorite ? "SAVED" : "WISHLIST"}
          </Text>
        </Pressable>

        <View style={styles.stockButton}>
          <Text style={styles.stockButtonText}>
            {product.stock > 0 ? "PRODUCT DETAILS" : "OUT OF STOCK"}
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  topBar: {
    height: 55,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  topTitle: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  gallery: {
    position: "relative",
    backgroundColor: "#202020",
  },
  imageSlide: {
    width: SCREEN_WIDTH,
    height: 370,
    alignItems: "center",
    justifyContent: "center",
  },
  productImage: {
    width: "100%",
    height: "100%",
  },
  dots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 12,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#666666",
  },
  activeDot: {
    width: 18,
    backgroundColor: Colors.accent,
  },
  discountBadge: {
    position: "absolute",
    bottom: 40,
    left: 14,
    backgroundColor: Colors.accent,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 5,
  },
  discountText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 11,
  },
  details: {
    padding: 18,
  },
  brand: {
    color: Colors.text,
    fontSize: 21,
    fontWeight: "bold",
  },
  title: {
    color: Colors.muted,
    fontSize: 15,
    marginTop: 6,
    lineHeight: 22,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 14,
  },
  rating: {
    color: Colors.warning,
    fontWeight: "bold",
    fontSize: 14,
  },
  ratingLabel: {
    color: Colors.muted,
    fontSize: 12,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 19,
  },
  sectionTitle: {
    color: Colors.text,
    fontSize: 13,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 9,
  },
  discountedPrice: {
    color: Colors.text,
    fontSize: 23,
    fontWeight: "bold",
  },
  originalPrice: {
    color: Colors.muted,
    fontSize: 14,
    textDecorationLine: "line-through",
  },
  discountPercentage: {
    color: Colors.accent,
    fontSize: 13,
    fontWeight: "bold",
  },
  taxText: {
    color: Colors.muted,
    fontSize: 11,
    marginTop: 7,
  },
  description: {
    color: Colors.muted,
    fontSize: 14,
    lineHeight: 23,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingVertical: 11,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: {
    color: Colors.muted,
    fontSize: 12,
    flex: 1,
  },
  infoValue: {
    color: Colors.text,
    fontSize: 12,
    flex: 1,
    textAlign: "right",
  },
  bottomSpace: {
    height: 20,
  },
  bottomBar: {
    flexDirection: "row",
    paddingHorizontal: 14,
    paddingVertical: 12,
    backgroundColor: Colors.card,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  wishlistButton: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  wishlistText: {
    color: Colors.text,
    fontSize: 12,
    fontWeight: "bold",
  },
  stockButton: {
    flex: 1.4,
    height: 48,
    backgroundColor: Colors.accent,
    borderRadius: 7,
    alignItems: "center",
    justifyContent: "center",
  },
  stockButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },
});
