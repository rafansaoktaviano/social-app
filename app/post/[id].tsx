import {
  View,
  Text,
  SafeAreaView,
  StatusBar,
  TouchableOpacity,
  InteractionManager,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { styles } from "@/styles/post.auth.styles";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/theme";
import Loader from "@/components/Loader";
import Posts from "@/components/Posts";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import Post from "@/components/Post";
import { Portal } from "@gorhom/portal";
import CustomFooter from "@/components/CustomFooter";
import Comments from "@/components/Comments";

export default function PostScreen() {
  const { id } = useLocalSearchParams();
  const { isOpen } = useLocalSearchParams();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const navigate = useRouter();
  const [isLayoutReady, setIsLayoutReady] = useState(false);

  useEffect(() => {
    console.log(isLayoutReady);

    if (isLayoutReady && isOpen == "true" && bottomSheetRef.current) {
      console.log("bottomSheetRef", bottomSheetRef);
      setTimeout(() => {
        if (bottomSheetRef.current) {
          bottomSheetRef.current.expand();
        }
      }, 200);
    }
  }, [isLayoutReady, isOpen]);

  const post = useQuery(api.posts.getPostById, {
    postId: id as Id<"posts">,
  });

  const openBottomSheet = (postId: any) => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.expand();
      // setPostId(postId);
      // setIsShowComment(true);
    }
  };

  const handleSheetChanges = useCallback((index: number) => {
    if (index !== 0) {
    } else {
      if (bottomSheetRef.current) {
        bottomSheetRef.current.close();
      }
    }
  }, []);

  const onScreenLayout = () => {
    setIsLayoutReady(true);
  };

  if (post === undefined) return <Loader />;

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#000" }}
      onLayout={onScreenLayout}
    >
      <StatusBar barStyle={"light-content"} />
      <View>
        <View style={styles.headerContainer}>
          <TouchableOpacity
            style={styles.iconBack}
            onPress={() => navigate.back()}
          >
            <Ionicons
              name="arrow-back-outline"
              color={COLORS.white}
              size={18}
            />
          </TouchableOpacity>
          <Text style={styles.headerTittle}>{post?.user?.username}'s post</Text>
        </View>
        <Post item={post} user={post?.user} openBottomSheet={openBottomSheet} />
        <Portal>
          <BottomSheet
            ref={bottomSheetRef}
            onChange={handleSheetChanges}
            snapPoints={["70%"]}
            backgroundStyle={{
              backgroundColor: COLORS.background,
            }}
            enableContentPanningGesture={false}
            handleIndicatorStyle={{ backgroundColor: COLORS.white }}
            footerComponent={(props) => (
              <CustomFooter {...props} postId={id || ""} />
            )}
            enablePanDownToClose={true}
            detached={true}
            topInset={50}
            animateOnMount={true}
            index={-1}

            // onClose={() => setIsShowComment(false)}
          >
            <Text style={styles.headerComments}>Comments</Text>
            <BottomSheetView style={{ flex: 1 }}>
              {id ? <Comments postId={id} /> : null}
            </BottomSheetView>
          </BottomSheet>
        </Portal>
      </View>
    </SafeAreaView>
  );
}
