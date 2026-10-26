/**
 * Application Configuration
 * Centralized reading and normalization of environment variables.
 */

export type DataMode = "mock" | "api";

export interface AppConfig {
  apiUrl: string;
  dataMode: DataMode;
  isMock: boolean;
}

const rawMode = process.env.NEXT_PUBLIC_DATA_MODE?.toLowerCase().trim();
const dataMode: DataMode = rawMode === "api" ? "api" : "mock";

const defaultApiUrl = "http://localhost:4000/api/v1";
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

// Strip any trailing slash for consistent URL construction
const apiUrl = (rawApiUrl && rawApiUrl.length > 0 ? rawApiUrl : defaultApiUrl).replace(
  /\/+$/,
  ""
);

export const appConfig: AppConfig = {
  apiUrl,
  dataMode,
  isMock: dataMode === "mock",
};

export const isMockMode = (): boolean => appConfig.isMock;
export const getApiUrl = (): string => appConfig.apiUrl;
