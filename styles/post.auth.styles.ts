import { StyleSheet, Dimensions } from "react-native";
import { COLORS } from "@/constants/theme";

const { width, height } = Dimensions.get("window");

export const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: COLORS.background,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.surface,
  },
  headerTittle: {
    color: COLORS.primary,
    fontSize: 14,
    fontFamily: "JetBrainsMono-Medium",
  },
  iconBack: {
    position: "absolute",
    left: 10,
    padding: 5,
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
});
