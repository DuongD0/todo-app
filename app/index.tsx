import React from 'react';
import { Redirect } from 'expo-router';
import { useAuth } from '../src/store/auth-context';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function IndexScreen() {
  const { user, loading } = useAuth();

  // Show loading screen while authentication state is being determined
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <Text className="text-lg">Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  // Redirect based on authentication state
  if (user) {
    return <Redirect href="/(tabs)" />;
  } else {
    return <Redirect href="/(auth)/login" />;
  }
}