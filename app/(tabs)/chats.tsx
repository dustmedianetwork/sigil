// app/(tabs)/chats.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useColorScheme } from '../../hooks/use-color-scheme'; // adjust path
import { Ionicons } from '@expo/vector-icons';

// Define the contact type
interface Contact {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: number;
}

// Placeholder data
const dummyContacts: Contact[] = [
  { id: '1', name: 'Alice', lastMessage: 'Hey, how are you?', timestamp: Date.now() },
  { id: '2', name: 'Bob', lastMessage: 'See you later!', timestamp: Date.now() - 100000 },
];

export default function ChatsScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [contacts, setContacts] = useState<Contact[]>(dummyContacts);

  // TODO: Load contacts from storage

  const renderContact = ({ item }: { item: Contact }) => (
    <TouchableOpacity
      style={[styles.contactItem, { borderBottomColor: isDark ? '#222' : '#eee' }]}
      onPress={() => router.push({ pathname: '/chat/[id]', params: { id: item.id } })}
    >
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name[0]}</Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={[styles.contactName, { color: isDark ? '#fff' : '#000' }]}>{item.name}</Text>
        <Text style={[styles.lastMessage, { color: isDark ? '#aaa' : '#666' }]}>{item.lastMessage}</Text>
      </View>
      <Text style={[styles.timestamp, { color: isDark ? '#aaa' : '#999' }]}>
        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
      </Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
      <FlatList
        data={contacts}
        renderItem={renderContact}
        keyExtractor={(item: Contact) => item.id}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <Text style={[styles.emptyText, { color: isDark ? '#aaa' : '#666' }]}>
            No contacts yet. Tap + to add one.
          </Text>
        }
      />
      <TouchableOpacity style={styles.fab} onPress={() => router.push('/add-contact')}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    paddingVertical: 10,
  },
  contactItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
  contactInfo: {
    flex: 1,
  },
  contactName: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  lastMessage: {
    fontSize: 14,
  },
  timestamp: {
    fontSize: 12,
    marginLeft: 10,
  },
  fab: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    backgroundColor: '#007AFF',
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
  },
});