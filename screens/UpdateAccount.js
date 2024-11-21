import { useState, useEffect } from "react";
import {
  ScrollView,
  KeyboardAvoidingView,
  View,
  StyleSheet,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import useInput from "../hooks/userInput";

import { updateMe } from "../api/http";
import { authActions } from "../store/authSlice";
import Loading from "../components/UI/Loading";
import ModalContainer from "../components/modals/ModalContainer";
import Success from "../components/UI/Success";
import Input from "../components/auth/Input";
import Button from "../components/UI/Button";

function UpdateAccount() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const [successMessage, setSuccessMessage] = useState("");
  const [showModal, setShowModal] = useState(false);
  const {
    value: firstNameInput,
    enteredValueIsValid: firstNameInputIsValid,
    hasError: firstNameInputIsInvalid,
    valueInputChangedHandler: firstNameInputChangedHandler,
    valueInputBlurHandler: firstNameInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: lastNameInput,
    enteredValueIsValid: lastNameInputIsValid,
    hasError: lastNameInputIsInvalid,
    valueInputChangedHandler: lastNameInputChangedHandler,
    valueInputBlurHandler: lastNameInputBlurHandler,
  } = useInput((value) => value.trim() !== "");

  const {
    value: phoneInput,
    enteredValueIsValid: phoneInputIsValid,
    hasError: phoneInputIsInvalid,
    valueInputChangedHandler: phoneInputChangedHandler,
    valueInputBlurHandler: phoneInputBlurHandler,
  } = useInput((value) => value !== "");

  const {
    value: emailInput,
    enteredValueIsValid: emailInputIsValid,
    hasError: emailInputIsInvalid,
    valueInputChangedHandler: emailInputChangedHandler,
    valueInputBlurHandler: emailInputBlurHandler,
  } = useInput((value) => value.trim().includes("@"));

  let formIsValid = false;
  if (
    firstNameInputIsValid &&
    lastNameInputIsValid &&
    emailInputIsValid &&
    phoneInputIsValid
  ) {
    formIsValid = true;
  }

  useEffect(() => {
    firstNameInputChangedHandler(user.name.split(" ")[0]);
    lastNameInputChangedHandler(user.name.split(" ")[1]);
    emailInputChangedHandler(user.email);
    phoneInputChangedHandler(user.phone);
  }, []);

  if (isSubmitting) {
    return <Loading />;
  }

  const submitHandler = async () => {
    setIsSubmitting(true);

    const data = {
      name: `${firstNameInput.trim()} ${lastNameInput.trim()}`,
      email: emailInput,
      phone: phoneInput,
    };

    const res = await updateMe(data, token);
    if (res.status === "success") {
      dispatch(authActions.refresh({ user: res.data.user }));
      setSuccessMessage(res.message);
      setShowModal(true);
      setIsSubmitting(false);
    } else {
      Alert.alert("Update Error", res.message);
      setIsSubmitting(false);
    }
  };
  return (
    <ScrollView style={styles.screen}>
      <KeyboardAvoidingView style={styles.screen}>
        <View style={styles.form}>
          <Input
            label="First name"
            invalid={firstNameInputIsInvalid}
            textInputConfig={{
              onChangeText: firstNameInputChangedHandler,
              onBlur: firstNameInputBlurHandler,
              value: firstNameInput,
            }}
          />
          <Input
            label="Last name"
            invalid={lastNameInputIsInvalid}
            textInputConfig={{
              onChangeText: lastNameInputChangedHandler,
              onBlur: lastNameInputBlurHandler,
              value: lastNameInput,
            }}
          />
          <Input
            label="Phone Number"
            invalid={phoneInputIsInvalid}
            textInputConfig={{
              onChangeText: phoneInputChangedHandler,
              onBlur: phoneInputBlurHandler,
              value: phoneInput,
              keyboardType: "number-pad",
            }}
          />
          <Input
            label="Email"
            invalid={emailInputIsInvalid}
            textInputConfig={{
              onChangeText: emailInputChangedHandler,
              onBlur: emailInputBlurHandler,
              value: emailInput,
            }}
          />
          <Button
            onPress={submitHandler}
            title="Update account"
            disabled={!formIsValid}
          />
        </View>
        <ModalContainer
          isVisible={showModal}
          onDismiss={() => setShowModal(false)}
        >
          <Success
            message={successMessage}
            onPress={() => setShowModal(false)}
          />
        </ModalContainer>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}

export default UpdateAccount;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
  form: {
    margin: 24,
  },
});
