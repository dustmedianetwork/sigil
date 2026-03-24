// app/chat/[id].tsx
import { View, Text, StyleSheet, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { useState } from 'react';
import { useColorScheme } from '../../hooks/use-color-scheme'; // adjust path

export default function ChatScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const [messages, setMessages] = useState<{ id: string; text: string; isMe: boolean }[]>([]);
  const [inputText, setInputText] = useState('');

  const sendMessage = () => {
    if (!inputText.trim()) return;
    setMessages(prev => [...prev, { id: Date.now().toString(), text: inputText, isMe: true }]);
    setInputText('');
  };

  return (
    <>
      <Stack.Screen options={{ title: `Chat ${id}` }} />
      <View style={[styles.container, { backgroundColor: isDark ? '#000' : '#fff' }]}>
        <FlatList
          data={messages}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={[styles.messageBubble, item.isMe ? styles.me : styles.other]}>
              <Text style={[styles.messageText, { color: isDark ? '#fff' : '#000' }]}>{item.text}</Text>
            </View>
          )}
          contentContainerStyle={styles.messagesList}
        />
        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, { backgroundColor: isDark ? '#1c1c1e' : '#f0f0f0', color: isDark ? '#fff' : '#000' }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Type a message..."
            placeholderTextColor={isDark ? '#aaa' : '#888'}
          />
          <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
            <Text style={styles.sendButtonText}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  messagesList: {
    padding: 16,
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 10,
    borderRadius: 12,
    marginVertical: 4,
  },
  me: {
    alignSelf: 'flex-end',
    backgroundColor: '#007AFF',
  },
  other: {
    alignSelf: 'flex-start',
    backgroundColor: '#e0e0e0',
  },
  messageText: {
    fontSize: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    marginRight: 10,
  },
  sendButton: {
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  sendButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
});