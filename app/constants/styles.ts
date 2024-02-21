import Colors from "./Colors";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: Colors.black,
    gap: 20,
  },
  container: {
    flex: 1,
    paddingTop: 80,
    backgroundColor: Colors.black,
    gap: 20,
    padding: 20,
  },
  image: {
    resizeMode: "cover",
    backgroundColor: Colors.blue,
    height: 260,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 14,
    color: Colors.white,
  },
  textInput: {
    width: "100%",
    color: Colors.white,
  },
  innerInputContainer: {
    position: "relative",
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderColor: Colors.white,
    paddingVertical: 8,
    width: "80%",
  },
  inputContainer: {
    flexDirection: "row",
    gap: 14,
    alignItems: "center",
    paddingHorizontal: 20,
  },
  buttonColumnContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    gap: 16,
    marginVertical: 32,
  },
  authButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    position: "relative",
    backgroundColor: Colors.white,
    padding: 14,
    borderRadius: 20,
    width: "100%",
  },
});
