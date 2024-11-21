import {
  View,
  StyleSheet,
  FlatList,
  Alert,
  ImageBackground,
} from "react-native";
import { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { useSelector } from "react-redux";

import Button from "../components/UI/Button";
import { getAllAccomodation } from "../api/http";
import Loading from "../components/UI/Loading";
import AccItem from "../components/accomodation/AccItem";
import GlobalStyles from "../util/GlobalStyles";

function renderAccItem(itemData) {
  return <AccItem acc={itemData.item} />;
}

function Accomodation({ navigation }) {
  const [accs, setAccs] = useState([]);
  const [isLoading, setIsloading] = useState(true);
  const [isRoom, setIsRoom] = useState(false);
  const focused = useIsFocused();
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  useEffect(() => {
    const fetchAccomodation = async () => {
      const res = await getAllAccomodation();
      if (res.status === "success") {
        setAccs(res.data.accomodations);
        setIsloading(false);
      } else {
        Alert.alert("Error fetching Data", res.message);
        setIsloading(false);
      }
    };
    fetchAccomodation();
  }, [focused]);

  if (isLoading) {
    return <Loading />;
  }

  const displayRooms = () => {
    setIsRoom(true);
  };
  const displayApartments = () => {
    setIsRoom(false);
  };

  let data = [];

  if (isRoom) {
    data = accs.filter((el) => el.category === "room");
  } else {
    data = accs.filter((el) => el.category === "apartment");
  }

  return (
    <ImageBackground
      style={styles.screen}
      source={require("../assets/bg3.jpg")}
    >
      <View style={styles.screen}>
        <View style={styles.btnContainer}>
          <Button title="Apartments" onPress={displayApartments} />
          <Button title="Rooms" onPress={displayRooms} />
        </View>
        <FlatList
          style={styles.list}
          data={data}
          renderItem={renderAccItem}
          keyExtractor={(item) => item._id}
        />
        {!isLoggedIn && (
          <View style={styles.btnContainer}>
            <Button
              title="Sign up"
              onPress={() => navigation.navigate("Signup")}
            />
            <Button
              title="Login"
              onPress={() => navigation.navigate("Login")}
            />
          </View>
        )}
      </View>
    </ImageBackground>
  );
}

export default Accomodation;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.transparentBlack,
  },
  btnContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    gap: 6,
    padding: 8,
  },
  list: {
    flex: 1,
    maxHeight: 600,
  },
});
