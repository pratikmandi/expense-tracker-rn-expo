import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";

const CATEGORY_ICONS = {
  "Food & Drinks": "fast-food",
  Shopping: "cart",
  Transportation: "car",
  Entertainment: "film",
  Bills: "receipt",
  Income: "cash",
  Other: "ellipsis-horizontal",
};

export const TransactionItem = ({ item, onDelete }) => {
  const isIncome = parseFloat(item.amount) > 0;
  const iconName = CATEGORY_ICONS[item.category] || "pricetag-outline";

  return (
    <View className="flex-row mx-5 mb-3 rounded-lg bg-lime-200 items-center p-3">
      {/* Category Icon */}
      <View className="w-10 h-10 rounded-full bg-white justify-center items-center mr-3">
        <Ionicons name={iconName} size={20} />
      </View>

      {/* Title + Category */}
      <View className="flex-1">
        <Text className="font-semibold text-base" numberOfLines={1}>
          {item.title}
        </Text>
        <Text className="text-gray-500 text-xs" numberOfLines={1}>
          {item.category}
        </Text>
      </View>

      {/* Amount + Date */}
      <View className="items-end mr-3">
        <Text
          className={`font-semibold text-base ${isIncome ? "text-green-600" : "text-red-600"}`}
        >
          {isIncome ? "+" : "-"}${Math.abs(parseFloat(item.amount)).toFixed(2)}
        </Text>
        <Text className="text-gray-400 text-xs">Format DATE</Text>
      </View>

      {/* Divider */}
      <View className="w-px h-8 bg-gray-400 mx-3" />

      {/* Delete Button */}
      <TouchableOpacity onPress={() => onDelete(item.id)} className="p-1">
        <Ionicons name="trash-outline" size={20} color="red" />
      </TouchableOpacity>
    </View>
  );
};
