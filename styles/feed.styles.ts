import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "@/constants/theme";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
  storiesContainer: {
    flexDirection: "row",
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  storyList: {},
  story: {
    width: 50,
    backgroundColor: "red",
    height: 50,
    borderRadius: "50%",
  },
  containerStory: {
    width: 60,
    height: 60,
    borderWidth: 2,
    borderColor: COLORS.primary,
    borderRadius: "50%",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  storyImage: {
    width: "100%",
    height: "100%",
    borderRadius: "50%",
  },
  storyText: {
    color: COLORS.white,
    textAlign: "center",
    marginRight: 10,
    fontSize: 12,
    marginTop: 3,
  },
  userAvatar: {
    width: 24,
    height: 24,
    borderRadius: 18,
    marginRight: 12,
  },
  usernameText: {
    color: COLORS.white,
    fontWeight: 600,
  },
  postContainer: {
    width: width,
    height: height,
  },
  postHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  containerPostHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
  },
  postImage: {
    width: width,
    height: width,
    backgroundColor: COLORS.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  postPreviewImage: {
    width: "100%",
    height: "100%",
  },
  postActions: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 10,
  },
  postActionLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  bottomContainer: {
    padding: 10,
  },
  textCaption: {
    color: COLORS.white,
  },
  textComment: {
    color: COLORS.grey,
    fontSize: 12,
  },
  containerCommentModal: {
    backgroundColor: COLORS.background,
    opacity: 0.5,
    height: "100%",
  },
  upperCommentModal: {
    height: 500,
  },
  lowerCommentModal: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: "20%",
    borderTopRightRadius: "20%",
  },
  headerComments: {
    textAlign: "center",
    fontSize: 18,
    fontWeight: "bold",
    borderBottomWidth: 0.2,
    paddingBottom: 10,
    borderColor: COLORS.grey,
    color: COLORS.white,
  },
  containerComment: {
    flexDirection: "row",
    borderBottomWidth: 0.2,
    padding: 16,
    borderColor: COLORS.grey,
  },
  userAvatarComment: {
    width: 32,
    height: 32,
    borderRadius: 18,
    marginRight: 12,
  },
  caption: {
    color: COLORS.white,
    fontSize: 14
  },
  captionTime: {
    color: COLORS.grey,
    fontSize: 12,
   marginTop: 3
  }
});
