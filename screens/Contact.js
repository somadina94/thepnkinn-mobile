import {
  View,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  ScrollView,
} from "react-native";
import GlobalStyles from "../util/GlobalStyles";
import Icon from "../components/icon/Icon";

function Contact() {
  return (
    <ImageBackground
      style={styles.screen}
      source={require("../assets/bg2.jpg")}
    >
      <ScrollView style={styles.screen}>
        <View style={styles.screen}>
          <View style={styles.container}>
            <View style={styles.logoContainer}>
              <Image
                style={styles.image}
                source={require("../assets/icon.png")}
              />
            </View>
            <View style={styles.content}>
              <Icon
                name="mail-outline"
                size={48}
                color={GlobalStyles.colors.white900}
                displayTitle={true}
                title="Email"
              />
              <Text style={styles.text}>
                info@thepnkinn.com, admin@thepnkinn.com
              </Text>
            </View>
            <View style={styles.content}>
              <Icon
                name="location-outline"
                size={48}
                color={GlobalStyles.colors.white900}
                displayTitle={true}
                title="Address 1"
              />
              <Text style={styles.text}>
                5/6, Sam Fadiya Street, Abesan Estate Rd, Ipaja, Lagos.
              </Text>
            </View>
            <View style={styles.content}>
              <Icon
                name="call-outline"
                size={48}
                color={GlobalStyles.colors.white900}
                displayTitle={true}
                title="Phone lines"
              />
              <Text style={styles.text}>+2347062140248, +2349087866624</Text>
            </View>
            <View style={styles.content}>
              <Icon
                name="location-outline"
                size={48}
                color={GlobalStyles.colors.white900}
                displayTitle={true}
                title="Address 2"
              />
              <Text style={styles.text}>
                No15, Ajaba Street Makinde Off Amule, Ipaja Ayobo, Lagos.
              </Text>
            </View>
            <View style={styles.content}>
              <Icon
                name="call-outline"
                size={48}
                color={GlobalStyles.colors.white900}
                displayTitle={true}
                title="Phone lines"
              />
              <Text style={styles.text}>+2347062098265, +2349087866625</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </ImageBackground>
  );
}

export default Contact;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    backgroundColor: GlobalStyles.colors.transparentBlack,
    ...GlobalStyles.elevated,
    borderRadius: 12,
    marginVertical: 20,
    paddingVertical: 10,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
  },
  title: {
    fontSize: 16,
    fontWeight: "800",
  },
  text: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
    width: 200,
    color: GlobalStyles.colors.white900,
  },
  logoContainer: {
    width: 100,
    height: 100,
    alignSelf: "center",
    borderRadius: 12,
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
});
