import React, { createContext, useContext, useState, ReactNode } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface ToastContextType {
  showToast: (message: string, onUndo: () => void) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [onUndo, setOnUndo] = useState<(() => void) | null>(null);

  const showToast = (msg: string, undoCallback: () => void) => {
    setMessage(msg);
    setOnUndo(() => undoCallback);
    setVisible(true);
  };

  const hideToast = () => {
    setVisible(false);
    setOnUndo(null);
  };

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      {visible && (
        <View style={styles.toastContainer}>
          <View style={styles.toastContent}>
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
            <Text style={styles.toastText}>{message}</Text>
          </View>
          <TouchableOpacity
            onPress={() => {
              if (onUndo) onUndo();
              hideToast();
            }}
            style={styles.undoButton}
          >
            <Text style={styles.undoText}>UNDO</Text>
          </TouchableOpacity>
        </View>
      )}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used within ToastProvider");
  return context;
};

const styles = StyleSheet.create({
  toastContainer: {
    position: "absolute",
    bottom: 50,
    left: 20,
    right: 20,
    backgroundColor: "#1F2937",
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 10,
    zIndex: 9999
  },
  toastContent: { flexDirection: "row", alignItems: "center" },
  toastText: {
    color: "white",
    fontSize: 15,
    fontWeight: "500",
    marginLeft: 10
  },
  undoButton: {
    backgroundColor: "#374151",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8
  },
  undoText: { color: "#60A5FA", fontWeight: "bold", fontSize: 14 }
});
