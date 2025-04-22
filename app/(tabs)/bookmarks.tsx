import Loader from "@/components/Loader";
import PostList from "@/components/PostList";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/bookmarks.styles";
import { FlashList } from "@shopify/flash-list";
import { useQuery } from "convex/react";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  SafeAreaView,
  StatusBar,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function bookmarks() {
  const bookmarks = useQuery(api.bookmarks.getBookmarks, {});
  const navigate = useRouter();
  const inset = useSafeAreaInsets();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar barStyle={"light-content"} />
      <View>
        <View style={styles.containerHeader}>
          <Text style={styles.headerTittle}>Bookmarks</Text>
        </View>
        {bookmarks === undefined ? (
          <View
            style={{
              height: "100%",
              alignItems: "center",
            }}
          >
            <Loader />
          </View>
        ) : (
          <View
            style={[
              styles.containerBookmarks,
              { paddingBottom: inset.bottom + 80 },
            ]}
          >
            <PostList data={bookmarks} />
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
