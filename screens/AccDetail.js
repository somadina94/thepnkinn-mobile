import React from "react";
import { useSelector } from "react-redux";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Dimensions,
  Image,
  ImageBackground,
} from "react-native";
import Swiper from "react-native-swiper";
import GlobalStyles from "../util/GlobalStyles";
import { formatAmount } from "../util/helpers";
import Button from "../components/UI/Button";

function AccDetail({ route, navigation }) {
  const { params } = route;
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);

  // Sample data array for testing (ensure data.gallery is an array of image URLs)
  const data = params?.acc || {
    gallery: [],
  };

  return (
    <ImageBackground
      style={styles.screen}
      source={require("../assets/bg3.jpg")}
    >
      <ScrollView style={styles.container}>
        <Text style={styles.name}>{data.name}</Text>
        <Text style={styles.title}>N{formatAmount(data.pricePerNight)}</Text>
        <Swiper
          style={styles.wrapper}
          showsButtons={true} // Set to true to show navigation buttons
          autoplay={true} // Set to true if you want the images to auto-scroll
          autoplayTimeout={3} // Duration between each auto-scroll in seconds
        >
          {data.gallery.map((imageUri, index) => (
            <View key={index} style={styles.imageContainer}>
              <Image source={{ uri: imageUri }} style={styles.image} />
            </View>
          ))}
        </Swiper>
        <View style={styles.btnContainer}>
          <Button
            title="Book now"
            onPress={
              isLoggedIn
                ? () => navigation.navigate("Book", { acc: data })
                : () => navigation.navigate("Login")
            }
          />
        </View>
        <View style={styles.descriptionContainer}>
          <Text style={styles.title}>Description</Text>
          <Text style={styles.text}>{data.description}</Text>
        </View>
        <View style={styles.location}>
          <Text style={styles.title}>Location</Text>
          <Text style={styles.text}>{data.location}</Text>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

export default AccDetail;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    width: Dimensions.get("window").width * 1,
    alignSelf: "center",
  },
  container: {
    flex: 1,
    padding: 12,
  },
  wrapper: {
    maxHeight: 400,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    maxHeight: 400,
  },
  image: {
    width: Dimensions.get("window").width * 0.95,
    height: "100%",
    borderRadius: 8,
    resizeMode: "cover",
  },
  name: {
    backgroundColor: GlobalStyles.colors.transparentWhite,
    color: GlobalStyles.colors.secondry800,
    fontSize: 24,
    padding: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  title: {
    backgroundColor: GlobalStyles.colors.transparentWhite,
    color: GlobalStyles.colors.gray800,
    fontSize: 24,
    padding: 4,
    borderRadius: 12,
    marginBottom: 12,
  },
  descriptionContainer: {
    borderRadius: 12,
    flex: 1,
    marginBottom: 12,
  },
  location: {
    marginBottom: 40,
  },
  text: {
    backgroundColor: GlobalStyles.colors.transparentWhite,
    color: GlobalStyles.colors.gray800,
    fontSize: 16,
    padding: 12,
    overflow: "scroll",
    borderRadius: 12,
  },
  btnContainer: {
    height: 50,
    marginBottom: 12,
    marginTop: 12,
  },
});
