import {
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { styles } from "@/styles/user.styles";
import { COLORS } from "@/constants/theme";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import Loader from "@/components/Loader";
import Stats from "@/components/Stats";
import PostList from "@/components/PostList";
import { Portal } from "@gorhom/portal";
import BottomSheet, {
  BottomSheetView,
  BottomSheetFlashList,
  BottomSheetFooter,
  useBottomSheet,
} from "@gorhom/bottom-sheet";

export default function ProfileScreen() {
  const { id } = useLocalSearchParams();
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const bottomSheetRef = useRef<BottomSheet>(null);
  const inset = useSafeAreaInsets();

  const navigate = useRouter();

  const userData = useQuery(api.users.getUserDataById, {
    _id: id as Id<"users">,
  });

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
  const handleFollow = useMutation(api.users.handleFollow);

  const handleSaveChanges = async () => {
    const resposnse = await updateChanges({ bio: bio, username: username });

    if (bottomSheetRef.current) {
      bottomSheetRef.current.close();
    }
  };

  const handleFollowAction = async () => {
    const response = await handleFollow({ following: id as Id<"users"> });
  };

  useEffect(() => {
    if (userData?.username) {
      setUsername(userData.username);
    }
    if (userData?.bio) {
      setBio(userData.bio);
    }
  }, [userData]);

  if (userData === undefined) return <Loader />;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar barStyle={"light-content"} />
      <View style={styles.headerContainer}>
        <TouchableOpacity
          style={styles.iconBack}
          onPress={() => navigate.back()}
        >
          <Ionicons name="arrow-back-outline" color={COLORS.white} size={18} />
        </TouchableOpacity>
        <Text style={styles.headerTittle}>{userData.username}</Text>
      </View>
      <Stats data={userData} />
      <Text style={styles.fullname}>{userData?.fullname}</Text>
      <Text style={styles.bio}>{userData?.bio}</Text>
      <View style={styles.containerButton}>
        {userData.isYou ? (
          <TouchableOpacity
            style={[styles.editProfile]}
            onPress={() => handleEditProfile()}
          >
            <Text style={{ color: COLORS.white }}>Edit Profile</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={() => handleFollowAction()}
            style={[
              styles.editProfile,
              {
                backgroundColor:
                  userData.status.isFollowYou && userData.status.isFollowByYou
                    ? COLORS.surface
                    : userData.status.isFollowByYou
                      ? COLORS.secondary
                      : COLORS.primary,
              },
            ]}
          >
            <Text style={{ color: COLORS.white }}>
              {userData.status.isFollowYou && userData.status.isFollowByYou
                ? "Unfollow"
                : userData.status.isFollowYou
                  ? "Follow back"
                  : userData.status.isFollowByYou
                    ? "Followed"
                    : "Follow"}
            </Text>
          </TouchableOpacity>
        )}
        <View style={styles.containerShare}>
          <Ionicons
            // onPress={() => handleShare()}
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
        <PostList data={userData?.posts} />
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
    </SafeAreaView>
  );
}
