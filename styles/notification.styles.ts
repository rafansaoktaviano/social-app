import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "@/constants/theme";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  headerContainer: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  headerTittle: {
    color: COLORS.primary,
    fontSize: 24,
    fontFamily: "JetBrainsMono-Medium",
  },
  containerLoader: {
    alignItems: "center",
    height: height - 200,
  },
  userAvatarComment: {
    width: 54,
    height: 54,
    borderRadius: "50%",
    marginRight: 12,
    borderWidth: 2,
    borderColor: COLORS.surfaceLight,
  },
  postNotificationImage: {
    width: 54,
    height: 54,
    borderRadius: 18,
    marginRight: 12,
  },
  containerNotif: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  username: {
    color: COLORS.white,
    fontWeight: "600",
  },
  caption: {
    color: COLORS.grey,
  },
  time: {
    color: COLORS.grey,
    fontSize: 12,
    textTransform: "lowercase",
  },
});
