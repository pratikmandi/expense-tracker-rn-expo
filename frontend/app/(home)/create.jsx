import {
  View,
  Text,
  Alert,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

const CATEGORIES = [
  { id: "food", name: "Food & Drinks", icon: "fast-food" },
  { id: "shopping", name: "Shopping", icon: "cart" },
  { id: "transportation", name: "Transportation", icon: "car" },
  { id: "entertainment", name: "Entertainment", icon: "film" },
  { id: "bills", name: "Bills", icon: "receipt" },
  { id: "income", name: "Income", icon: "cash" },
  { id: "other", name: "Other", icon: "ellipsis-horizontal" },
];

const API_URL = "https://expense-wallet-00h3.onrender.com";

const CreateScreen = () => {
  const router = useRouter();
  const { user } = useUser();

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isExpense, setIsExpense] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleCreate = async () => {
    // validations
    if (!title.trim())
      return Alert.alert("Error", "Please enter a transaction title");
    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      Alert.alert("Error", "Please enter a valid amount");
      return;
    }

    if (!selectedCategory)
      return Alert.alert("Error", "Please select a category");

    setIsLoading(true);
    try {
      const formattedAmount = isExpense
        ? -Math.abs(parseFloat(amount))
        : Math.abs(parseFloat(amount));

      const response = await fetch(`${API_URL}/api/transactions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user.id,
          title,
          amount: formattedAmount,
          category: selectedCategory,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log(errorData);
        throw new Error(errorData.error || "Failed to create transaction");
      }

      Alert.alert("Success", "Transaction created successfully");
      router.back();
    } catch (error) {
      Alert.alert("Error", error.message || "Failed to create transaction");
      console.error("Error creating transaction:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-lime-50">
      {/* HEADER */}
      <View className="flex-row justify-between items-center px-5 py-3 border-lime-200">
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} />
        </TouchableOpacity>

        <Text className="font-semibold text-xl">New Transaction</Text>

        <TouchableOpacity
          onPress={handleCreate}
          disabled={isLoading}
          className="flex-row items-center gap-1"
        >
          <Text className="text-green-700 font-medium">
            {isLoading ? "Saving..." : "Save"}
          </Text>
          {!isLoading && <Ionicons name="checkmark" size={18} color="green" />}
        </TouchableOpacity>
      </View>

      {/* CARD */}
      <View className="bg-lime-200 mx-5 my-4 rounded-2xl p-5 shadow-sm border border-lime-200">
        {/* EXPENSE / INCOME SWITCH */}
        <View className="flex-row justify-between mb-6">
          <TouchableOpacity
            onPress={() => setIsExpense(true)}
            className={`flex-row items-center gap-2 px-6 py-2 rounded-full border 
            ${isExpense ? "bg-red-100 border-red-300" : "border-gray-500"}`}
          >
            <Ionicons name="arrow-down-circle" size={22} color="#DC2626" />
            <Text className="text-base text-red-700">Expense</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setIsExpense(false)}
            className={`flex-row items-center gap-2 px-6 py-2 rounded-full border 
            ${!isExpense ? "bg-green-100 border-green-300" : "border-gray-500"}`}
          >
            <Ionicons name="arrow-up-circle" size={22} color="#16A34A" />
            <Text className="text-base text-green-700">Income</Text>
          </TouchableOpacity>
        </View>

        {/* AMOUNT */}
        <View className="flex-row items-center mb-5 border-b border-gray-500 pb-2">
          <Text className="text-2xl font-bold mr-2 text-lime-700">$</Text>
          <TextInput
            placeholder="0.00"
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
            className="flex-1 text-xl font-semibold mb-2"
          />
        </View>

        {/* TITLE */}
        <View className="flex-row items-center gap-2 mb-5 border-b border-gray-500 pb-2">
          <Ionicons name="create-outline" size={22} color="#4B5563" />
          <TextInput
            placeholder="Transaction Title"
            value={title}
            onChangeText={setTitle}
            className="flex-1 text-md font-semibold mb-2"
          />
        </View>

        {/* CATEGORY TITLE */}
        <Text className="mb-2 font-semibold text-xl">
          <Ionicons name="pricetag-outline" size={16} /> Category
        </Text>

        {/* CATEGORY GRID */}
        <View className="flex-row flex-wrap gap-3 mt-1">
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              onPress={() => setSelectedCategory(cat.name)}
              className={`flex-row items-center gap-2 px-4 py-2 rounded-full border 
               ${
                 selectedCategory === cat.name
                   ? "border-lime-900 bg-green-200"
                   : "border-gray-500"
               }`}
            >
              <Ionicons name={cat.icon} size={18} />
              <Text>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {isLoading && (
        <View className="absolute inset-0 bg-black/20 justify-center items-center">
          <ActivityIndicator size="large" />
        </View>
      )}
    </SafeAreaView>
  );
};

export default CreateScreen;
