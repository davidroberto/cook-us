import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost/api';

export default function HomeScreen() {
  const [appName, setAppName] = useState<string | null>(null);
  const router = useRouter();

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

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/cookerBooking/1/booking' as never)}
      >
        <Text style={styles.buttonText}>Test — 1 spécialité (Marie Dupont)</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/cookerBooking/2/booking' as never)}
      >
        <Text style={styles.buttonText}>Test — 2 spécialités (Arjun Sharma)</Text>
      </TouchableOpacity>

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
    gap: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#D7553A',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
  },
});
