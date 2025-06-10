import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../screens/LoginScreen';
import Register from '../screens/RegisterScreen';
import Dashboard from '../screens/DashboardScreen';
import { useAuth } from '../auth/AuthProvider';
import BackgroundWrapper from '../utils/BackgroundWrapper';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <NavigationContainer>
      <BackgroundWrapper>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <>
            <Stack.Screen name="Dashboard" component={Dashboard} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        )}
      </Stack.Navigator>
      </BackgroundWrapper>
    </NavigationContainer>
  );
}
