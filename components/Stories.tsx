import { View, Text } from "react-native";
import React from "react";
import { FlashList } from "@shopify/flash-list";
import { styles } from "@/styles/feed.styles";
import { Image } from "expo-image";

export default function Stories({
  users,
  isLoading,
}: {
  users: any;
  isLoading: boolean;
}) {
  console.log(users);
  
  const skeletonItems = Array.from({ length: 6 });

  return (
    <FlashList
      horizontal={true}
      style={styles.storyList}
      data={isLoading ? skeletonItems : users.length > 0 ? users : null}
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
      estimatedItemSize={20}
      renderItem={({ item }: { item: any }) => {
        if (isLoading) {
          return (
            <>
              <View style={styles.containerStory}>
                <View
                  style={[
                    styles.story,
                    { backgroundColor: "#333", opacity: 0.5 },
                  ]}
                />
              </View>
              <Text style={[styles.storyText, { backgroundColor: "#444", width: 60, height: 10, marginTop: 6, borderRadius: 4, justifyContent: "center" }]} />
            </>
          );
        }

        // console.log('item', item?.name?.first);

        return (
          <>
            <View style={styles.containerStory}>
              <View style={styles.story}>
                <Image
                  source={{ uri: item?.picture?.large }}
                  style={styles.storyImage}
                />
              </View>
            </View>
            <Text style={styles.storyText}>{item?.name?.first || "TEST"}</Text>
          </>
        );
      }}
    />
  );
}
