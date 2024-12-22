import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  KeyboardAvoidingView,
  StyleSheet,
  Alert,
} from "react-native";
import { useSelector } from "react-redux";
import { Calendar } from "react-native-calendars";

import useInput from "../hooks/userInput";
import Input from "../components/auth/Input";
import GlobalStyles from "../util/GlobalStyles";
import Button from "../components/UI/Button";
import Loading from "../components/UI/Loading";
import { bookAccomodation } from "../api/http";
import ModalContainer from "../components/modals/ModalContainer";
import Success from "../components/UI/Success";

function Book({ route, navigation }) {
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [markedDates, setMarkedDates] = useState({});
  const token = useSelector((state) => state.auth.token);
  const { params } = route;
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);

  const {
    value: numAdultsInput,
    enteredValueIsValid: numAdultsInputIsValid,
    hasError: numAdultsInputIsInvalid,
    valueInputChangedHandler: numAdultsInputChangedHandler,
    valueInputBlurHandler: numAdultsInputBlurHandler,
  } = useInput((value) => value.trim() !== "" && +value !== 0 && +value <= 25);

  const {
    value: numKidsInput,
    enteredValueIsValid: numKidsInputIsValid,
    hasError: numKidsInputIsInvalid,
    valueInputChangedHandler: numKidsInputChangedHandler,
    valueInputBlurHandler: numKidsInputBlurHandler,
  } = useInput((value) => value.trim() !== "" && +value <= 25);

  let formIsValid = numAdultsInputIsValid && startDate && endDate;

  const handleDateSelect = (day) => {
    const selectedDate = day.dateString;

    // If the clicked date matches the current startDate, clear all selections
    if (selectedDate === startDate) {
      setStartDate(null);
      setEndDate(null);
      setMarkedDates({});
      return;
    }

    // If startDate is selected and endDate is already set, update endDate to the new selected date
    if (startDate && endDate) {
      if (new Date(selectedDate) > new Date(startDate)) {
        const newMarkedDates = {
          [startDate]: { selected: true, color: "blue", textColor: "white" },
        };
        const start = new Date(startDate);
        const end = new Date(selectedDate);
        let current = start;

        while (current <= end) {
          const dateStr = current.toISOString().split("T")[0];
          newMarkedDates[dateStr] = {
            selected: true,
            color:
              current.getTime() === start.getTime() ||
              current.getTime() === end.getTime()
                ? "blue"
                : "lightblue",
            textColor: "white",
          };
          current.setDate(current.getDate() + 1);
        }

        setEndDate(selectedDate);
        setMarkedDates(newMarkedDates);
      }
      return;
    }

    // If no startDate is selected, set the startDate
    if (!startDate) {
      setStartDate(selectedDate);
      setMarkedDates({
        [selectedDate]: { selected: true, color: "blue", textColor: "white" },
      });
      return;
    }

    // If startDate is selected but no endDate, set the new endDate and mark the range
    if (!endDate) {
      if (new Date(selectedDate) > new Date(startDate)) {
        const newMarkedDates = {
          [startDate]: { selected: true, color: "blue", textColor: "white" },
        };
        const start = new Date(startDate);
        const end = new Date(selectedDate);
        let current = start;

        while (current <= end) {
          const dateStr = current.toISOString().split("T")[0];
          newMarkedDates[dateStr] = {
            selected: true,
            color:
              current.getTime() === start.getTime() ||
              current.getTime() === end.getTime()
                ? "blue"
                : "lightblue",
            textColor: "white",
          };
          current.setDate(current.getDate() + 1);
        }

        setEndDate(selectedDate);
        setMarkedDates(newMarkedDates);
      }
      return;
    }
  };

  const bookAccHandler = async () => {
    setIsLoading(true);

    let calculatedEndDate = endDate;

    // If no end date is selected, add one more day
    if (!endDate && startDate) {
      const startDateObj = new Date(startDate);
      const nextDay = new Date(startDateObj);
      nextDay.setDate(startDateObj.getDate() + 1);
      calculatedEndDate = nextDay.toISOString().split("T")[0];
    }

    const data = {
      startDate,
      endDate: calculatedEndDate,
      numAdults: numAdultsInput.trim(),
      numKids: numKidsInput || 0,
      accomodation: params.acc._id,
    };

    const res = await bookAccomodation(data, token);

    if (res.status === "success") {
      setSuccessMessage(res.message);
      setShowModal(true);
      setIsLoading(false);
    } else {
      Alert.alert("Error", res.message);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  const bookingSuccess = () => {
    setShowModal(false);
    navigation.navigate("Bookings");
  };

  const totalAmountOnDatesSelected =
    (Object.keys(markedDates).length - 1) * params.acc.pricePerNight;

  return (
    <ScrollView>
      <KeyboardAvoidingView behavior="padding">
        <Text style={styles.name}>{params.acc.name}</Text>
        <Text style={styles.name}>
          Total:{" "}
          {Object.keys(markedDates).length > 0 ? totalAmountOnDatesSelected : 0}
        </Text>
        <Calendar
          markedDates={markedDates}
          onDayPress={handleDateSelect}
          minDate={new Date().toISOString().split("T")[0]}
        />
        <View style={styles.inputContainer}>
          <Input
            label="No. of Adults"
            invalid={numAdultsInputIsInvalid}
            textInputConfig={{
              onChangeText: numAdultsInputChangedHandler,
              onBlur: numAdultsInputBlurHandler,
              value: numAdultsInput,
              placeholder: "0",
              keyboardType: "number-pad",
            }}
          />
          <Input
            label="No. of Kids"
            invalid={numKidsInputIsInvalid}
            textInputConfig={{
              onChangeText: numKidsInputChangedHandler,
              onBlur: numKidsInputBlurHandler,
              value: numKidsInput,
              placeholder: "0",
              keyboardType: "number-pad",
            }}
          />
        </View>
        <View style={styles.action}>
          <Button
            title="Book Accommodation"
            disabled={!formIsValid}
            onPress={bookAccHandler}
          />
        </View>
        <ModalContainer
          isVisible={showModal}
          onDismiss={() => bookingSuccess()}
        >
          <Success message={successMessage} onPress={() => bookingSuccess()} />
        </ModalContainer>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

export default Book;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    margin: 12,
    backgroundColor: GlobalStyles.colors.primary800,
    alignItems: "center",
    borderRadius: 12,
    padding: 12,
  },
  date: {
    fontSize: 16,
    fontWeight: "800",
    color: GlobalStyles.colors.gray800,
  },
  name: {
    fontSize: 24,
    fontWeight: "600",
    textAlign: "center",
    backgroundColor: GlobalStyles.colors.white900,
    margin: 12,
    padding: 12,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    margin: 12,
  },
  action: {
    margin: 12,
  },
});
