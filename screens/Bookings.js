import {
  Alert,
  FlatList,
  StyleSheet,
  View,
  Text,
  ImageBackground,
} from "react-native";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useIsFocused } from "@react-navigation/native";

import { getBookings } from "../api/http";
import Loading from "../components/UI/Loading";
import BookingItem from "../components/accomodation/BookingItem";
import { bookingsAction } from "../store/bookingSlice";

function renderBookings(itemData) {
  return <BookingItem booking={itemData.item} />;
}

function Bookings() {
  const bookings = useSelector((state) => state.bookings.bookings);
  const [isLoading, setIsLoading] = useState(true);
  const token = useSelector((state) => state.auth.token);
  const focused = useIsFocused();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBookings = async () => {
      const res = await getBookings(token);
      if (res.status === "success") {
        setIsLoading(false);
        dispatch(bookingsAction.set({ bookings: res.data.booking }));
      } else {
        Alert.alert("Bookings Error", res.message);
        setIsLoading(false);
      }
    };
    fetchBookings();
  }, [token, focused]);

  if (isLoading) {
    return <Loading />;
  }
  const toBeSortedBookings = [...bookings];
  const sortedBookings = toBeSortedBookings.sort(
    (a, b) => new Date(b.createAt) - new Date(a.createAt)
  );

  if (sortedBookings.length === 0) {
    return (
      <View style={styles.fallback}>
        <Text style={styles.fallbackText}>
          You have no bookings yet. Please go ahead and make a reservation.
        </Text>
      </View>
    );
  }

  return (
    <ImageBackground
      style={styles.screen}
      source={require("../assets/bg1.jpg")}
    >
      <FlatList
        style={styles.screen}
        data={sortedBookings}
        keyExtractor={(item) => item._id}
        renderItem={renderBookings}
      />
    </ImageBackground>
  );
}

export default Bookings;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  fallback: {
    marginVertical: 200,
    marginHorizontal: 20,
  },
  fallbackText: {
    fontSize: 16,
    fontWeight: "400",
    textAlign: "center",
  },
});
