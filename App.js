import { StatusBar } from "expo-status-bar";
import { useState, useEffect } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { useSelector, useDispatch } from "react-redux";
import { Ionicons } from "@expo/vector-icons";

import store from "./store/store";
import { persistor } from "./store/store";

import { getMe } from "./api/http";
import { authActions } from "./store/authSlice";
import Loading from "./components/UI/Loading";

import Accomodation from "./screens/Accomodation";
import GlobalStyles from "./util/GlobalStyles";
import AccDetail from "./screens/AccDetail";
import Signup from "./screens/Signup";
import Login from "./screens/Login";
import ForgotPassword from "./screens/ForgotPassword";
import UpdatePassword from "./screens/UpdatePassword";
import Terms from "./screens/Terms";
import Bookings from "./screens/Bookings";
import Settings from "./screens/Settings";
import UpdateAccount from "./screens/UpdateAccount";
import Privacy from "./screens/Privacy";

import Contact from "./screens/Contact";
import Book from "./screens/Book";
import { Image } from "react-native";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function StackNavigation() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.colors.primary800 },
        headerTintColor: GlobalStyles.colors.white900,
        headerRight: () => (
          <Image
            style={{ width: 34, height: 34, borderRadius: 12 }}
            source={require("./assets/adaptive-icon.png")}
          />
        ),
      }}
    >
      <Stack.Screen
        name="Accomodation"
        component={Accomodation}
        options={{ title: "Accomodations" }}
      />
      <Stack.Screen
        name="Detail"
        component={AccDetail}
        options={{ title: "Details" }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{ title: "Sign up" }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{ title: "Login" }}
      />
      <Stack.Screen
        name="Terms"
        component={Terms}
        options={{ title: "T & C" }}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={{ title: "Forgot Password" }}
      />
      <Stack.Screen
        name="Privacy"
        component={Privacy}
        options={{ title: "Privacy Policy" }}
      />
    </Stack.Navigator>
  );
}

function AuthenticatedStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.colors.primary800 },
        headerTintColor: GlobalStyles.colors.white900,
        headerRight: () => (
          <Image
            style={{ width: 34, height: 34, borderRadius: 12 }}
            source={require("./assets/adaptive-icon.png")}
          />
        ),
      }}
    >
      <Stack.Screen
        name="Accomodation"
        component={Accomodation}
        options={{ title: "Accomodations" }}
      />
      <Stack.Screen
        name="Detail"
        component={AccDetail}
        options={{ title: "Details" }}
      />
      <Stack.Screen name="Book" component={Book} options={{ title: "Book" }} />
    </Stack.Navigator>
  );
}

function BookingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.colors.primary800 },
        headerTintColor: GlobalStyles.colors.white900,
        headerRight: () => (
          <Image
            style={{ width: 34, height: 34, borderRadius: 12 }}
            source={require("./assets/adaptive-icon.png")}
          />
        ),
      }}
    >
      <Stack.Screen
        name="Bookings-list"
        component={Bookings}
        options={{
          title: "Bookings",
        }}
      />
    </Stack.Navigator>
  );
}

function SettingsStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: GlobalStyles.colors.primary800 },
        headerTintColor: GlobalStyles.colors.white900,
        headerRight: () => (
          <Image
            style={{ width: 34, height: 34, borderRadius: 12 }}
            source={require("./assets/adaptive-icon.png")}
          />
        ),
      }}
    >
      <Stack.Screen
        name="Account-menu"
        component={Settings}
        options={{ title: "Account" }}
      />
      <Stack.Screen
        name="UpdateAccount"
        component={UpdateAccount}
        options={{ title: "Update Account" }}
      />
      <Stack.Screen
        name="UpdatePassword"
        component={UpdatePassword}
        options={{ title: "Update Password" }}
      />
    </Stack.Navigator>
  );
}

function AuthenticatedTab() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: GlobalStyles.colors.primary800 },
        headerTintColor: GlobalStyles.colors.white900,
        tabBarActiveTintColor: GlobalStyles.colors.white900,
        tabBarInactiveTintColor: GlobalStyles.colors.gray100,
      }}
    >
      <Tab.Screen
        name="Home"
        component={AuthenticatedStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="home-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Bookings"
        component={BookingsStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="calendar-outline" size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Contact"
        component={Contact}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="phone-portrait-outline" size={size} color={color} />
          ),
          headerShown: true,
          headerTintColor: GlobalStyles.colors.white900,
          headerStyle: { backgroundColor: GlobalStyles.colors.primary800 },
          title: "Contact Us",
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsStack}
        options={{
          tabBarIcon: ({ color, size }) => (
            <Ionicons name="settings-outline" size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

function Navigation() {
  const token = useSelector((state) => state.auth.token);
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const [isLoading, setIsloading] = useState(true);

  useEffect(() => {
    const fetchMe = async () => {
      const res = await getMe(token);
      if (res.status === "success") {
        dispatch(authActions.refresh({ user: res.data.user }));
        setIsloading(false);
      } else {
        dispatch(authActions.logout());
        setIsloading(false);
      }
    };
    fetchMe();
  }, [token, dispatch]);

  if (isLoading) {
    return <Loading />;
  }
  return (
    <NavigationContainer>
      {!isLoggedIn && <StackNavigation />}
      {isLoggedIn && <AuthenticatedTab />}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <>
      <StatusBar style="light" />
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <Navigation />
        </PersistGate>
      </Provider>
    </>
  );
}
