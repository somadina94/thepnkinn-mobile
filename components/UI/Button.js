import { Pressable, View, Text, StyleSheet } from "react-native";
import GlobalStyles from "../../util/GlobalStyles";

function Button({ size, title, onPress, disabled, outline, danger }) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        outline && styles.outline,
        !outline && styles.solid,
        disabled && styles.disabled,
        danger && styles.danger,
      ]}
      disabled={disabled}
    >
      <View>
        <Text style={styles.text}>{title}</Text>
      </View>
    </Pressable>
  );
}

export default Button;

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 10,
    ...GlobalStyles.elevated,
    justifyContent: "center",
    minWidth: 140,
    height: 48,
  },
  text: {
    color: GlobalStyles.colors.white900,
    fontSize: 16,
    textAlign: "center",
  },
  pressed: {
    opacity: 0.5,
  },
  disabled: {
    backgroundColor: "#868e96",
    borderColor: GlobalStyles.colors.white900,
  },
  outline: {
    borderWidth: 2,
    borderColor: GlobalStyles.colors.primary800,
    backgroundColor: GlobalStyles.colors.gray200,
  },
  solid: {
    // borderWidth: 2,
    backgroundColor: GlobalStyles.colors.button,
    // borderColor: GlobalStyles.colors.gray800,
  },
  danger: {
    backgroundColor: GlobalStyles.colors.error800,
  },
});
