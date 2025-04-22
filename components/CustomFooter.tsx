import React, { useCallback, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import {
  BottomSheetFooter,
  BottomSheetFooterProps,
  BottomSheetTextInput,
  useBottomSheet,
} from "@gorhom/bottom-sheet";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { toRad } from "react-native-redash";
import { Ionicons } from "@expo/vector-icons";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { COLORS } from "@/constants/theme";

interface CustomFooterProps extends BottomSheetFooterProps {
  postId: any;
}

const CustomFooter = ({
  animatedFooterPosition,
  postId,
}: CustomFooterProps) => {
  const { bottom: bottomSafeArea } = useSafeAreaInsets();
  const { expand, collapse, animatedIndex } = useBottomSheet();
  const [comment, setComment] = useState("");

  const storeComment = useMutation(api.posts.addCommentOnPost);

  const handleArrowPress = useCallback(() => {
    if (animatedIndex.value === 0) {
      // expand();
    } else {
      // collapse();
    }
  }, [expand, collapse, animatedIndex]);

  const handleAddComment = async (postId: any) => {
    try {
      if (!comment) return;
      const response = await storeComment({ content: comment, postId: postId });
    } catch (error) {
      setComment("");
      console.error("Server Error", error);
    } finally {
      setComment("");
    }
  };

  return (
    <BottomSheetFooter
      // bottomInset={bottomSafeArea}
      animatedFooterPosition={animatedFooterPosition}
      style={{
        backgroundColor: COLORS.background,
        paddingBottom: bottomSafeArea,
      }}
    >
      <View style={[styles.contentContainer]}>
        <BottomSheetTextInput
          onChangeText={(text) => setComment(text)}
          value={comment}
          placeholder="Add a comment..."
          style={styles.textInput}
          placeholderTextColor={COLORS.white}
        />
        <TouchableOpacity
          style={{ marginLeft: 10 }}
          onPress={() => handleAddComment(postId)}
        >
          <Ionicons name="send" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </BottomSheetFooter>
  );
};

// footer style
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: "grey",
  },
  textInput: {
    flex: 1,
    alignItems: "center",
    alignSelf: "stretch",
    padding: 12,
    borderRadius: 12,
    backgroundColor: "grey",
    color: "white",
    textAlign: "left",
  },
  contentContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 12,
    alignItems: "center",
  },
});

export default CustomFooter;
