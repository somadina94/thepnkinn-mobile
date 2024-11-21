import React, { useState, useEffect } from "react";
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
  } = useInput((value) => value.trim() !== "" && +value !== 0 && +value < 4);

  const {
    value: numKidsInput,
    enteredValueIsValid: numKidsInputIsValid,
    hasError: numKidsInputIsInvalid,
    valueInputChangedHandler: numKidsInputChangedHandler,
    valueInputBlurHandler: numKidsInputBlurHandler,
  } = useInput((value) => value.trim() !== "" && +value < 4);

  let formIsValid = numAdultsInputIsValid && startDate && endDate;

  const handleDateSelect = (day) => {
    if (!startDate) {
      setStartDate(day.dateString);
      setMarkedDates((prevDates) => ({
        ...prevDates,
        [day.dateString]: { selected: true, color: "blue", textColor: "white" },
      }));
    } else if (!endDate) {
      if (new Date(day.dateString) < new Date(startDate)) {
        Alert.alert(
          "Invalid Selection",
          "End date cannot be before start date."
        );
        return;
      }

      setEndDate(day.dateString);
      const dates = { ...markedDates };

      let current = new Date(startDate);
      const end = new Date(day.dateString);

      while (current <= end) {
        const dateStr = current.toISOString().split("T")[0];
        dates[dateStr] = {
          selected: true,
          color:
            current.getTime() === new Date(startDate).getTime() ||
            current.getTime() === end.getTime()
              ? "blue"
              : "lightblue",
          textColor: "white",
        };
        current.setDate(current.getDate() + 1);
      }

      setMarkedDates(dates);
    } else {
      setStartDate(day.dateString);
      setEndDate(null);
      setMarkedDates((prevDates) => ({
        ...prevDates,
        [day.dateString]: { selected: true, color: "blue", textColor: "white" },
      }));
    }
  };

  const bookAccHandler = async () => {
    setIsLoading(true);

    const data = {
      startDate,
      endDate,
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

  return (
    <ScrollView>
      <KeyboardAvoidingView behavior="padding">
        <Text style={styles.name}>{params.acc.name}</Text>
        <Calendar markedDates={markedDates} onDayPress={handleDateSelect} />
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
            disabled={!formIsValid || !startDate || !endDate}
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
