import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import AsyncStorage from "@react-native-async-storage/async-storage";
import HomeScreen from "./src/screens/HomeScreen";
import PreviewScreen from "./src/screens/PreviewScreen";
import SettingsScreen from "./src/screens/SettingsScreen";

const Stack = createNativeStackNavigator();
const KEY = "siteforge.geminiKey";

const navTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: "#0B1220",
    card: "#0B1220",
    text: "#F3F4F6",
    border: "transparent",
  },
};

export default function App() {
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    AsyncStorage.getItem(KEY).then((value) => {
      if (value) setApiKey(value);
    });
  }, []);

  async function onSaveKey(value) {
    setApiKey(value);
    if (value) await AsyncStorage.setItem(KEY, value);
    else await AsyncStorage.removeItem(KEY);
  }

  return (
    <NavigationContainer theme={navTheme}>
      <StatusBar style="light" />
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home">
          {(props) => <HomeScreen {...props} apiKey={apiKey} />}
        </Stack.Screen>
        <Stack.Screen name="Preview" component={PreviewScreen} />
        <Stack.Screen name="Settings">
          {(props) => <SettingsScreen {...props} apiKey={apiKey} onSaveKey={onSaveKey} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
