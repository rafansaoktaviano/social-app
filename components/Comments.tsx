import { View, Text, ActivityIndicator } from "react-native";
import React, { useEffect, useState } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { COLORS } from "@/constants/theme";
import { FlashList } from "@shopify/flash-list";
import { Image } from "expo-image";
import { styles } from "@/styles/feed.styles";
import { useUser } from "@clerk/clerk-expo";
import { getRelativeTime } from "@/utils/fromNow";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Comments({ postId }: { postId: any }) {
  const comments = useQuery(api.posts.getCommentsByPost, { postId: postId });
  const insets = useSafeAreaInsets();
  const { user } = useUser();

  
  if (comments === undefined) {
    return (
      <ActivityIndicator
        style={{ height: 500 }}
        color={COLORS.primary}
        size={"small"}
      />
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <FlashList
        data={comments ? comments : []}
        contentContainerStyle={{ paddingBottom: insets.bottom + 350 }}
        renderItem={({ item }: { item: any }) => {
          return (
            <View style={styles.containerComment}>
              <Image
                source={item?.user.image}
                style={styles.userAvatarComment}
                contentFit="cover"
                transition={200}
              />
              <View>
                <Text style={styles.usernameText}>{item?.user?.username}</Text>
                <Text style={styles.caption}>{item.content}</Text>
                <Text style={styles.captionTime}>
                  {getRelativeTime(item?._creationTime)}
                </Text>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
}
