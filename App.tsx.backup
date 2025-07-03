import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { AuthProvider } from './src/store/auth-context';
import { store } from './src/store/store';
import RootNavigator from './src/navigation/RootNavigator';
import './global.css';

export default function App() {
  return (
    <Provider store={store}>
      <AuthProvider>
        <NavigationContainer>
          <RootNavigator />
        </NavigationContainer>
      </AuthProvider>
    </Provider>
  );
}

