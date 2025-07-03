import React from 'react';
import { Stack } from 'expo-router';
import { Redirect } from 'expo-router';
import { useAuth } from '../../src/store/auth-context';
import { View, Text } from 'react-native';

export default function AuthLayout() {
  const { user, loading } = useAuth();

  // Show loading screen while authentication state is being determined
  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg">Loading...</Text>
      </View>
    );
  }

  // Redirect to tabs if user is authenticated
  if (user) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="forgot-password" />
    </Stack>
  );
}