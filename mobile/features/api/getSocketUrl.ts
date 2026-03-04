import Constants from "expo-constants";

export function getSocketUrl(): string {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;

  if (envUrl && !envUrl.includes("localhost")) {
    return envUrl.replace(/\/api\/?$/, "");
  }

  const hostUri = Constants.expoConfig?.hostUri;
  if (hostUri) {
    const host = hostUri.split(":")[0];
    return `http://${host}:8080`;
  }

  return "http://localhost:8080";
}
