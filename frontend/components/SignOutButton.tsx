import { useClerk } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import { Alert, Text, TouchableOpacity, View } from "react-native";

export const SignOutButton = () => {
  const { signOut } = useClerk();

  const handleSignOut = async () => {
    Alert.alert("Logout", "Are you sure want to logout?", [
      { text: "Cancel", style: "cancel" },
      { text: "Logout", style: "destructive", onPress: signOut },
    ]);
  };
  return (
    <View className="flex-1 my-20">
      <TouchableOpacity className="justify-center" onPress={handleSignOut}>
        <Ionicons name="log-out-outline" size={24} />
        {/* <Text>Sign out</Text> */}
      </TouchableOpacity>
    </View>
  );
};
