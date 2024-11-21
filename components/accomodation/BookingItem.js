import { View, Text, StyleSheet, Alert } from "react-native";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";

import { formatDate, formatAmount } from "../../util/helpers";
import GlobalStyles from "../../util/GlobalStyles";
import Icon from "../icon/Icon";
import { deleteBooking } from "../../api/http";
import { bookingsAction } from "../../store/bookingSlice";

function BookingItem({ booking }) {
  const [showModal, setShowModal] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const dispatch = useDispatch();

  const cancelHandler = async () => {
    const res = await deleteBooking(booking._id, token);
    if (!res.status) {
      setShowModal(false);
      dispatch(bookingsAction.delete({ id: booking._id }));
    } else {
      Alert.alert("Error", res.message);
      setShowModal(false);
    }
  };

  return (
    <View style={styles.screen}>
      <View style={styles.content}>
        <Text>Name</Text>
        <Text>{booking.accomodation.name}</Text>
      </View>
      <View style={styles.content}>
        <Text>Check-In</Text>
        <Text>{formatDate(booking.startDate)}</Text>
      </View>
      <View style={styles.content}>
        <Text>Check-Out</Text>
        <Text>{formatDate(booking.endDate)}</Text>
      </View>
      <View style={styles.content}>
        <Text>Category</Text>
        <Text>{booking.accomodation.category}</Text>
      </View>
      <View style={styles.content}>
        <Text>Price Per Night</Text>
        <Text>N{formatAmount(booking.accomodation.pricePerNight)}</Text>
      </View>
      <View style={styles.content}>
        <Text>Caution Fee(To be refunded)</Text>
        <Text>N{formatAmount(booking.cautionFee)}</Text>
      </View>
      <View style={styles.content}>
        <Text>Total Price</Text>
        <Text>N{formatAmount(booking.amount)}</Text>
      </View>
      <View style={styles.content}>
        <Text>id</Text>
        <Text>{booking._id}</Text>
      </View>
      <View style={styles.content}>
        <Text>Date booked</Text>
        <Text>{formatDate(booking.createAt)}</Text>
      </View>
      <View style={styles.cancel}>
        <Icon
          name="trash-outline"
          title="Cancel"
          displayTitle={true}
          size={24}
          color={GlobalStyles.colors.secondry800}
          onPress={() => setShowModal(true)}
        />
      </View>
      {showModal && (
        <View style={styles.action}>
          <Text style={styles.text}>Are you sure you want to cancel?</Text>
          <View style={styles.popup}>
            <Icon
              title="Go back"
              name="arrow-back-circle-outline"
              displayTitle={true}
              size={24}
              color={GlobalStyles.colors.white900}
              onPress={() => setShowModal(false)}
            />
            <Icon
              name="trash-outline"
              title="Cancel"
              displayTitle={true}
              size={24}
              color={GlobalStyles.colors.secondry800}
              onPress={cancelHandler}
            />
          </View>
        </View>
      )}
    </View>
  );
}

export default BookingItem;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: GlobalStyles.colors.transparentWhite,
    padding: 12,
    margin: 12,
    gap: 4,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: GlobalStyles.colors.primary800,
    position: "relative",
  },
  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  action: {
    backgroundColor: GlobalStyles.colors.transparentBlack,
    padding: 12,
    borderRadius: 12,
    position: "absolute",
    bottom: 0,
    right: 0,
    left: 0,
  },
  popup: {
    flexDirection: "row",
    justifyContent: "space-around",
    padding: 12,
  },
  text: {
    color: GlobalStyles.colors.white900,
    textAlign: "center",
    fontSize: 24,
  },
  cancel: {
    backgroundColor: GlobalStyles.colors.transparentBlack,
    width: 80,
    alignSelf: "center",
    padding: 12,
    borderRadius: 12,
  },
});
