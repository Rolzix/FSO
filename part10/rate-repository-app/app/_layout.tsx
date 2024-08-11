import AppBar from "@/components/AppBar";
import Main from "@/components/Main";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    // <Stack>
    //   <Stack.Screen name="index" />
    //   <Stack.Screen name="repository" />
    // </Stack>
    // );
    <>
      <AppBar />
      <Main />
    </>
  );
}
