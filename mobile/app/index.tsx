import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost/api';

export default function HomeScreen() {
  const [appName, setAppName] = useState<string | null>(null);

  useEffect(() => {
    const fetchAppName = async () => {
      const response = await fetch(`${API_URL}/home/app-name`);
      const data = await response.json();
      setAppName(data.name);
    };
    fetchAppName();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{appName ?? 'Loading...'}</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
  },
});
