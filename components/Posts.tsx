import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/feed.styles";
import { Ionicons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useMutation } from "convex/react";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  Dimensions,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Posts({
  post,
  user,
  openBottomSheet,
}: {
  post: any;
  user: any;
  openBottomSheet: any;
}) {
  const insets = useSafeAreaInsets();
  const toggleLikes = useMutation(api.posts.likePost);
  const toggleBookmark = useMutation(api.posts.toggleBookmarkPost);
  const navigate = useRouter();

  const handleToggleLikes = async (postId: any) => {
    try {
      const toggleLike = await toggleLikes({ postId: postId });
    } catch (error) {
      console.error("error", error);
    }
  };

  const handleToggleBookmark = async (postId: any) => {
    try {
      const response = await toggleBookmark({ postId: postId });
    } catch (error) {
      console.error("Error", error);
    }
  };

  return (
    <View style={[styles.postContainer]}>
      <FlashList
        data={post && post.length > 0 ? post : []}
        contentContainerStyle={{ paddingBottom: insets.bottom + 320 }}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        estimatedItemSize={83}
        scrollEnabled={true}
        nestedScrollEnabled={true}
        renderItem={({ item }: { item: any }) => {
          return (
            <View>
              <View style={styles.containerPostHeader}>
                <TouchableWithoutFeedback
                  onPress={() => navigate.push(`/user/${item.user._id}`)}
                >
                  <View style={styles.postHeader}>
                    <Image
                      source={item?.user?.image}
                      style={styles.userAvatar}
                      contentFit="cover"
                      transition={200}
                      pointerEvents="none"
                    />
                    <Text style={styles.usernameText}>
                      {item?.user?.username}
                    </Text>
                  </View>
                </TouchableWithoutFeedback>

                {user?.id === item.user.clerkId ? (
                  <TouchableOpacity style={{ alignItems: "center" }}>
                    <Ionicons
                      name="trash-outline"
                      size={20}
                      color={COLORS.grey}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
              <View style={styles.postImage}>
                <Image
                  source={item.imageUrl}
                  contentFit="cover"
                  transition={200}
                  style={styles.postPreviewImage}
                />
              </View>
              <View style={styles.postActions}>
                <View style={styles.postActionLeft}>
                  <TouchableOpacity
                    onPress={() => handleToggleLikes(item?._id)}
                  >
                    <Ionicons
                      name={item.isLike ? "heart" : "heart-outline"}
                      size={24}
                      color={item.isLike ? COLORS.primary : COLORS.white}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => openBottomSheet(item._id)}>
                    <Ionicons
                      name="chatbubble-outline"
                      size={22}
                      color={COLORS.white}
                    />
                  </TouchableOpacity>
                </View>
                <TouchableOpacity
                  onPress={() => handleToggleBookmark(item._id)}
                >
                  <Ionicons
                    name={item.isBookmark ? "bookmark" : "bookmark-outline"}
                    size={22}
                    color={item.isBookmark ? COLORS.primary : COLORS.white}
                  />
                </TouchableOpacity>
              </View>
              <View style={styles.bottomContainer}>
                <Text style={styles.textCaption}>{item.likes} Likes</Text>
                <Text style={styles.textCaption}>{item.caption}</Text>
                <Text
                  onPress={() => openBottomSheet(item._id)}
                  style={styles.textComment}
                >
                  {`View all ${item.commentCount > 0 ? item.commentCount : ""} comments`}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
