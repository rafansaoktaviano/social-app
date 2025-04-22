import Loader from "@/components/Loader";
import PostList from "@/components/PostList";
import { COLORS } from "@/constants/theme";
import { api } from "@/convex/_generated/api";
import { styles } from "@/styles/profile.styles";
import { useAuth } from "@clerk/clerk-expo";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetView,
  BottomSheetFlashList,
  BottomSheetFooter,
  useBottomSheet,
} from "@gorhom/bottom-sheet";
import { Portal } from "@gorhom/portal";
import { useMutation, useQuery } from "convex/react";
import { Image } from "expo-image";
import React, {
  Component,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import {
  Button,
  SafeAreaView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Share } from "react-native";
import { mutation } from "@/convex/_generated/server";
import Stats from "@/components/Stats";

export default function ProfileScreen() {
  const { signOut, isSignedIn } = useAuth();
  const inset = useSafeAreaInsets();
  const bottomSheetRef = useRef<BottomSheet>(null);
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const data = useQuery(api.users.getUserData);

  const handleSheetChanges = useCallback((index: number) => {
    console.log(index);

    // if (index !== 0) {
    // } else {
    //   if (bottomSheetRef.current) {
    //     bottomSheetRef.current.close();
    //   }
    // }
  }, []);

  const handleEditProfile = () => {
    if (bottomSheetRef) {
      bottomSheetRef.current?.expand();
    }
  };

  const handleCloseEditProfile = () => {
    if (bottomSheetRef) {
      bottomSheetRef.current?.close();
    }
  };
  const updateChanges = useMutation(api.users.updateUsernameAndBio);

  const handleSaveChanges = async () => {
    const resposnse = await updateChanges({ bio: bio, username: username });

    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };

  const handleShare = async () => {
    try {
      const postId = data?._id;
      const shareLink = `myapp://post/${postId}`;
      const result = await Share.share({
        message: shareLink,
        url: shareLink,
        title: "Share Profile",
      });
      console.log("result", result);
    } catch (error) {
      console.error("Error sharing", error);
    }
  };

  useEffect(() => {
    if (data?.username) {
      setUsername(data.username);
    }
    if (data?.bio) {
      setBio(data.bio);
    }
  }, [data]);

  if (data === undefined) return <Loader />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar barStyle={"light-content"} />
      <View>
        <View style={styles.headerContainer}>
          <Text style={styles.headerTittle}>{data?.username}</Text>
          <TouchableOpacity onPress={() => signOut()}>
            <Ionicons name="exit-outline" color={COLORS.white} size={18} />
          </TouchableOpacity>
        </View>

        <Stats data={data} />

        <Text style={styles.fullname}>{data?.fullname}</Text>
        <Text style={styles.bio}>{data?.bio}</Text>
        <View style={styles.containerButton}>
          <TouchableOpacity
            style={styles.editProfile}
            onPress={() => handleEditProfile()}
          >
            <Text style={{ color: COLORS.white }}>Edit Profile</Text>
          </TouchableOpacity>
          <View style={styles.containerShare}>
            <Ionicons
              onPress={() => handleShare()}
              name="share-outline"
              size={24}
              color={COLORS.primary}
            />
          </View>
        </View>
        <View
          style={[
            styles.containerPostList,
            { paddingBottom: inset.bottom + 550 },
          ]}
        >
          <PostList data={data?.posts} />
        </View>

        <Portal>
          <BottomSheet
            ref={bottomSheetRef}
            onChange={handleSheetChanges}
            index={-1}
            snapPoints={["60%"]}
            backgroundStyle={{
              backgroundColor: COLORS.background,
            }}
            enableContentPanningGesture={false}
            handleIndicatorStyle={{ backgroundColor: COLORS.white }}
            handleComponent={null}
            enablePanDownToClose={true}
            detached={true}
            topInset={50}
            style={{ padding: 20 }}
          >
            <BottomSheetView style={{ flex: 1 }}>
              <View style={styles.containerEdit}>
                <Text style={styles.editProfileText}>Edit Profile</Text>
                <Ionicons
                  onPress={() => handleCloseEditProfile()}
                  name="close"
                  size={24}
                  color={COLORS.white}
                />
              </View>
              <Text
                style={{ color: COLORS.grey, marginBottom: 5, marginTop: 20 }}
              >
                Name
              </Text>
              <TextInput
                onChangeText={setUsername}
                value={username}
                style={{
                  color: COLORS.white,
                  borderBottomWidth: 1,
                  padding: 10,
                  backgroundColor: COLORS.surfaceLight,
                  borderRadius: 8,
                }}
                placeholder="username"
              />
              <Text
                style={{ color: COLORS.grey, marginBottom: 5, marginTop: 20 }}
              >
                Bio
              </Text>
              <TextInput
                value={bio}
                multiline
                numberOfLines={4}
                placeholder="bio"
                onChangeText={setBio}
                style={{
                  color: COLORS.white,
                  borderBottomWidth: 1,
                  marginBottom: 20,
                  padding: 10,
                  backgroundColor: COLORS.surfaceLight,
                  borderRadius: 8,
                  height: 200,
                  textAlignVertical: "top",
                }}
              />
              <TouchableOpacity
                style={{
                  width: "100%",
                  padding: 10,
                  backgroundColor: COLORS.primary,
                  borderRadius: 10,
                  position: "absolute",
                  bottom: 50,
                }}
                onPress={() => handleSaveChanges()}
              >
                <Text style={{ color: COLORS.background, textAlign: "center" }}>
                  Save Changes
                </Text>
              </TouchableOpacity>
            </BottomSheetView>
          </BottomSheet>
        </Portal>
      </View>
    </SafeAreaView>
  );
}
