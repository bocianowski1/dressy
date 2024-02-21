import { CartProvider } from "../hooks/cart";
import { LikedItemsProvider } from "../hooks/liked-items";
import { WebSocketProvider } from "../hooks/socket-context";
import { UserProvider, useUser } from "../hooks/user-context";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRouter } from "expo-router";
import { useEffect } from "react";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    roboto: require("../assets/fonts/Roboto-Regular.ttf"),
    robotoBold: require("../assets/fonts/Roboto-Bold.ttf"),
    robotoLight: require("../assets/fonts/Roboto-Light.ttf"),
    urban: require("../assets/fonts/RubikBubbles-Regular.ttf"),
    classic: require("../assets/fonts/Allura-Regular.ttf"),
    sleek: require("../assets/fonts/Koulen-Regular.ttf"),
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <UserProvider>
      <LikedItemsProvider>
        <CartProvider>
          <WebSocketProvider>
            <RootLayoutNav />
          </WebSocketProvider>
        </CartProvider>
      </LikedItemsProvider>
    </UserProvider>
  );
}

function RootLayoutNav() {
  const router = useRouter();
  const { user, token } = useUser();

  useEffect(() => {
    if (!user && !token) {
      console.log("no user in root layout useEffect", user, token);
      router.replace("/(auth)/login");
    }
  }, [user]);

  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/login" options={{ headerShown: false }} />
      <Stack.Screen name="(auth)/register" options={{ headerShown: false }} />
      <Stack.Screen name="chat/[partner]" options={{ headerShown: false }} />
      <Stack.Screen name="listing/[id]" options={{ headerShown: false }} />
      <Stack.Screen
        name="collection/[collection]"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}
