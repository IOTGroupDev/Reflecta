import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ReflectaApp } from './src/app/ReflectaApp';

export default function App() {
  return (
    <SafeAreaProvider>
      <ReflectaApp />
    </SafeAreaProvider>
  );
}
