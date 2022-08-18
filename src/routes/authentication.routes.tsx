import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SignIn } from '../screens/SignIn';
import { CreateAccount } from '../screens/CreateAccount';

const { Navigator, Screen } = createNativeStackNavigator();

export function AuthenticationRoutes() {
    return (
        <Navigator
            screenOptions={{ headerShown: false }}
        >
            <Screen name="signin" component={SignIn} />
            <Screen name="create" component={CreateAccount} />
        </Navigator>
    );
}