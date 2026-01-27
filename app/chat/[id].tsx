import { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Keyboard
} from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import io from "socket.io-client";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context";
import { getMessages } from "@/services";
import { ThemeColors, BASE_URL as SOCKET_URL, Colors } from "@/constants";

export default function ChatRoom() {
  const { id, recipientName } = useLocalSearchParams();
  const roomId = Array.isArray(id) ? id[0] : id;

  const { user, fetchWithAuth } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  // Track keyboard height manually
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const socketRef = useRef<any>(null);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    // Android Only: Listen to keyboard height changes
    if (Platform.OS === "android") {
      const showSub = Keyboard.addListener("keyboardDidShow", (e) => {
        setKeyboardHeight(e.endCoordinates.height);
      });
      const hideSub = Keyboard.addListener("keyboardDidHide", () => {
        setKeyboardHeight(0);
      });
      return () => {
        showSub.remove();
        hideSub.remove();
      };
    }
  }, []);

  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit("join_room", roomId);

    socketRef.current.on("receive_message", (msg: any) => {
      setMessages((prev) => [...prev, msg]);
      setTimeout(
        () => flatListRef.current?.scrollToEnd({ animated: true }),
        100
      );
    });

    fetchHistory();

    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const fetchHistory = async () => {
    try {
      const res = await getMessages(fetchWithAuth, roomId);
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
        setTimeout(
          () => flatListRef.current?.scrollToEnd({ animated: false }),
          200
        );
      }
    } catch (e) {
      console.error(e);
    }
  };

  const sendMessage = () => {
    if (!text.trim()) return;
    socketRef.current.emit("send_message", {
      chatRoomId: roomId,
      senderId: user?._id,
      content: text
    });
    setText("");
  };

  const renderItem = ({ item }: any) => {
    const isMe = item.sender === user?._id || item.sender?._id === user?._id;
    return (
      <View
        style={[
          styles.messageWrapper,
          isMe ? { alignSelf: "flex-end" } : { alignSelf: "flex-start" }
        ]}
      >
        <View
          style={[styles.bubble, isMe ? styles.bubbleMe : styles.bubbleThem]}
        >
          <Text style={isMe ? styles.textMe : styles.textThem}>
            {item.content}
          </Text>
        </View>
      </View>
    );
  };

  const Content = (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id || Math.random().toString()}
        renderItem={renderItem}
        // flex: 1 ensures it takes available space, shrinking when spacer appears
        style={{ flex: 1 }}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      {/* Input Area */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Message..."
          placeholderTextColor={ThemeColors.placeholder}
          multiline
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButton}>
          <Ionicons name="send" size={24} color={ThemeColors.accent} />
        </TouchableOpacity>
      </View>

      {/* A visible spacer block that sits BELOW the input.
         When keyboard opens, this grows to 300px, pushing the input UP.
      */}
      {Platform.OS === "android" && (
        <View style={{ height: keyboardHeight + 20 }} />
      )}
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: ThemeColors.screenBackground }}>
      <Stack.Screen
        options={{
          title: (recipientName as string) || "Chat",
          headerStyle: { backgroundColor: ThemeColors.screenBackground },
          headerTintColor: ThemeColors.primaryContent,
          headerShadowVisible: false
        }}
      />

      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="padding"
          keyboardVerticalOffset={100}
        >
          {Content}
        </KeyboardAvoidingView>
      ) : (
        // On Android, we just render Content. The spacer inside does the work.
        Content
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ThemeColors.screenBackground
  },
  listContent: {
    paddingHorizontal: 15,
    paddingBottom: 20,
    paddingTop: 10,
    flexGrow: 1
  },
  messageWrapper: {
    marginVertical: 4,
    maxWidth: "80%"
  },
  bubble: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 16
  },
  bubbleMe: {
    backgroundColor: ThemeColors.accent,
    borderBottomRightRadius: 2,
    borderBottomLeftRadius: 16
  },
  bubbleThem: {
    backgroundColor: ThemeColors.surfaceBackground,
    borderBottomLeftRadius: 2,
    borderBottomRightRadius: 16
  },
  textMe: { color: Colors.neutral800, fontSize: 16 },
  textThem: { color: ThemeColors.primaryContent, fontSize: 16 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderColor: ThemeColors.surfaceBackground,
    backgroundColor: ThemeColors.screenBackground
  },
  input: {
    flex: 1,
    backgroundColor: ThemeColors.surfaceBackground,
    color: ThemeColors.primaryContent,
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginRight: 10,
    maxHeight: 100
  },
  sendButton: { padding: 5 }
});
