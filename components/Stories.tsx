import { View, Text } from "react-native";
import React from "react";
import { FlashList } from "@shopify/flash-list";
import { styles } from "@/styles/feed.styles";
import { Image } from "expo-image";

export default function Stories({ users }: { users: any }) {
  return (
    <FlashList
      horizontal={true}
      style={styles.storyList}
      data={users.length > 0 ? users : null}
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="always"
      estimatedItemSize={20}
      renderItem={({ item }: { item: any }) => {
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
            <Text style={styles.storyText}>{item.name.first}</Text>
          </>
        );
      }}
    />
  );
}
