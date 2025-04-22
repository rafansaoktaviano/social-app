import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "@/constants/theme";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
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
  iconBack: {
    position: "absolute",
    left: 10,
    padding: 5,
  },
  userAvatarComment: {
    width: 72,
    height: 72,
    borderRadius: "50%",
    marginRight: 12,
    borderWidth: 2,
    borderColor: COLORS.surfaceLight,
  },
  section: {
    padding: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  firstText: {
    color: COLORS.white,
  },
  secondText: {
    color: COLORS.grey,
  },
  containerText: {
    alignItems: "center",
  },
  statsText: {
    flex: 1,
    justifyContent: "center",
    flexDirection: "row",
    gap: 20,
  },
  fullname: {
    paddingLeft: 20,
    color: COLORS.white,
    fontWeight: "bold",
  },
  bio: {
    color: COLORS.white,
    paddingLeft: 20,
    paddingRight: 20,
  },
  containerShare: {
    padding: 10,
    backgroundColor: COLORS.surface,
    borderRadius: 10,
  },
  containerButton: {
    flexDirection: "row",
    padding: 20,
    gap: 10,
  },
  editProfile: {
    flex: 1,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  containerPostList: {
    width: "100%",
    height: "100%",
  },
  containerEdit: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  editProfileText: {
    color: COLORS.white,
    fontSize: 18,
  },
});
