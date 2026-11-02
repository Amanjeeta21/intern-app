import React, { useState } from "react";
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
  const [showDetails, setShowDetails] = useState(false);

  const handlePress = () => {
    Alert.alert("Hello " + name);
    setShowDetails((previous) => !previous);
  };

  return (
    <View style={styles.card}>
      <Image source={photoUrl} style={styles.photo} />

      <Text style={styles.name}>{name}</Text>

      <Text style={styles.role}>{role}</Text>

      <Pressable style={styles.button} onPress={handlePress}>
        <Text style={styles.buttonText}>Say Hello !</Text>
      </Pressable>

      {showDetails && (
        <View style={styles.detailsContainer}>
          <Text style={styles.detailsHeading}>Hello {name}!</Text>

          <View style={styles.divider} />

          <Text style={styles.detailText}>
            <Text style={styles.label}>Name: </Text>
            Amanjeeta
          </Text>

          <Text style={styles.detailText}>
            <Text style={styles.label}>Age: </Text>
            20
          </Text>

          <Text style={styles.detailText}>
            <Text style={styles.label}>Contact Mail: </Text>
            amanjeeta.r@gmail.com
          </Text>

          <Text style={styles.detailText}>
            <Text style={styles.label}>Position: </Text>
            Software Intern
          </Text>

          <Text style={styles.detailText}>
            <Text style={styles.label}>Organization: </Text>
            Quantek Solution
          </Text>
        </View>
      )}
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

  detailsContainer: {
    width: "100%",
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f1f5f9",
    borderRadius: 12,
  },

  detailsHeading: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222222",
    textAlign: "center",
    marginBottom: 12,
  },

  divider: {
    height: 1,
    backgroundColor: "#cccccc",
    marginBottom: 12,
  },

  detailText: {
    fontSize: 14,
    color: "#444444",
    marginBottom: 10,
  },

  label: {
    fontWeight: "bold",
    color: "#222222",
  },
});

export default ProfileCard;
