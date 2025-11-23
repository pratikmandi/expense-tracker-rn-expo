import { useSignIn } from "@clerk/clerk-expo";
import { Link, useRouter } from "expo-router";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";
import React from "react";

export default function Page() {
  const { signIn, setActive, isLoaded } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");

  const onSignInPress = async () => {
    if (!isLoaded) return;

    try {
      const signInAttempt = await signIn.create({
        identifier: emailAddress,
        password,
      });

      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        router.replace("/");
      } else {
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err: any) {
      // console.error("Sign-in error:", err?.message || err);
      Alert.alert("Invalid Login", err?.message || err);
    }
  };

  return (
    <View className="p-4 justify-center gap-3 flex-1 bg-white">
      {/* <Text className="text-3xl font-semibold">Sign in</Text> */}
      <TextInput
        autoCapitalize="none"
        value={emailAddress}
        placeholder="Enter email"
        onChangeText={(emailAddress) => setEmailAddress(emailAddress)}
        className="border border-neutral-500 p-4 rounded-lg"
      />
      <TextInput
        value={password}
        placeholder="Enter password"
        secureTextEntry={true}
        onChangeText={(password) => setPassword(password)}
        className="border border-neutral-500 p-4 rounded-lg"
      />
      <TouchableOpacity
        onPress={onSignInPress}
        className="bg-blue-500 rounded-full p-4 items-center"
      >
        <Text className="text-white font-semibold">Continue</Text>
      </TouchableOpacity>
      <View className="gap-1 flex-row">
        <Link href="./sign-up">
          <Text className="text-blue-500 font-semibold">Sign up</Text>
        </Link>
      </View>
    </View>
  );
}
