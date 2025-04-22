import { registerForPushNotificationsAsync } from "@/utils/registerForPushNotificationAsync";
import { Redirect } from "expo-router";
import React, { Component, useEffect } from "react";
import { Text, View } from "react-native";

export default function index() {
  

  return <Redirect href="/(auth)/login" />;
}
