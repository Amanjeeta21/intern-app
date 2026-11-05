import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";

import {
  Alert,
  Dimensions,
  Image,
  Linking,
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
import {
  getProductPhoto,
  removeProductPhoto,
  saveProductPhoto,
} from "../../services/productPhotoService";
import { getProductById } from "../../services/productService";
import { Product } from "../../types/product";

const SCREEN_WIDTH = Dimensions.get("window").width;

export default function ProductDetailsScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  console.log("Product Details Route Opened. ID:", id);

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [personalPhoto, setPersonalPhoto] = useState<string | null>(null);

  const { isFavorite, toggleFavorite } = useFavorites();

  // Load product details
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

  // Load saved personal photo for this product
  useEffect(() => {
    if (!id) return;

    let isActive = true;

    const loadSavedPhoto = async () => {
      try {
        const savedPhoto = await getProductPhoto(Number(id));

        if (isActive) {
          setPersonalPhoto(savedPhoto);
        }
      } catch (error) {
        console.error("Error loading saved product photo:", error);
      }
    };

    loadSavedPhoto();

    return () => {
      isActive = false;
    };
  }, [id]);

  // Save selected photo
  const saveSelectedPhoto = async (uri: string) => {
    if (!product) return;

    try {
      await saveProductPhoto(product.id, uri);
      setPersonalPhoto(uri);
    } catch (error) {
      console.error("Error saving product photo:", error);
      Alert.alert("Error", "Unable to save the selected photo.");
    }
  };

  // Open camera
  const handleTakePhoto = async () => {
    try {
      const permission = await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Camera Permission Required",
          "Please allow Product Catalog to access your camera from Settings.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                void Linking.openSettings();
              },
            },
          ],
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        await saveSelectedPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Camera error:", error);
      Alert.alert("Error", "Unable to open the camera.");
    }
  };

  // Select photo from gallery
  const handleChooseFromGallery = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets.length > 0) {
        await saveSelectedPhoto(result.assets[0].uri);
      }
    } catch (error) {
      console.error("Gallery error:", error);
      Alert.alert("Error", "Unable to open the photo gallery.");
    }
  };

  // Remove saved personal photo
  const handleRemovePhoto = () => {
    if (!product) return;

    Alert.alert(
      "Remove Photo",
      "Are you sure you want to remove your saved product photo?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: async () => {
            try {
              await removeProductPhoto(product.id);
              setPersonalPhoto(null);
            } catch (error) {
              console.error("Error removing product photo:", error);
              Alert.alert("Error", "Unable to remove the photo.");
            }
          },
        },
      ],
    );
  };

  if (loading) {
    return <LoadingScreen message="Loading product details..." />;
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
        {/* Top navigation */}
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

        {/* Product image gallery */}
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

        {/* Personal product photo section */}
        <View style={styles.personalPhotoSection}>
          <Text style={styles.sectionTitle}>YOUR PRODUCT PHOTO</Text>

          {personalPhoto ? (
            <Image
              source={{ uri: personalPhoto }}
              style={styles.personalPhoto}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="image-outline" size={40} color={Colors.muted} />
              <Text style={styles.placeholderText}>
                No personal photo added yet
              </Text>
            </View>
          )}

          <View style={styles.photoButtonRow}>
            <Pressable
              style={styles.photoButton}
              onPress={() => void handleTakePhoto()}
            >
              <Ionicons name="camera-outline" size={19} color="#FFFFFF" />
              <Text style={styles.photoButtonText}>CAMERA</Text>
            </Pressable>

            <Pressable
              style={styles.photoButton}
              onPress={() => void handleChooseFromGallery()}
            >
              <Ionicons name="images-outline" size={19} color="#FFFFFF" />
              <Text style={styles.photoButtonText}>GALLERY</Text>
            </Pressable>
          </View>

          {personalPhoto && (
            <Pressable
              style={styles.removePhotoButton}
              onPress={handleRemovePhoto}
            >
              <Ionicons name="trash-outline" size={17} color={Colors.accent} />
              <Text style={styles.removePhotoText}>REMOVE PHOTO</Text>
            </Pressable>
          )}
        </View>

        {/* Product details */}
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

      {/* Bottom action bar */}
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

  // Personal photo styles
  personalPhotoSection: {
    padding: 18,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },

  personalPhoto: {
    width: "100%",
    height: 220,
    borderRadius: 10,
    backgroundColor: "#202020",
    marginBottom: 14,
  },

  photoPlaceholder: {
    height: 160,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderStyle: "dashed",
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 14,
  },

  placeholderText: {
    color: Colors.muted,
    fontSize: 13,
  },

  photoButtonRow: {
    flexDirection: "row",
    gap: 10,
  },

  photoButton: {
    flex: 1,
    height: 45,
    backgroundColor: Colors.accent,
    borderRadius: 7,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  photoButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "bold",
  },

  removePhotoButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 7,
    paddingTop: 15,
  },

  removePhotoText: {
    color: Colors.accent,
    fontSize: 11,
    fontWeight: "bold",
  },

  // Existing product detail styles
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
