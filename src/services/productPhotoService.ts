import AsyncStorage from "@react-native-async-storage/async-storage";

const PHOTO_KEY_PREFIX = "@product_catalog_photo_";

export async function getProductPhoto(
  productId: number,
): Promise<string | null> {
  return AsyncStorage.getItem(`${PHOTO_KEY_PREFIX}${productId}`);
}

export async function saveProductPhoto(
  productId: number,
  uri: string,
): Promise<void> {
  await AsyncStorage.setItem(`${PHOTO_KEY_PREFIX}${productId}`, uri);
}

export async function removeProductPhoto(productId: number): Promise<void> {
  await AsyncStorage.removeItem(`${PHOTO_KEY_PREFIX}${productId}`);
}
