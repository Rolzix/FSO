import { View, StyleSheet, Pressable, Text } from "react-native";
import Constants from "expo-constants";
import AppBarTab from "./AppBarTab";
import Theme from "../constants/Theme";

const styles = StyleSheet.create({
  container: {
    paddingTop: Constants.statusBarHeight,
    display: "flex",
    flexDirection: "row",
    gap: 10,
    height: 50,
    // justifyContent: "space-evenly",
    alignItems: "center",
    backgroundColor: Theme.colors.background,
  },
});

const AppBar = () => {
  return (
    <Pressable style={styles.container}>
      <AppBarTab label="Repositories" />
      {/* <AppBarTab label="Sign in" /> */}
    </Pressable>
  );
};

export default AppBar;
