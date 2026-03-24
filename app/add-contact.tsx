import React, { useState, useEffect } from 'react';
import { 
  View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Modal, 
  Vibration, Platform 
} from 'react-native';
import { useRouter, useLocalSearchParams, Stack } from 'expo-router';
import { useColorScheme } from '../hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';
import * as Clipboard from 'expo-clipboard';
import QRCode from 'react-native-qrcode-svg';
import { getPublicKey } from '../components/crypto/KeyManager';
import { Camera } from 'expo-camera';

export default function AddContactScreen() {
  const router = useRouter();
  const { firstTime } = useLocalSearchParams<{ firstTime?: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [showQRModal, setShowQRModal] = useState(false);
  const [pasteInput, setPasteInput] = useState('');
  const [showPasteModal, setShowPasteModal] = useState(false);

  const isFirstTime = firstTime === 'true';

  useEffect(() => {
    loadPublicKey();
  }, []);

  const loadPublicKey = async () => {
    const pub = await getPublicKey();
    setPublicKey(pub);
  };

  const vibrate = () => {
    if (Platform.OS !== 'web') {
      Vibration.vibrate(50);
    }
  };

  const handleScanQR = async () => {
    vibrate();
    const { status } = await Camera.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Camera permission is required to scan QR codes.');
      return;
    }
    // TODO: Navigate to QR scanner screen
    Alert.alert('Scan QR', 'QR scanner will open here.');
  };

  const handleShowMyQR = () => {
    vibrate();
    setShowQRModal(true);
  };

  const handlePasteID = async () => {
    vibrate();
    const text = await Clipboard.getStringAsync();
    setPasteInput(text);
    setShowPasteModal(true);
  };

  const handleCopyID = async () => {
    vibrate();
    if (publicKey) {
      await Clipboard.setStringAsync(publicKey);
      Alert.alert('Copied', 'Your ID has been copied to clipboard.');
    }
  };

  const handlePasteSubmit = () => {
    vibrate();
    // TODO: Validate and add contact
    Alert.alert('Pasted ID', pasteInput);
    setShowPasteModal(false);
    afterContactAdded();
  };

  const afterContactAdded = () => {
    if (isFirstTime) {
      router.replace('/(tabs)');
    } else {
      router.back();
    }
  };

  const handleSkip = () => {
    vibrate();
    if (isFirstTime) {
      router.replace('/(tabs)');
    } else {
      router.back();
    }
  };

  return (
    <>
      <Stack.Screen
        options={{
          title: 'Add Contact',
          headerBackTitle: 'Back',
          headerLeft: isFirstTime ? () => null : undefined,
          headerStyle: {
            backgroundColor: isDark ? '#000' : '#fff',
          },
          headerTitleStyle: {
            color: isDark ? '#fff' : '#000',
          },
        }}
      />
      <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <View style={styles.headerIcon}>
          <Ionicons 
            name="people" 
            size={80} 
            color={isDark ? '#1E88E5' : '#007AFF'} 
          />
        </View>
        <Text style={[styles.title, { color: isDark ? '#fff' : '#000' }]}>
          {isFirstTime ? 'Welcome!' : 'Add a Contact'}
        </Text>
        <Text style={[styles.subtitle, { color: isDark ? '#aaa' : '#666' }]}>
          {isFirstTime 
            ? 'Let’s get you started. Add your first contact to begin chatting.' 
            : 'Scan a QR code, share your QR, or paste a contact ID.'}
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: isDark ? '#1E88E5' : '#007AFF' }]} 
            onPress={handleScanQR}
            activeOpacity={0.8}
          >
            <Ionicons name="qr-code" size={24} color="#fff" />
            <Text style={styles.buttonText}>Scan QR Code</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: isDark ? '#1E88E5' : '#007AFF' }]} 
            onPress={handleShowMyQR}
            activeOpacity={0.8}
          >
            <Ionicons name="qr-code-outline" size={24} color="#fff" />
            <Text style={styles.buttonText}>Show My QR</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: isDark ? '#1E88E5' : '#007AFF' }]} 
            onPress={handlePasteID}
            activeOpacity={0.8}
          >
            <Ionicons name="clipboard" size={24} color="#fff" />
            <Text style={styles.buttonText}>Paste Link or ID</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.button, { backgroundColor: isDark ? '#1E88E5' : '#007AFF' }]} 
            onPress={handleCopyID}
            activeOpacity={0.8}
          >
            <Ionicons name="copy" size={24} color="#fff" />
            <Text style={styles.buttonText}>Copy My ID</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.skipButton} onPress={handleSkip} activeOpacity={0.7}>
          <Text style={[styles.skipText, { color: isDark ? '#1E88E5' : '#007AFF' }]}>
            {isFirstTime ? 'Skip for now' : 'Cancel'}
          </Text>
        </TouchableOpacity>

        {/* QR Modal */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showQRModal}
          onRequestClose={() => setShowQRModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: isDark ? '#1c1c1e' : '#fff' }]}>
              <Text style={[styles.modalTitle, { color: isDark ? '#fff' : '#000' }]}>Your QR Code</Text>
              <View style={styles.qrWrapper}>
                {publicKey && (
                  <QRCode
                    value={publicKey}
                    size={220}
                    color={isDark ? '#fff' : '#000'}
                    backgroundColor={isDark ? '#1c1c1e' : '#fff'}
                  />
                )}
              </View>
              <TouchableOpacity 
                style={styles.closeModalButton} 
                onPress={() => setShowQRModal(false)}
                activeOpacity={0.7}
              >
                <Text style={styles.closeModalText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Paste Modal */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={showPasteModal}
          onRequestClose={() => setShowPasteModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={[styles.modalCard, { backgroundColor: isDark ? '#1c1c1e' : '#fff' }]}>
              <Text style={[styles.modalTitle, { color: isDark ? '#fff' : '#000' }]}>Paste Contact ID</Text>
              <TextInput
                style={[
                  styles.input, 
                  { 
                    color: isDark ? '#fff' : '#000', 
                    borderColor: isDark ? '#444' : '#ccc',
                    backgroundColor: isDark ? '#2c2c2e' : '#f9f9f9'
                  }
                ]}
                value={pasteInput}
                onChangeText={setPasteInput}
                placeholder="Paste the ID or link here"
                placeholderTextColor={isDark ? '#aaa' : '#888'}
                multiline
                numberOfLines={4}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity 
                  style={styles.modalButtonAction} 
                  onPress={handlePasteSubmit}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.modalButtonText, { color: '#007AFF' }]}>Add Contact</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                  style={styles.modalButtonAction} 
                  onPress={() => setShowPasteModal(false)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.modalButtonText, { color: '#FF3B30' }]}>Cancel</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  headerIcon: {
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    paddingHorizontal: 20,
    lineHeight: 22,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 30,
    marginBottom: 16,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: 12,
  },
  skipButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  skipText: {
    fontSize: 16,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalCard: {
    borderRadius: 28,
    padding: 24,
    alignItems: 'center',
    width: '85%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 20,
  },
  qrWrapper: {
    padding: 12,
    borderRadius: 16,
    backgroundColor: 'transparent',
  },
  closeModalButton: {
    marginTop: 24,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
  },
  closeModalText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 14,
    width: '100%',
    minHeight: 100,
    textAlignVertical: 'top',
    marginBottom: 24,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButtonAction: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    minWidth: 100,
    alignItems: 'center',
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});