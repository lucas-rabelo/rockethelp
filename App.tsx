import { NativeBaseProvider, StatusBar } from "native-base";
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';

// screens
import { SignIn } from "./src/screens/SignIn";
import { Home } from "./src/screens/Home";
import { Register } from "./src/screens/Register";

import { Routes } from './src/routes';

// components
import { Loading } from "./src/components/Loading";

// theme
import { THEME } from './src/styles/theme'; 

export default function App() {

    const [fontLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

    return (
        <NativeBaseProvider theme={THEME}>
            <StatusBar 
                barStyle="light-content"
                backgroundColor="transparent"
                translucent
            />

            {fontLoaded ? <Routes /> : <Loading />}
        </NativeBaseProvider>
    );
}
