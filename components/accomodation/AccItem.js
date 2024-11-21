import { View, Pressable, Text, StyleSheet, Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

import Icon from "../icon/Icon";
import GlobalStyles from "../../util/GlobalStyles";
import { formatAmount } from "../../util/helpers";

function AccItem({ acc }) {
  const navigation = useNavigation();

  return (
    <Pressable
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      onPress={() => navigation.navigate("Detail", { acc })}
    >
      <View style={styles.priceContainer}>
        <Text style={styles.price}>N{formatAmount(acc.pricePerNight)}</Text>
      </View>
      <Image style={styles.image} source={{ uri: acc.mainPhoto }} />
      <View style={styles.actions}>
        <Text style={styles.name}>{acc.name}</Text>
        <Icon size={24} name="arrow-forward-circle-outline" />
      </View>
    </Pressable>
  );
}

export default AccItem;

const styles = StyleSheet.create({
  container: {
    position: "relative",
    margin: 12,
    ...GlobalStyles.elevated,
    backgroundColor: GlobalStyles.colors.white900,
    borderRadius: 12,
    flex: 1,
  },
  pressed: {
    opacity: 0.3,
  },
  image: {
    flex: 1,
    width: "100%",
    height: 200,
  },
  priceContainer: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 1,
  },
  price: {
    color: GlobalStyles.colors.white900,
    padding: 8,
    minWidth: 200,
    backgroundColor: GlobalStyles.colors.primary800,
    textAlign: "center",
    fontSize: 18,
    borderBottomLeftRadius: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 6,
  },
});
