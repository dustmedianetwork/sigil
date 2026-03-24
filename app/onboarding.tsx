// app/onboarding.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '../hooks/use-color-scheme'; // adjust path
import { Camera } from 'expo-camera';
import { generateAndStoreKeys, keysExist, setUserName } from '../components/crypto/KeyManager';

export default function OnboardingScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [loading, setLoading] = useState(false);

  const handleGetStarted = async () => {
    setLoading(true);
    try {
      // Request camera permission
      const { status } = await Camera.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Camera permission is required to scan QR codes.');
        setLoading(false);
        return;
      }

      // Generate keys if they don't exist
      const hasKeys = await keysExist();
      if (!hasKeys) {
        await generateAndStoreKeys();
        // Optionally ask for a display name here or later in profile
        await setUserName('You'); // temporary default
      }

      // Navigate to main app (replace to avoid going back to onboarding)
      // In handleGetStarted, after keys are generated:
      router.replace('/add-contact?firstTime=true');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>Welcome to Sigil</Text>
      <Text style={[styles.subtitle, { color: isDark ? '#ccc' : '#666' }]}>
        Ultra‑safe peer‑to‑peer chat. No phone number needed.
      </Text>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: isDark ? '#1E88E5' : '#007AFF' }]}
        onPress={handleGetStarted}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Get Started</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});