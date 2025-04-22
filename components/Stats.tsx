import { View, Text } from "react-native";
import React from "react";
import { Image } from "expo-image";
import { styles } from "@/styles/profile.styles";

export default function Stats({ data }: { data: any }) {

  return (
    <View style={styles.section}>
      <Image
        source={data?.image}
        style={styles.userAvatarComment}
        contentFit="cover"
        transition={200}
      />
      <View style={styles.statsText}>
        <View style={styles.containerText}>
          <Text style={styles.firstText}>{data?.posts.length}</Text>
          <Text style={styles.secondText}>{"Posts"}</Text>
        </View>
        <View style={styles.containerText}>
          <Text style={styles.firstText}>{data?.followerCount?.length}</Text>
          <Text style={styles.secondText}>{"Followers"}</Text>
        </View>
        <View style={styles.containerText}>
          <Text style={styles.firstText}>{data?.followingCount.length}</Text>
          <Text style={styles.secondText}>{"Following"}</Text>
        </View>
      </View>
    </View>
  );
}
