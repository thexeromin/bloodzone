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
  StatusBar,
  Keyboard
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, Stack } from "expo-router";
import io from "socket.io-client";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/context";
import { getMessages } from "@/services";
import { Colors } from "@/constants";
import { BASE_URL as SOCKET_URL } from "@/constants";

export default function ChatRoom() {
  const { id, recipientName } = useLocalSearchParams();
  const roomId = Array.isArray(id) ? id[0] : id;

  const { user, fetchWithAuth } = useAuth();
  const [messages, setMessages] = useState<any[]>([]);
  const [text, setText] = useState("");

  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const socketRef = useRef<any>(null);
  const flatListRef = useRef<FlatList>(null);

  // Keyboard listeners
  useEffect(() => {
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

  // Socket
  useEffect(() => {
    socketRef.current = io(SOCKET_URL);
    socketRef.current.emit("join_room", roomId);
    socketRef.current.on("receive_message", (msg: any) => {
      setMessages((prev) => [...prev, msg]);
    });
    fetchHistory();
    return () => {
      socketRef.current.disconnect();
    };
  }, [roomId]);

  // Auto scroll
  useEffect(() => {
    if (messages.length > 0) {
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 200);
    }
  }, [messages, keyboardHeight]);

  const fetchHistory = async () => {
    try {
      const res = await getMessages(fetchWithAuth, roomId);
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
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
          isMe ? styles.alignRight : styles.alignLeft
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

  // Added +20 buffer to Android padding to clear the keyboard strip
  const androidPadding = keyboardHeight > 0 ? keyboardHeight + 20 : 0;

  const ChatContent = (
    <View
      style={[
        styles.innerContainer,
        { paddingBottom: Platform.OS === "android" ? androidPadding : 0 }
      ]}
    >
      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item._id || Math.random().toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
        onLayout={() => flatListRef.current?.scrollToEnd({ animated: false })}
        showsVerticalScrollIndicator={false}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Message..."
          placeholderTextColor={Colors.textMuted}
          multiline
        />
        <TouchableOpacity
          onPress={sendMessage}
          style={[styles.sendButton, !text.trim() && styles.sendButtonDisabled]}
          disabled={!text.trim()}
        >
          <Ionicons name="arrow-up" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <View style={{ flex: 1, backgroundColor: Colors.background }}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />

      <Stack.Screen
        options={{
          title: (recipientName as string) || "Chat",
          headerStyle: { backgroundColor: Colors.background },
          headerTintColor: Colors.textMain,
          headerShadowVisible: false,
          headerTitleStyle: { fontWeight: "700" }
        }}
      />

      {Platform.OS === "ios" ? (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior="padding"
          keyboardVerticalOffset={100}
        >
          <SafeAreaView style={{ flex: 1 }}>{ChatContent}</SafeAreaView>
        </KeyboardAvoidingView>
      ) : (
        <View style={{ flex: 1 }}>{ChatContent}</View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  innerContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between"
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 20,
    paddingTop: 10,
    flexGrow: 1
  },
  alignRight: { alignSelf: "flex-end" },
  alignLeft: { alignSelf: "flex-start" },
  messageWrapper: {
    marginVertical: 4,
    maxWidth: "75%"
  },
  bubble: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20
  },
  bubbleMe: {
    backgroundColor: Colors.primary,
    borderBottomRightRadius: 4
  },
  bubbleThem: {
    backgroundColor: "#fff",
    borderBottomLeftRadius: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  textMe: { color: "#fff", fontSize: 15 },
  textThem: { color: Colors.textMain, fontSize: 15 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.05)"
  },
  input: {
    flex: 1,
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingTop: 10,
    fontSize: 15,
    color: Colors.textMain,
    maxHeight: 100,
    marginRight: 8
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 2
  },
  sendButtonDisabled: {
    backgroundColor: Colors.textMuted,
    opacity: 0.5
  }
});
