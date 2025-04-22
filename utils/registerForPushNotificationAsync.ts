import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export async function registerForPushNotificationsAsync() {
  console.log("⏳ Start registration...");

  if (!Device.isDevice) {
    console.log("❌ Not a real device!");
    return null;
  }

  console.log("📱 Real device confirmed");

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  console.log("📋 Existing status:", existingStatus);

  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    console.log("🔐 Requested status:", status);
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    console.log("🚫 Permissions not granted");
    return null;
  }

  const projectId =
    Constants?.expoConfig?.extra?.eas?.projectId ??
    Constants?.easConfig?.projectId;

  const { data } = await Notifications.getExpoPushTokenAsync({ projectId });
  console.log("✅ Expo Push Token:", data);

  return data;
}
