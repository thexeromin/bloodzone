import { useState, useEffect, useRef } from "react";
import { Platform } from "react-native";
import { useRouter } from "expo-router";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { useAuth } from "@/context";
import { updatePushToken } from "@/services";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true
  })
});

export const usePushNotifications = () => {
  const router = useRouter();
  const { fetchWithAuth } = useAuth();
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();

  const notificationListener = useRef<
    Notifications.EventSubscription | undefined
  >(undefined);
  const responseListener = useRef<Notifications.EventSubscription | undefined>(
    undefined
  );

  async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C"
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        console.log("Failed to get push token for push notification!");
        return;
      }

      token = (
        await Notifications.getExpoPushTokenAsync({
          projectId: Constants.expoConfig?.extra?.eas?.projectId
        })
      ).data;

      console.log("Expo Push Token:", token);
    } else {
      console.log("Must use physical device for Push Notifications");
    }

    return token;
  }

  const sendTokenToBackend = async (token: string) => {
    try {
      await updatePushToken(fetchWithAuth, token);
      console.log("Token synced with server");
    } catch (error) {
      console.error("Failed to sync token", error);
    }
  };

  useEffect(() => {
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
      if (token) {
        sendTokenToBackend(token);
      }
    });

    // Notification received while app is open
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
      });

    // User tapped on the notification
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        console.log("User tapped notification:", response);
        // Handle navigation here if needed
        const data = response.notification.request.content.data;
        const screen = data.screen;

        if (screen) {
          const screenName = (data as { screen?: string }).screen;
          router.push((screenName ? `/${screenName}` : "/donate") as any);
        }
      });

    return () => {
      notificationListener.current && notificationListener.current.remove();
      responseListener.current && responseListener.current.remove();
    };
  }, [router]);

  return {
    expoPushToken,
    notification
  };
};
