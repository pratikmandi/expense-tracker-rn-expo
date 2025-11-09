import { View, Text } from "react-native";
import React from "react";

export const SummaryCard = ({ summary }) => {
  return (
    <View className="rounded-2xl border-none p-8 mx-5 bg-lime-200">
      <Text className="text-black my-1">Total Balance</Text>
      {/* <Text className="text-lg">${parseFloat(summary.balance).toFixed(2)}</Text> */}
      <Text className="font-semibold text-4xl">2000.00</Text>
      <View className="flex-row justify-between mt-5">
        <View className="flex items-center">
          <Text className="">Income</Text>
          {/* <Text>+${parseFloat(summary.income).toFixed(2)}</Text> */}
          <Text className="font-semibold text-lg text-green-600">+200.00</Text>
        </View>

        <View className="flex">
          <View className="items-center">
            <Text>Expenses</Text>
            {/* <Text>-${Math.abs(parseFloat(summary.expenses)).toFixed(2)}</Text> */}
            <Text className="font-semibold text-lg text-red-600">-200.00</Text>
          </View>
        </View>
      </View>
    </View>
  );
};
