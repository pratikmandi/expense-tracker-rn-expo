import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { Link } from "expo-router";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SignOutButton } from "../../components/SignOutButton";
import { useTransactions } from "../../hooks/useTransactions.js";
import { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { SummaryCard } from "../../components/SummaryCard";
import { TransactionItem } from "../../components/TransactionItem";

export default function Page() {
  const { user } = useUser();
  const userId = user?.id;

  const { transactions, summary, isLoading, loadData, deleteTransaction } =
    useTransactions(userId);

  useEffect(() => {
    if (userId) loadData();
  }, [userId, loadData]);

  const handleDelete = (userId) => {
    Alert.alert(
      "Delete Transaction",
      "Are you sure you want to delete this transaction?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteTransaction(userId),
        },
      ]
    );
  };

  if (isLoading) return <ActivityIndicator />;

  return (
    <SafeAreaView className="bg-lime-50 flex-1">
      {/* Header */}
      <View className="flex-row">
        <View className="pl-4 py-16">
          <Image
            source={require("../../constants/images/walletLogo.png")}
            className="w-24 h-14"
            resizeMode="contain"
          />
        </View>
        <View className="py-16 ml-2">
          <Text className="text-[#56a411] text-xl">Welcome</Text>
          <Text className="font-semibold">
            {user?.emailAddresses[0].emailAddress.split("@")[0]}
          </Text>
        </View>
        <View className="px-8 ml-8 py-16">
          <TouchableOpacity className="flex-row gap-2 border-none bg-lime-400 rounded-full p-4 items-center">
            <Ionicons name="add-circle" size={20} />
            <Text className="font-semibold">Add</Text>
          </TouchableOpacity>
        </View>
        <SignOutButton />
      </View>
      {/* Summary */}
      <SummaryCard summary={summary} />

      <View className="pl-4 my-4">
        <Text className="font-semibold text-lg">Recent Transactions</Text>
      </View>

      <FlatList
        contentContainerStyle={{ paddingBottom: 20 }}
        data={transactions}
        renderItem={({ item }) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
      />
    </SafeAreaView>
  );
}
