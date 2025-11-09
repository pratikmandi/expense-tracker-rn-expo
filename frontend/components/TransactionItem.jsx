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
    <View
      className="flex-row border-none rounded-md items-center"
      key={item.id}
    >
      <TouchableOpacity className="flex-1 flex-row p-14 items-center">
        <View className="w-40 h-40 justify-center items-center border-none rounded-md">
          <Ionicons name={iconName} size={22} />
        </View>
        <View className="flex-1">
          <Text className="size-16">{item.title}</Text>
          <Text className="size-14">{item.category}</Text>
        </View>
        <View className="justify-end">
          <Text className="size-16">
            {isIncome ? "+" : "-"}$
            {Math.abs(parseFloat(item.amount)).toFixed(2)}
          </Text>
          <Text className="size-12">Format DATE</Text>
        </View>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onDelete(item.id)}>
        <Ionicons name="trash-outline" size={20} />
      </TouchableOpacity>
    </View>
  );
};
