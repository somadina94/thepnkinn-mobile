import { StyleSheet, View, Modal } from "react-native";
import LinkButton from "../UI/LinkButton";
import GlobalStyles from "../../util/GlobalStyles";

function ModalContainer({ isVisible, onDismiss, children }) {
  return (
    <Modal
      style={styles.screen}
      visible={isVisible}
      animationType="slide"
      presentationStyle="formSheet"
    >
      <View>
        <LinkButton onPress={onDismiss}>Dismiss</LinkButton>
      </View>
      {children}
    </Modal>
  );
}

export default ModalContainer;

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
