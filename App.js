import React, { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Location from "expo-location";
import * as BackgroundFetch from "expo-background-fetch";
import * as TaskManager from "expo-task-manager";
import { auth, firestore } from "./firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import Constants from "expo-constants";
import { Button } from "react-native";

import HomeScreen from "./src/home";
import WelcomeScreen from "./src/welcome";
import LoginScreen from "./src/login";
import SignUpScreen from "./src/signup";
import Plots from "./src/LinearPlot";
import NavBar from "./.components/NavBar";
import MapScreen from "./src/map";

const BACKGROUND_FETCH_TASK = "background-fetch-task";
const Stack = createNativeStackNavigator();
const apiKey = Constants.expoConfig.extra.apiKey;
const AirPollutionDB = collection(firestore, "airPollution");

function HomeWithNavBar({ navigation }) {
  return (
    <>
      <HomeScreen />
      <NavBar navigation={navigation} />
    </>
  );
}

function PlotsWithNavBar({ navigation }) {
  return (
    <>
      <Plots />
      <NavBar navigation={navigation} />
    </>
  );
}

function PlotsWithMap({ navigation }) {
  return (
    <>
      <MapScreen />
      <NavBar navigation={navigation} />
    </>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  const [hasPermission, setHasPermission] = useState(null);

  const getLocationPermission = async () => {
    const { status } = await Location.requestForegroundPermissionsAsync();
    setHasPermission(status === "granted");
  };

  useEffect(() => {
    getLocationPermission();
  }, []);

  useEffect(() => {
    if (user && hasPermission) {
      fetchLocAndPollution();

      const intervalId = setInterval(
        () => {
          fetchLocAndPollution();
        },
        3 * 60 * 1000,
      );

      return () => clearInterval(intervalId);
    }
  }, [user]);

  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Home" : "Welcome"}>
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              options={{ title: "Calidad del Aire", headerShown: false }}
            >
              {(props) => <HomeWithNavBar {...props} />}
            </Stack.Screen>
            <Stack.Screen
              name="Plots"
              options={{ title: "Plots", headerShown: false }}
            >
              {(props) => <PlotsWithNavBar {...props} />}
            </Stack.Screen>
            <Stack.Screen
              name="Map"
              options={{ title: "Maps", headerShown: false }}
            >
              {(props) => <PlotsWithMap {...props} />}
            </Stack.Screen>
            <Stack.Screen
              name="Logout"
              options={{ title: "Logout", headerShown: false }}
            >
              {({ navigation }) => {
                auth.signOut().then(() => {
                  navigation.replace("Welcome");
                });
                return null;
              }}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{ title: "Welcome", headerShown: false }}
            />
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{ title: "Login", headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ title: "SignUp", headerShown: false }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const fetchLocAndPollution = async () => {
  try {
    console.log("Getting Coordinates...");
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.High,
    });

    const { latitude, longitude } = location.coords;
    console.log("Awaiting API response...");
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/air_pollution?lat=${latitude}&lon=${longitude}&appid=${apiKey}`,
    );
    const data = await response.json();

    if (data && data.list && data.list.length > 0) {
      const components = data.list[0].components;

      await addDoc(AirPollutionDB, {
        userId: auth.currentUser.uid,
        userEmail: auth.currentUser.email,
        timestamp: new Date().toISOString(),
        location: { latitude, longitude },
        co: components.co,
        no: components.no,
        no2: components.no2,
        o3: components.o3,
        so2: components.so2,
        pm2_5: components.pm2_5,
        pm10: components.pm10,
        nh3: components.nh3,
      });

      console.log("Data saved to Firestore successfully");
    }
  } catch (error) {
    console.error("Location Access Failed");
    return 0;
  }
};
