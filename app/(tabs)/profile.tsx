import React from 'react';
import { View, Text, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../../src/store/auth-context';
import { logout } from '../../src/services/auth.service';

export default function ProfileScreen() {
  const { user } = useAuth();

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          try {
            await logout();
          } catch (error: any) {
            Alert.alert('Error', error.message);
          }
        },
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-4">
        <Text className="text-3xl font-bold mb-8 text-primary-700">Profile</Text>

        <View className="bg-gray-50 rounded-lg p-4 mb-6">
          <Text className="text-gray-600 mb-2">Email</Text>
          <Text className="text-lg font-semibold">{user?.email}</Text>
        </View>

        <View className="bg-gray-50 rounded-lg p-4 mb-6">
          <Text className="text-gray-600 mb-2">User ID</Text>
          <Text className="text-sm text-gray-800">{user?.uid}</Text>
        </View>

        <View className="flex-1" />

        <TouchableOpacity
          className="bg-red-600 rounded-lg py-3 mb-8"
          onPress={handleLogout}
        >
          <Text className="text-white text-center text-lg font-semibold">
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}