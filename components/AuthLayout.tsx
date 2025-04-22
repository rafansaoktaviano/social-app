import { api } from "@/convex/_generated/api";
import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationAsync";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

export default function AuthLayout() {
  const { isSignedIn, isLoaded } = useAuth();

  const segments = useSegments();
  const router = useRouter();

  const saveToken = useMutation(api.users.saveToken);

  useEffect(() => {
    const subscription = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        const data = response.notification.request.content.data;

        console.log("dataNotification", data);

        if (data.id) {
          switch (data.type) {
            case "like":
              router.push(`/post/${data.id}`);
              break;
            case "follow":
              router.push(`/user/${data.id}`);
              break;
            case "comment":
              router.push(`/post/${data.id}?isOpen=true`);
              break;
            default:
              break;
          }
        }
      }
    );
    return () => subscription.remove();
  }, []);

  useEffect(() => {
    console.log("running token");

    (async () => {
      const token = await registerForPushNotificationsAsync();
      console.log(token);

      if (token && Device.deviceName && isSignedIn) {
        saveToken({ token: token, deviceName: Device.deviceName });
      }
    })();
    console.log("end token");
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    console.log("isLoaded", isLoaded);

    const inAuthPage = segments[0] === "(auth)";
    console.log("inAuthPage", inAuthPage);
    console.log("isSignedIn", isSignedIn);

    if (!isSignedIn && !inAuthPage) {
      router.replace("/(auth)/login");
    } else if (isSignedIn && inAuthPage) {
      router.replace("/(tabs)");
    }
  }, [isLoaded, isSignedIn, segments]);

  if (!isLoaded) return null;

  return <Stack screenOptions={{ headerShown: false }} />;
}
