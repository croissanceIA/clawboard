export interface ConfigEntry {
  key: string;
  label: string;
  value: string;
  description: string;
  masked?: boolean;
}

export interface ConfigSection {
  id: string;
  title: string;
  entries: ConfigEntry[];
}

export type ConnectionStatusValue = "connected" | "error" | "unchecked";

export interface ConnectionStatus {
  id: string;
  name: string;
  status: ConnectionStatusValue;
  detail: string;
  checkedAt: string;
}

export interface SettingsProps {
  configSections: ConfigSection[];
  connectionStatuses: ConnectionStatus[];
  envFilePath: string;
  onTestOpenRouterConnection?: () => void;
  onCopyValue?: (key: string, value: string) => void;
  onRecheckStatuses?: () => void;
}
