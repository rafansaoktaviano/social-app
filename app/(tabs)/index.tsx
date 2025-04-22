import { useAuth, useUser } from "@clerk/clerk-expo";
import {
  Text,
  TouchableOpacity,
  View,
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@/styles/feed.styles";
import { COLORS } from "@/constants/theme";
import {
  useFonts,
  JetBrainsMono_500Medium,
} from "@expo-google-fonts/jetbrains-mono";
import axios from "axios";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { api } from "@/convex/_generated/api";
import Loader from "@/components/Loader";
import Posts from "@/components/Posts";
import Stories from "@/components/Stories";
import { useQuery } from "convex/react";
import BottomSheet, {
  BottomSheetView,
  BottomSheetFlashList,
  BottomSheetFooter,
  useBottomSheet,
} from "@gorhom/bottom-sheet";
import Comments from "@/components/Comments";
import { useNavigation } from "expo-router";
import { useTabVisibility } from "@/context/TabVisibilityContext";
import { Portal } from "@gorhom/portal";
import CustomFooter from "@/components/CustomFooter";
import CustomFooterTest from "@/components/CustomFooterTest";

type UserType = {
  picture: { large: string };
};

export default function Index() {
  const bottomSheetRef = useRef<BottomSheet>(null);
  const { signOut, isSignedIn } = useAuth();
  const { user } = useUser();
  const [users, setUsers] = useState<UserType[] | any>([]);
  const [postId, setPostId] = useState<any | null>(null);
  const [isShowComment, setIsShowComment] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const post = useQuery(api?.posts?.getPosts, {});

  const [fontsLoaded] = useFonts({
    JetBrainsMono_500Medium,
  });
  

  const fetchRandomUser = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get("https://randomuser.me/api/?results=20");
      const userData = response.data.results;
      const randomImage = `https://picsum.photos/200?random=${Math.floor(Math.random() * 1000)}`;

      const modifiedUsers = [
        {
          name: { first: "You" },
          picture: { large: randomImage },
        },
        ...userData,
      ];

      setUsers(modifiedUsers as UserType[]);
    } catch (error) {
      setIsLoading(false);
      console.error("Error fetching user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isSignedIn) {
      fetchRandomUser();
    }

    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    if (index !== 0) {
    } else {
      if (bottomSheetRef.current) {
        bottomSheetRef.current.close();
      }
    }
  }, []);

  const openBottomSheet = (postId: any) => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.snapToIndex(1);
      setPostId(postId);
      setIsShowComment(true);
    }
  };
  const closeBottomSheet = () => {
    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
      setIsShowComment(false);
    }
  };

  if (post === undefined) return <Loader />;
  if (isLoading === true) return <Loader />;

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#000",
        opacity: isShowComment ? 0.9 : 1,
      }}
    >
      <StatusBar barStyle={"light-content"} />
      <View>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTittle}>social</Text>
          <TouchableOpacity onPress={() => signOut()}>
            <Ionicons name="exit-outline" color={COLORS.white} size={18} />
          </TouchableOpacity>
        </View>

        {/* STORIES SECTION */}
        <View style={styles.storiesContainer}>
          <Stories users={users} />
        </View>
        {/* END STORIES SECTION */}

        {/* POST SECTION */}
        {post?.length === 0 ? (
          <NoPostsFound />
        ) : (
          <Posts post={post} user={user} openBottomSheet={openBottomSheet} />
        )}
        {/* END POST SECTION */}
        {/* <Modal visible={isShowComment} transparent={true}> */}
        <Portal>
          <BottomSheet
            ref={bottomSheetRef}
            onChange={handleSheetChanges}
            index={-1}
            snapPoints={["70%"]}
            backgroundStyle={{
              backgroundColor: COLORS.background,
            }}
            enableContentPanningGesture={false}
            handleIndicatorStyle={{ backgroundColor: COLORS.white }}
            footerComponent={(props) => (
              <CustomFooter {...props} postId={postId || ""} />
            )}
            enablePanDownToClose={true}
            detached={true}
            topInset={50}
            onClose={() => setIsShowComment(false)}
          >
            <Text style={styles.headerComments}>Comments</Text>
            <BottomSheetView style={{ flex: 1 }}>
              {postId ? <Comments postId={postId} /> : null}
            </BottomSheetView>
          </BottomSheet>
        </Portal>
      </View>
    </SafeAreaView>
  );
}

const NoPostsFound = () => {
  return (
    <View
      style={{
        height: 600,
        backgroundColor: COLORS.background,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ fontSize: 20, color: COLORS.primary }}>No posts yet</Text>
    </View>
  );
};
