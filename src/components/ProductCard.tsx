import { Image, Pressable, StyleSheet, Text, View } from "react-native";

import { Colors } from "../constants/colors";
import { Product } from "../types/product";

interface ProductCardProps {
  product: Product;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  onPress: () => void;
}

export default function ProductCard({
  product,
  isFavorite,
  onToggleFavorite,
  onPress,
}: ProductCardProps) {
  const discountedPrice = (
    product.price *
    (1 - product.discountPercentage / 100)
  ).toFixed(2);

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Pressable onPress={onPress}>
          <Image
            source={{ uri: product.thumbnail }}
            style={styles.image}
            resizeMode="cover"
          />
        </Pressable>

        <View style={styles.discountBadge}>
          <Text style={styles.discountText}>
            {Math.round(product.discountPercentage)}% OFF
          </Text>
        </View>

        <Pressable
          onPress={onToggleFavorite}
          style={styles.favoriteButton}
          accessibilityRole="button"
          accessibilityLabel={
            isFavorite ? "Remove from favorites" : "Add to favorites"
          }
        >
          <Text style={[styles.heart, isFavorite && styles.activeHeart]}>
            {isFavorite ? "♥" : "♡"}
          </Text>
        </Pressable>
      </View>

      <Pressable onPress={onPress} style={styles.details}>
        <Text style={styles.brand} numberOfLines={1}>
          {product.brand || product.category}
        </Text>

        <Text style={styles.title} numberOfLines={2}>
          {product.title}
        </Text>

        <View style={styles.priceRow}>
          <Text style={styles.price}>${discountedPrice}</Text>

          <Text style={styles.oldPrice}>${product.price.toFixed(2)}</Text>
        </View>

        <Text style={styles.rating}>★ {product.rating.toFixed(1)}</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flex: 1,
    marginBottom: 18,
    backgroundColor: Colors.card,
    borderRadius: 10,
    overflow: "hidden",
  },
  imageContainer: {
    position: "relative",
    backgroundColor: Colors.secondary,
  },
  image: {
    width: "100%",
    aspectRatio: 0.75,
  },
  discountBadge: {
    position: "absolute",
    bottom: 9,
    left: 8,
    backgroundColor: Colors.accent,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
  },
  discountText: {
    color: "#FFFFFF",
    fontSize: 10,
    fontWeight: "bold",
  },
  favoriteButton: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
  },
  heart: {
    fontSize: 23,
    color: "#333333",
  },
  activeHeart: {
    color: Colors.accent,
  },
  details: {
    padding: 10,
  },
  brand: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "bold",
  },
  title: {
    color: Colors.muted,
    fontSize: 12,
    marginTop: 4,
    minHeight: 32,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    marginTop: 8,
    flexWrap: "wrap",
  },
  price: {
    color: Colors.text,
    fontSize: 14,
    fontWeight: "bold",
  },
  oldPrice: {
    color: Colors.muted,
    fontSize: 11,
    textDecorationLine: "line-through",
  },
  rating: {
    color: Colors.warning,
    fontSize: 11,
    marginTop: 6,
  },
});
