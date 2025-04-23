import Loader from "@/components/Loader";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/notification.styles";
import { getRelativeTime } from "@/utils/fromNow";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { Component } from "react";
import {
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Notifications() {
  const inset = useSafeAreaInsets();
  const navigate = useRouter();
  const notifications = useQuery(api.notifications.getNotifications, {});
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar barStyle={"light-content"} />
      <View> 
        <View style={styles.headerContainer}>
          <Text style={styles.headerTittle}>notifications</Text>
        </View>

        {notifications === undefined ? (
          <View style={styles.containerLoader}>
            <Loader />
          </View>
        ) : notifications?.length === 0 ? (
          <View style={[styles.containerLoader, { justifyContent: "center" }]}>
            <Text style={[{ color: COLORS.primary }]}>
              No notifications yet.
            </Text>
          </View>
        ) : (
          <View
            style={{
              height: "100%",
              width: "100%",
              paddingBottom: inset.bottom + 80,
            }}
          >
            <FlashList
              data={notifications && notifications}
              estimatedItemSize={80}
              renderItem={({ item }) => (
                <View style={styles.containerNotif}>
                  <View
                    style={{
                      position: "relative",
                    }}
                  >
                    <TouchableWithoutFeedback
                      onPress={() => navigate.push(`/user/${item?.senderId}`)}
                    >
                      <Image
                        source={item?.sender?.image}
                        style={styles.userAvatarComment}
                        contentFit="cover"
                        transition={200}
                      />
                    </TouchableWithoutFeedback>
                    <View
                      style={{
                        position: "absolute",
                        right: 10,
                        bottom: 0,
                        padding: 2,
                        borderWidth: 2,
                        borderRadius: "50%",
                        borderColor: COLORS.surfaceLight,
                        backgroundColor: COLORS.background,
                      }}
                    >
                      <Ionicons
                        name={
                          item?.type === "comment"
                            ? "chatbubble"
                            : item?.type === "follow"
                              ? "person-add"
                              : "heart"
                        }
                        size={15}
                        color={
                          item?.type === "comment"
                            ? "lightblue"
                            : item?.type === "follow"
                              ? "purple"
                              : COLORS.primary
                        }
                      />
                    </View>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.username}>
                      {item?.sender?.username}
                    </Text>
                    <Text style={styles.caption}>
                      {item?.type === "comment"
                        ? `commented: ${item.comment?.content}`
                        : item?.type === "follow"
                          ? "started following you"
                          : "liked your post"}
                    </Text>
                    <Text style={styles.time}>
                      {getRelativeTime(item?._creationTime)}
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => navigate.push(`/post/${item?.postId}`)}
                  >
                    {item?.type !== "follow" ? (
                      <Image
                        source={item?.post?.imageUrl}
                        style={styles.postNotificationImage}
                        contentFit="cover"
                        transition={200}
                      />
                    ) : null}
                  </TouchableOpacity>
                </View>
              )}
            />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
