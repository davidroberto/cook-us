import Constants from "expo-constants";

/**
 * En développement (Expo Go via QR code), l'IP de la machine est détectée
 * automatiquement depuis le serveur Expo — aucune config manuelle nécessaire.
 *
 * En production, utiliser la variable d'environnement EXPO_PUBLIC_API_URL.
 */
export function getApiUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;

  if (envUrl && !envUrl.includes("localhost")) {
    return envUrl;
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(":")[0];
    return `http://${host}:8080/api`;
  }

  return envUrl ?? "http://localhost:8080/api";
}
