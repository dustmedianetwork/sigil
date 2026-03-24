// app/_layout.tsx
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { keysExist } from '../components/crypto/KeyManager';

export default function RootLayout() {
  const [isChecking, setIsChecking] = useState(true);
  const [hasKeys, setHasKeys] = useState(false);

  useEffect(() => {
    const check = async () => {
      const exists = await keysExist();
      setHasKeys(exists);
      setIsChecking(false);
    };
    check();
  }, []);

  if (isChecking) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Render the appropriate screen stack
  return (
    <Stack>
      {!hasKeys ? (
        <Stack.Screen name="onboarding" options={{ headerShown: false }} />
      ) : (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      )}
    </Stack>
  );
}