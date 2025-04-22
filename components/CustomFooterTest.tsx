import React, { useCallback, useMemo } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  BottomSheetFooter,
  BottomSheetFooterProps,
  useBottomSheet,
} from "@gorhom/bottom-sheet";
import { RectButton } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Animated, {
  Extrapolate,
  interpolate,
  useAnimatedStyle,
} from "react-native-reanimated";
import { toRad } from "react-native-redash";
import { Ionicons } from "@expo/vector-icons";

const AnimatedRectButton = Animated.createAnimatedComponent(RectButton);

// inherent the `BottomSheetFooterProps` to be able receive
// `animatedFooterPosition`.
interface CustomFooterProps extends BottomSheetFooterProps {}

const CustomFooterTest = ({ animatedFooterPosition }: CustomFooterProps) => {
  const { bottom: bottomSafeArea } = useSafeAreaInsets();
  const { expand, collapse, animatedIndex } = useBottomSheet();

  return (
    <BottomSheetFooter
      bottomInset={bottomSafeArea}
      animatedFooterPosition={animatedFooterPosition}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingVertical: 10,
        }}
      >
        <TextInput
          style={{
            flex: 1,
            backgroundColor: "#f2f2f2",
            padding: 10,
            borderRadius: 20,
          }}
          placeholder="Add a comment..."
        />
        <TouchableOpacity style={{ marginLeft: 10 }}>
          <Ionicons name="send" size={24} color="#007AFF" />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </BottomSheetFooter>
  );
};

// footer style
const styles = StyleSheet.create({
  container: {
    alignSelf: "flex-end",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 24,
    marginBottom: 12,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#80f",
    shadowOffset: {
      width: 0,
      height: 12,
    },
    shadowOpacity: 0.25,
    shadowRadius: 8.0,

    elevation: 8,
  },
  arrow: {
    fontSize: 20,
    height: 20,
    textAlignVertical: "center",
    fontWeight: "900",
    color: "#fff",
  },
});

export default CustomFooterTest;
