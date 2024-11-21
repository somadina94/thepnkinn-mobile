import { View, Text, StyleSheet, ImageBackground } from "react-native";
import { useDispatch } from "react-redux";

import Icon from "../components/icon/Icon";
import GlobalStyles from "../util/GlobalStyles";
import { authActions } from "../store/authSlice";

function Settings({ navigation }) {
  const dispatch = useDispatch();

  const logoutHandler = () => {
    dispatch(authActions.logout());
  };
  return (
    <ImageBackground
      style={styles.screen}
      source={require("../assets/bg2.jpg")}
    >
      <View style={styles.screen}>
        <View style={styles.content}>
          <Icon
            title="Update Account"
            name="person-outline"
            size={24}
            color={GlobalStyles.colors.white900}
            displayTitle={true}
            onPress={() => navigation.navigate("UpdateAccount")}
          />
          <Icon
            title="Update Password"
            name="key-outline"
            size={24}
            color={GlobalStyles.colors.white900}
            displayTitle={true}
            onPress={() => navigation.navigate("UpdatePassword")}
          />
        </View>
        <View style={styles.logoutContainer}>
          <Icon
            title="Sign Out"
            color={GlobalStyles.colors.secondry800}
            size={48}
            name="power-outline"
            displayTitle={true}
            onPress={logoutHandler}
          />
        </View>
      </View>
    </ImageBackground>
  );
}

export default Settings;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  content: {
    marginHorizontal: 12,
    marginVertical: 180,
    gap: 24,
    height: 100,
    backgroundColor: GlobalStyles.colors.transparentBlack,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    borderRadius: 12,
  },
  logoutContainer: {
    backgroundColor: GlobalStyles.colors.transparentBlack,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 12,
    borderRadius: 12,
    justifyContent: "center",
    padding: 12,
  },
});
