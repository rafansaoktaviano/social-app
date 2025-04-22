import { View, Text, TouchableWithoutFeedback } from "react-native";
import React from "react";
import { FlashList } from "@shopify/flash-list";
import { useRouter } from "expo-router";
import { Image } from "expo-image";
import { styles } from "@/styles/bookmarks.styles";

export default function PostList({ data }: { data: any }) {
  const navigate = useRouter();

  return (
    <FlashList
      data={data && data}
      numColumns={3}
      style={{ flexWrap: "wrap" }}
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      estimatedItemSize={100}
      showsVerticalScrollIndicator={false}
      renderItem={({ item }: { item: any }) => {
        console.log(item);

        return (
          <TouchableWithoutFeedback
            onPress={() => navigate.push(`/post/${item?.postId || item._id}`)}
          >
            <Image
              source={item.post?.imageUrl || item.imageUrl}
              contentFit="cover"
              transition={200}
              style={styles.bookmarkImage}
            />
          </TouchableWithoutFeedback>
        );
      }}
    />
  );
}
