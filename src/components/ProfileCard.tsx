import React from "react";
import {
    Alert,
    Image,
    ImageSourcePropType,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native";

interface ProfileCardProps {
  name: string;
  role: string;
  photoUrl: ImageSourcePropType;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ name, role, photoUrl }) => {
  return (
    <View style={styles.card}>
      <Image source={photoUrl} style={styles.photo} />

      <Text style={styles.name}>{name}</Text>

      <Text style={styles.role}>{role}</Text>

      <Pressable
        style={styles.button}
        onPress={() => Alert.alert("Hello " + name)}
      >
        <Text style={styles.buttonText}>Say Hello</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    padding: 20,
    borderRadius: 16,
    alignItems: "center",
    margin: 20,
    elevation: 4,
  },
  photo: {
    width: 110,
    height: 110,
    borderRadius: 55,
    marginBottom: 15,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#222222",
  },
  role: {
    fontSize: 16,
    color: "#666666",
    marginTop: 5,
    marginBottom: 15,
  },
  button: {
    backgroundColor: "#2563eb",
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: "#ffffff",
    fontWeight: "bold",
  },

  scrollView: {
    flex: 1,
    backgroundColor: "transparent",
  },
  scrollContent: {
    flexGrow: 1,
    alignItems: "center",
    gap: 12,
    paddingTop: 8,
    paddingBottom: 20,
  },
});

export default ProfileCard;
