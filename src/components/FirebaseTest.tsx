import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { db } from '../config/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function FirebaseTest() {
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const testConnection = async () => {
      try {
        await getDocs(collection(db, 'test'));
        setConnected(true);
      } catch (error) {
        console.error('Firebase connection error:', error);
      }
    };

    testConnection();
  }, []);

  return (
    <View className="p-4">
      <Text className="text-lg">
        Firebase Status: {connected ? 'Connected' : 'Disconnected'}
      </Text>
    </View>
  );
}

