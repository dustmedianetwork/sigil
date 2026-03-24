import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, TextInput, Modal } from 'react-native';
import { useColorScheme } from '../../hooks/use-color-scheme'; // adjust path
import QRCode from 'react-native-qrcode-svg';
import * as Clipboard from 'expo-clipboard';
import { getPublicKey, getUserName, setUserName } from '../../components/crypto/KeyManager'; // adjust path
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState<string>('');
  const [editing, setEditing] = useState(false);
  const [newName, setNewName] = useState('');
  const [showQRModal, setShowQRModal] = useState(false);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const pub = await getPublicKey();
    const name = await getUserName();
    setPublicKey(pub);
    setDisplayName(name || 'You');
    setNewName(name || 'You');
  };

  const copyID = async () => {
    if (publicKey) {
      await Clipboard.setStringAsync(publicKey);
      Alert.alert('Copied', 'Your ID has been copied to clipboard.');
    }
  };

  const saveName = async () => {
    await setUserName(newName);
    setDisplayName(newName);
    setEditing(false);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <TouchableOpacity style={styles.qrContainer} onPress={() => setShowQRModal(true)}>
        {publicKey && (
          <QRCode
            value={publicKey}
            size={150}
            color={isDark ? '#fff' : '#000'}
            backgroundColor={isDark ? '#000' : '#fff'}
          />
        )}
        <Text style={[styles.qrLabel, { color: isDark ? '#aaa' : '#666' }]}>Tap to enlarge</Text>
      </TouchableOpacity>

      <View style={styles.infoContainer}>
        {editing ? (
          <View style={styles.editContainer}>
            <TextInput
              style={[styles.nameInput, { color: isDark ? '#fff' : '#000', borderColor: isDark ? '#444' : '#ccc' }]}
              value={newName}
              onChangeText={setNewName}
              placeholder="Your display name"
              placeholderTextColor={isDark ? '#aaa' : '#888'}
            />
            <TouchableOpacity onPress={saveName} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity onPress={() => setEditing(true)} style={styles.nameRow}>
            <Text style={[styles.nameLabel, { color: isDark ? '#aaa' : '#666' }]}>Display Name:</Text>
            <Text style={[styles.nameValue, { color: isDark ? '#fff' : '#000' }]}>{displayName}</Text>
            <Ionicons name="pencil" size={18} color={isDark ? '#1E88E5' : '#007AFF'} style={styles.editIcon} />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.copyButton} onPress={copyID}>
          <Text style={styles.copyButtonText}>Copy My ID</Text>
        </TouchableOpacity>
      </View>

      {/* QR Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showQRModal}
        onRequestClose={() => setShowQRModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDark ? '#1c1c1e' : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: isDark ? '#fff' : '#000' }]}>Your QR Code</Text>
            {publicKey && (
              <QRCode
                value={publicKey}
                size={250}
                color={isDark ? '#fff' : '#000'}
                backgroundColor={isDark ? '#1c1c1e' : '#fff'}
              />
            )}
            <TouchableOpacity style={styles.closeModalButton} onPress={() => setShowQRModal(false)}>
              <Text style={styles.closeModalText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 40,
  },
  qrContainer: {
    alignItems: 'center',
    marginBottom: 30,
  },
  qrLabel: {
    marginTop: 8,
    fontSize: 12,
  },
  infoContainer: {
    width: '80%',
    alignItems: 'center',
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  nameLabel: {
    fontSize: 16,
    marginRight: 10,
  },
  nameValue: {
    fontSize: 18,
    fontWeight: '500',
    marginRight: 10,
  },
  editIcon: {
    marginLeft: 5,
  },
  editContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  nameInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 8,
    fontSize: 16,
    width: 150,
    marginRight: 10,
  },
  saveButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  copyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 10,
  },
  copyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  closeModalButton: {
    marginTop: 20,
    padding: 10,
  },
  closeModalText: {
    color: '#007AFF',
    fontSize: 16,
  },
});