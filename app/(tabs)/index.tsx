import { useState } from 'react';
import { View, TextInput, Button, Text, FlatList } from 'react-native';

type Message = {
  id: string;
  text: string;
};

export default function HomeScreen() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);

  const sendMessage = () => {
    if (!message) return;

    setMessages([
      ...messages,
      { id: Date.now().toString(), text: message }
    ]);

    setMessage('');
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <Text style={{ marginVertical: 5 }}>{item.text}</Text>
        )}
      />

      <TextInput
        value={message}
        onChangeText={setMessage}
        placeholder="Type message"
        style={{ borderWidth: 1, padding: 10, marginVertical: 10 }}
      />

      <Button title="Send" onPress={sendMessage} />

    </View>
  );
}