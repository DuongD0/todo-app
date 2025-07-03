import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, Stack } from 'expo-router';

export default function NotFoundScreen() {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Stack.Screen options={{ title: "Oops! This screen doesn't exist." }} />
      <View className="flex-1 items-center justify-center px-6">
        <Text className="text-2xl font-bold text-gray-800 mb-4">
          Page Not Found
        </Text>
        <Text className="text-gray-600 text-center mb-8">
          The page you're looking for doesn't exist.
        </Text>
        <Link href="/" asChild>
          <TouchableOpacity className="bg-primary-600 px-6 py-3 rounded-lg">
            <Text className="text-white font-semibold">Go to home screen</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}