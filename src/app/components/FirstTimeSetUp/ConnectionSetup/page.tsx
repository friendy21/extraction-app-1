"use client";

import React, { useState, useEffect } from "react";
import { Button } from "../../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import { Badge } from "../../ui/badge";
import ConnectionRequiredTooltip from "./ConnectionRequiredTooltip";
import {
  CheckCircle2,
  Cog,
  Plus,
  RefreshCw,
  X,
  Eye,
  EyeOff,
  Info,
  AlertTriangle,
  Loader2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useStep } from "../StepContext";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "../../ui/tooltip";
import { toast } from "sonner";

// Define types
type ConnectionStatus = {
  microsoft365: boolean;
  googleWorkspace: boolean;
  dropbox: boolean;
  slack: boolean;
  zoom: boolean;
  jira: boolean;
};

type ConnectionStats = {
  connection_id: string;
  status: string;
  last_connected_at: string;
  created_at: string;
  error?: string;
};

type CustomAPI = {
  id: string;
  name: string;
  isConnected: boolean;
  apiUrl: string;
  apiKey: string;
  headers: string;
  authType: string;
  connectionId?: string;
  stats?: ConnectionStats;
};

type Microsoft365Config = { clientId: string; clientSecret: string; tenantId: string; redirectUri: string };
type GoogleWorkspaceConfig = { clientId: string; clientSecret: string; redirectUri: string; scope: string; accountId: string };
type DropboxConfig = { appKey: string; appSecret: string; redirectUri: string };
type SlackConfig = { clientId: string; clientSecret: string; redirectUri: string; scopes: string; workspaceId: string };
type ZoomConfig = { clientId: string; clientSecret: string; redirectUri: string; accountId: string };
type JiraConfig = { clientId: string; clientSecret: string; redirectUri: string; instanceUrl: string };

type TestingStage = "initializing" | "validating" | "connecting" | "completed" | "error" | null;
type TestStatus = { status: "success" | "error" | null; message: string; details: string; timestamp: string } | null;

// Mock Connection Stats
const MOCK_STATS: Record<string, ConnectionStats> = {
  microsoft365: { connection_id: "ms-conn-12345", status: "connected", last_connected_at: new Date().toISOString(), created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() },
  googleWorkspace: { connection_id: "google-conn-67890", status: "connected", last_connected_at: new Date().toISOString(), created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() },
  dropbox: { connection_id: "dropbox-conn-abcde", status: "connected", last_connected_at: new Date().toISOString(), created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() },
  slack: { connection_id: "slack-conn-fghij", status: "connected", last_connected_at: new Date().toISOString(), created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() },
  zoom: { connection_id: "zoom-conn-klmno", status: "connected", last_connected_at: new Date().toISOString(), created_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() },
  jira: { connection_id: "jira-conn-pqrst", status: "connected", last_connected_at: new Date().toISOString(), created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString() },
  customAPI1: { connection_id: "custom-conn-12345", status: "connected", last_connected_at: new Date().toISOString(), created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() },
  customAPI2: { connection_id: "custom-conn-67890", status: "connected", last_connected_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), created_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString() },
  customAPI3: { connection_id: "custom-conn-abcde", status: "connected", last_connected_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(), created_at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString() },
};

// API client for connection endpoints
const ConnectionAPI = {
  createConnection: async (service: string, config: any): Promise<{ connection_id: string; status: string }> => {
    console.log(`Creating ${service} connection with config:`, config);
    return { connection_id: `${service}-conn-${Math.random().toString(36).substring(2, 7)}`, status: "configured" };
  },
  getConnectionStats: async (connectionId: string): Promise<ConnectionStats> => {
    console.log(`Getting stats for connection: ${connectionId}`);
    const serviceKey = Object.keys(MOCK_STATS).find((key) => MOCK_STATS[key].connection_id === connectionId);
    return serviceKey ? MOCK_STATS[serviceKey] : { connection_id: connectionId, status: "connected", last_connected_at: new Date().toISOString(), created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() };
  },
  connect: async (connectionId: string): Promise<{ connection_id: string; status: string; error?: string }> => {
    console.log(`Connecting with ID: ${connectionId}`);
    await new Promise((resolve) => setTimeout(resolve, 500));
    return { connection_id: connectionId, status: "connected" };
  },
  testConnection: async (service: string, config: any): Promise<{ success: boolean; message: string }> => {
    console.log(`Testing connection for ${service} with config:`, config);
    const simulateNetworkDelay = async () => await new Promise((resolve) => setTimeout(resolve, Math.floor(Math.random() * 1000) + 1500));
    await simulateNetworkDelay();
    if (Math.random() < 0.1) return { success: false, message: "Configuration validation failed. Please check your credentials." };
    await simulateNetworkDelay();
    if (Math.random() < 0.1) return { success: false, message: "Network error. Could not reach the service." };
    await simulateNetworkDelay();
    let isValid = false, message = "Invalid credentials";
    if (service === "customapi") {
      isValid = !!(config.api_url && config.api_key && config.auth_type);
      message = isValid ? "Connection successful! API endpoint is accessible." : "Missing required fields.";
    } else {
      switch (service) {
        case "microsoft365": isValid = config.client_id?.startsWith("ms-client-") && config.client_secret?.startsWith("ms-secret-") && config.tenant_id?.startsWith("tenant-"); message = isValid ? "Microsoft 365 connection successful!" : "Invalid Microsoft 365 credentials."; break;
        case "googleWorkspace": isValid = config.client_id?.startsWith("google-client-") && config.client_secret?.startsWith("google-secret-") && config.account_id?.endsWith(".com"); message = isValid ? "Google Workspace connection successful!" : "Invalid Google Workspace credentials."; break;
        case "dropbox": isValid = config.app_key?.startsWith("dropbox-app-") && config.client_secret?.startsWith("dropbox-secret-"); message = isValid ? "Dropbox connection successful!" : "Invalid Dropbox credentials."; break;
        case "slack": isValid = config.client_id?.startsWith("slack-client-") && config.client_secret?.startsWith("slack-secret-") && config.workspace_id?.startsWith("T"); message = isValid ? "Slack connection successful!" : "Invalid Slack credentials."; break;
        case "zoom": isValid = config.client_id?.startsWith("zoom-client-") && config.client_secret?.startsWith("zoom-secret-") && config.account_id?.startsWith("zoom-account-"); message = isValid ? "Zoom connection successful!" : "Invalid Zoom credentials."; break;
        case "jira": isValid = config.client_id?.startsWith("jira-client-") && config.client_secret?.startsWith("jira-secret-") && config.instance_url?.startsWith("https://"); message = isValid ? "Jira connection successful!" : "Invalid Jira credentials."; break;
        default: message = "Service not supported"; break;
      }
    }
    return { success: isValid, message };
  },
};

// Connection Test Results Component
const ConnectionTestResults: React.FC<{ status: "success" | "error" | null; message: string; details: string; timestamp: string }> = ({ status, message, details, timestamp }) => (
  <div className={`mt-4 p-4 rounded-md ${status === "success" ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"} border`}>
    <div className="flex items-start">
      {status === "success" ? <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5 mr-2" /> : <AlertTriangle className="h-5 w-5 text-red-500 mt-0.5 mr-2" />}
      <div>
        <h4 className={`font-medium ${status === "success" ? "text-green-800" : "text-red-800"}`}>{message}</h4>
        <p className={`text-sm ${status === "success" ? "text-green-700" : "text-red-700"}`}>{details}</p>
        <p className="text-xs text-gray-500 mt-1">{new Date(timestamp).toLocaleString()}</p>
      </div>
    </div>
  </div>
);

// Modal Component
const ConfigModal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-lg">{title}</h3>
          <Button variant="ghost" size="sm" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <div className="p-4">{children}</div>
      </div>
    </div>
  );
};

// Stats Modal Component
const StatsModal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; stats: ConnectionStats | null; isLoading: boolean }> = ({ isOpen, onClose, title, stats, isLoading }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h3 className="font-semibold text-lg">{title} Statistics</h3>
          <Button variant="ghost" size="sm" onClick={onClose}><X className="h-4 w-4" /></Button>
        </div>
        <div className="p-4">
          {isLoading ? (
            <div className="flex justify-center py-8"><RefreshCw className="h-8 w-8 animate-spin text-gray-400" /></div>
          ) : stats ? (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="text-sm font-medium text-gray-500">Connection ID:</div><div className="text-sm">{stats.connection_id}</div>
                <div className="text-sm font-medium text-gray-500">Status:</div><div className="text-sm"><Badge variant={stats.status === "connected" ? "green" : "red"}>{stats.status}</Badge></div>
                <div className="text-sm font-medium text-gray-500">Last Connected:</div><div className="text-sm">{new Date(stats.last_connected_at).toLocaleString()}</div>
                <div className="text-sm font-medium text-gray-500">Created:</div><div className="text-sm">{new Date(stats.created_at).toLocaleString()}</div>
                {stats.error && (<><div className="text-sm font-medium text-gray-500">Error:</div><div className="text-sm text-red-500">{stats.error}</div></>)}
              </div>
            </div>
          ) : (
            <div className="py-4 text-center text-gray-500">No statistics available.</div>
          )}
        </div>
        <div className="p-4 border-t border-gray-200 flex justify-end"><Button variant="outline" size="sm" onClick={onClose}>Close</Button></div>
      </div>
    </div>
  );
};

// Password Input Component
const PasswordInput: React.FC<{ id: string; value: string; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; required?: boolean; placeholder?: string }> = ({ id, value, onChange, required = false, placeholder = "" }) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="relative">
      <Input id={id} type={showPassword ? "text" : "password"} value={value} onChange={onChange} required={required} placeholder={placeholder} className="pr-10" />
      <Button type="button" variant="ghost" size="sm" className="absolute right-0 top-0 h-full px-3" onClick={() => setShowPassword(!showPassword)}>
        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
};

// Custom API Card Component
const CustomAPICard: React.FC<{ api: CustomAPI; onConnect: () => void; onDisconnect: () => void; onSettings: () => void; onStats: () => void; onRename: (newName: string) => void; onDelete: () => void }> = ({ api, onConnect, onDisconnect, onSettings, onStats, onRename, onDelete }) => {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(api.name);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleRename = () => { onRename(newName); setIsRenaming(false); };
  const handleDelete = () => { if (showDeleteConfirm) { onDelete(); setShowDeleteConfirm(false); } else setShowDeleteConfirm(true); };

  return (
    <Card className="bg-white border border-gray-200 shadow-md hover:shadow-xl rounded-lg transition-all duration-300">
      <CardHeader className="flex flex-row items-center gap-4">
        <div className="w-12 h-12 flex items-center justify-center rounded-md bg-[#0061D5]">
          <svg width="24" height="24" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <rect width="100" height="100" fill="white" />
            <circle cx="50" cy="50" r="40" fill="#ede9fe" />
            <polyline points="40,40 30,50 40,60" stroke="#7c3aed" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <polyline points="60,40 70,50 60,60" stroke="#7c3aed" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="45" y1="65" x2="55" y2="35" stroke="#7c3aed" strokeWidth="4" strokeLinecap="round" />
          </svg>
        </div>
        <div className="flex-1">
          {isRenaming ? (
            <div className="flex items-center gap-2">
              <Input value={newName} onChange={(e) => setNewName(e.target.value)} className="py-1 text-sm" autoFocus />
              <Button size="sm" variant="ghost" onClick={handleRename}><CheckCircle2 className="h-4 w-4 text-green-500" /></Button>
              <Button size="sm" variant="ghost" onClick={() => setIsRenaming(false)}><X className="h-4 w-4 text-red-500" /></Button>
            </div>
          ) : (
            <CardTitle className="cursor-pointer flex items-center" onClick={() => setIsRenaming(true)}>
              {api.name}
              <Button variant="ghost" size="sm" className="ml-2 p-0 h-auto">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </Button>
            </CardTitle>
          )}
        </div>
        <Badge variant={api.isConnected ? "green" : "customGray"} className="ml-auto w-28 text-center">{api.isConnected ? "Connected" : "Not Connected"}</Badge>
      </CardHeader>
      <CardContent>
        <div className="text-sm text-muted-foreground">
          <p>Custom API endpoint for {api.name}</p>
          {api.connectionId && <p className="mt-1 text-xs">Connection ID: {api.connectionId}</p>}
        </div>
      </CardContent>
      <div className="flex justify-between p-4">
        {api.isConnected ? (
          <>
            <Button variant="outline" size="sm" className="flex-1 bg-red-500 hover:bg-red-600 text-white" onClick={onDisconnect}>Disconnect</Button>
            <Button variant="outline" size="sm" className="ml-2" onClick={onSettings}><Cog className="h-4 w-4" /></Button>
            <Button variant="outline" size="sm" className="ml-2" onClick={onStats}><Info className="h-4 w-4" /></Button>
          </>
        ) : (
          <>
            <Button variant="outline" size="sm" className="flex-1 bg-blue-500 hover:bg-blue-600 text-white" onClick={onConnect}>Connect</Button>
            <Button variant="outline" size="sm" className="ml-2 bg-red-500 hover:bg-red-600 text-white" onClick={handleDelete}>{showDeleteConfirm ? "Confirm" : "Delete"}</Button>
          </>
        )}
      </div>
      {showDeleteConfirm && (
        <div className="px-6 pb-4 text-center">
          <p className="text-sm text-red-600 mb-2">Are you sure you want to delete this API?</p>
          <div className="flex justify-center space-x-2">
            <Button size="sm" variant="outline" onClick={() => setShowDeleteConfirm(false)}>Cancel</Button>
            <Button size="sm" variant="destructive" onClick={onDelete}>Delete</Button>
          </div>
        </div>
      )}
    </Card>
  );
};

// Main ConnectionPage Component
const ConnectionPage: React.FC = () => {
  const [connections, setConnections] = useState<ConnectionStatus>({ microsoft365: false, googleWorkspace: false, dropbox: false, slack: false, zoom: false, jira: false });
  const [connectionIds, setConnectionIds] = useState<Record<string, string>>({ microsoft365: "", googleWorkspace: MOCK_STATS.googleWorkspace.connection_id, dropbox: MOCK_STATS.dropbox.connection_id, slack: MOCK_STATS.slack.connection_id, zoom: MOCK_STATS.zoom.connection_id, jira: MOCK_STATS.jira.connection_id });
  const [activeStats, setActiveStats] = useState<ConnectionStats | null>(null);
  const [isLoadingStats, setIsLoadingStats] = useState(false);
  const [isTestingConnection, setIsTestingConnection] = useState(false);
  const [testingStage, setTestingStage] = useState<TestingStage>(null);
  const [testStatus, setTestStatus] = useState<TestStatus>(null);
  const [customAPIs, setCustomAPIs] = useState<CustomAPI[]>([{ id: "api1", name: "Analytics Service", isConnected: false, apiUrl: "https://analytics.example.io/collect", apiKey: "analytics-key-f45de78ab", headers: '{"Content-Type": "application/json", "User-Agent": "ConnectorApp/1.0"}', authType: "ApiKey", connectionId: MOCK_STATS.customAPI3.connection_id }]);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [editingApiId, setEditingApiId] = useState<string | null>(null);
  const [microsoft365Form, setMicrosoft365Form] = useState<Microsoft365Config>({ clientId: "ms-client-12345", clientSecret: "ms-secret-67890", tenantId: "tenant-abcde", redirectUri: typeof window !== "undefined" ? window.location.origin + "/auth/microsoft/callback" : "" });
  const [googleWorkspaceForm, setGoogleWorkspaceForm] = useState<GoogleWorkspaceConfig>({ clientId: "google-client-12345", clientSecret: "google-secret-67890", redirectUri: typeof window !== "undefined" ? window.location.origin + "/auth/google/callback" : "", scope: "https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/calendar.readonly https://www.googleapis.com/auth/drive.readonly", accountId: "example.com" });
  const [dropboxForm, setDropboxForm] = useState<DropboxConfig>({ appKey: "dropbox-app-12345", appSecret: "dropbox-secret-67890", redirectUri: typeof window !== "undefined" ? window.location.origin + "/auth/dropbox/callback" : "" });
  const [slackForm, setSlackForm] = useState<SlackConfig>({ clientId: "slack-client-12345", clientSecret: "slack-secret-67890", redirectUri: typeof window !== "undefined" ? window.location.origin + "/auth/slack/callback" : "", scopes: "channels:read channels:history users:read", workspaceId: "T01ABC123DE" });
  const [zoomForm, setZoomForm] = useState<ZoomConfig>({ clientId: "zoom-client-12345", clientSecret: "zoom-secret-67890", redirectUri: typeof window !== "undefined" ? window.location.origin + "/auth/zoom/callback" : "", accountId: "zoom-account-12345" });
  const [jiraForm, setJiraForm] = useState<JiraConfig>({ clientId: "jira-client-12345", clientSecret: "jira-secret-67890", redirectUri: typeof window !== "undefined" ? window.location.origin + "/auth/jira/callback" : "", instanceUrl: "https://example.atlassian.net" });
  const [customAPIForm, setCustomAPIForm] = useState<Omit<CustomAPI, "id" | "name" | "isConnected">>({ apiUrl: "", apiKey: "", headers: '{"Content-Type": "application/json"}', authType: "Bearer" });
  const [showConnectionRequiredTooltip, setShowConnectionRequiredTooltip] = useState(false);

  const isAnyConnected = React.useMemo(() => Object.values(connections).some(Boolean) || customAPIs.some((api) => api.isConnected), [connections, customAPIs]);
  const router = useRouter();
  const { setCurrentStep } = useStep();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setMicrosoft365Form((prev) => ({ ...prev, redirectUri: window.location.origin + "/auth/microsoft/callback" }));
      setGoogleWorkspaceForm((prev) => ({ ...prev, redirectUri: window.location.origin + "/auth/google/callback" }));
      setDropboxForm((prev) => ({ ...prev, redirectUri: window.location.origin + "/auth/dropbox/callback" }));
      setSlackForm((prev) => ({ ...prev, redirectUri: window.location.origin + "/auth/slack/callback" }));
      setZoomForm((prev) => ({ ...prev, redirectUri: window.location.origin + "/auth/zoom/callback" }));
      setJiraForm((prev) => ({ ...prev, redirectUri: window.location.origin + "/auth/jira/callback" }));
    }
  }, []);

  useEffect(() => {
    const hasVisitedBefore = sessionStorage.getItem("hasVisitedConnectionPage");
    if (!isAnyConnected && !hasVisitedBefore) {
      setShowConnectionRequiredTooltip(true);
      sessionStorage.setItem("hasVisitedConnectionPage", "true");
    }
  }, [isAnyConnected]);

  const testConnection = async (service: string, config: any) => {
    try {
      setIsTestingConnection(true);
      setTestingStage("initializing");
      setTestStatus(null);
      toast({ title: "Testing Connection", description: "Validating configuration..." });
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setTestingStage("validating");
      toast({ title: "Testing Connection", description: "Attempting to connect..." });
      setTestingStage("connecting");
      const result = await ConnectionAPI.testConnection(service, config);
      setTestingStage("completed");
      if (result.success) {
        setTestStatus({ status: "success", message: result.message, details: `Successfully connected to ${service}!`, timestamp: new Date().toISOString() });
        toast({ title: "Connection Successful", description: "Test connection completed successfully." });
      } else {
        setTestStatus({ status: "error", message: result.message, details: `Failed to connect to ${service}.`, timestamp: new Date().toISOString() });
        toast({ title: "Connection Failed", description: result.message, variant: "destructive" });
      }
    } catch (error) {
      setTestingStage("error");
      setTestStatus({ status: "error", message: "An unexpected error occurred", details: error instanceof Error ? error.message : "Unknown error", timestamp: new Date().toISOString() });
      toast({ title: "Error", description: "An error occurred while testing the connection.", variant: "destructive" });
    } finally {
      setIsTestingConnection(false);
    }
  };

  const showConfigModal = (service: string) => { setActiveModal(service); setTestStatus(null); setTestingStage(null); };
  const showSettingsModal = (service: string) => { setActiveModal(`${service}_settings`); setTestStatus(null); setTestingStage(null); };
  const showStatsModal = async (service: string) => { setIsLoadingStats(true); setActiveModal(`${service}_stats`); setTimeout(() => { setActiveStats(MOCK_STATS[service]); setIsLoadingStats(false); }, 500); };
  const showCustomAPISettingsModal = (apiId: string) => {
    setEditingApiId(apiId); setActiveModal("customAPI_settings"); setTestStatus(null); setTestingStage(null);
    const api = customAPIs.find((api) => api.id === apiId);
    if (api) setCustomAPIForm({ apiUrl: api.apiUrl, apiKey: api.apiKey, headers: api.headers, authType: api.authType });
  };
  const showCustomAPIStatsModal = async (apiId: string) => {
    setIsLoadingStats(true); setActiveModal("customAPI_stats");
    const api = customAPIs.find((api) => api.id === apiId);
    if (api) {
      const mockKey = `customAPI${apiId.replace("api", "")}`;
      setTimeout(() => { setActiveStats(MOCK_STATS[mockKey] || { connection_id: api.connectionId || `custom-${apiId}-${Date.now()}`, status: "connected", last_connected_at: new Date().toISOString(), created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() }); setIsLoadingStats(false); }, 500);
    }
  };

  const handleFormSubmit = async (service: keyof ConnectionStatus) => {
    try {
      let config;
      switch (service) {
        case "microsoft365": config = { tenant_id: microsoft365Form.tenantId, client_id: microsoft365Form.clientId, client_secret: microsoft365Form.clientSecret, redirect_uri: microsoft365Form.redirectUri }; break;
        case "googleWorkspace": config = { account_id: googleWorkspaceForm.accountId, client_id: googleWorkspaceForm.clientId, client_secret: googleWorkspaceForm.clientSecret, redirect_uri: googleWorkspaceForm.redirectUri }; break;
        case "dropbox": config = { app_key: dropboxForm.appKey, client_id: dropboxForm.appKey, client_secret: dropboxForm.appSecret, redirect_uri: dropboxForm.redirectUri }; break;
        case "slack": config = { workspace_id: slackForm.workspaceId, client_id: slackForm.clientId, client_secret: slackForm.clientSecret, redirect_uri: slackForm.redirectUri }; break;
        case "zoom": config = { account_id: zoomForm.accountId, client_id: zoomForm.clientId, client_secret: zoomForm.clientSecret, redirect_uri: zoomForm.redirectUri }; break;
        case "jira": config = { instance_url: jiraForm.instanceUrl, client_id: jiraForm.clientId, client_secret: jiraForm.clientSecret, redirect_uri: jiraForm.redirectUri }; break;
        default: throw new Error("Unknown service");
      }
      toast({ title: "Connecting", description: `Connecting to ${service}...` });
      setIsTestingConnection(true); setTestingStage("connecting");
      const result = await ConnectionAPI.createConnection(service, config);
      setConnectionIds((prev) => ({ ...prev, [service]: result.connection_id }));
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const connectResult = await ConnectionAPI.connect(result.connection_id);
      setIsTestingConnection(false); setTestingStage(null);
      if (connectResult.status === "connected") {
        setConnections((prev) => ({ ...prev, [service]: true }));
        toast({ title: "Connection Successful", description: `Successfully connected to ${service}.` });
        setTestStatus({ status: "success", message: "Connection established successfully", details: `${service} is now connected.`, timestamp: new Date().toISOString() });
      } else {
        toast({ title: "Connection Failed", description: connectResult.error || `Failed to connect to ${service}.`, variant: "destructive" });
        setTestStatus({ status: "error", message: "Connection failed", details: connectResult.error || `Could not connect to ${service}.`, timestamp: new Date().toISOString() });
      }
      setActiveModal(null);
    } catch (error) {
      setIsTestingConnection(false); setTestingStage(null);
      toast({ title: "Error", description: `Failed to set up ${service}.`, variant: "destructive" });
      setTestStatus({ status: "error", message: "Connection error", details: error instanceof Error ? error.message : `An error occurred connecting to ${service}.`, timestamp: new Date().toISOString() });
    }
  };

  const connectService = (service: keyof ConnectionStatus) => showConfigModal(service);
  const disconnectService = async (service: keyof ConnectionStatus) => {
    toast({ title: "Disconnecting", description: `Disconnecting from ${service}...` });
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setConnections((prev) => ({ ...prev, [service]: false }));
    toast({ title: "Disconnected", description: `Successfully disconnected from ${service}.` });
  };
  const connectCustomAPI = (apiId: string) => { setEditingApiId(apiId); showConfigModal("customAPI"); };
  const disconnectCustomAPI = (apiId: string) => {
    toast({ title: "Disconnecting", description: "Disconnecting from custom API..." });
    setTimeout(() => {
      setCustomAPIs((prevAPIs) => prevAPIs.map((api) => (api.id === apiId ? { ...api, isConnected: false, connectionId: undefined, stats: undefined } : api)));
      toast({ title: "Disconnected", description: "Successfully disconnected the custom API." });
    }, 1500);
  };
  const addCustomAPI = () => {
    const newId = `api${customAPIs.length + 1}`;
    setCustomAPIs((prevAPIs) => [...prevAPIs, { id: newId, name: `Custom API ${customAPIs.length + 1}`, isConnected: false, apiUrl: "", apiKey: "", headers: '{"Content-Type": "application/json"}', authType: "Bearer" }]);
  };
  const deleteCustomAPI = (apiId: string) => setCustomAPIs((prevAPIs) => prevAPIs.filter((api) => api.id !== apiId));
  const renameCustomAPI = (apiId: string, newName: string) => setCustomAPIs((prevAPIs) => prevAPIs.map((api) => (api.id === apiId ? { ...api, name: newName } : api)));
  const handleCustomAPIFormSubmit = async () => {
    if (!editingApiId) return;
    try {
      const api = customAPIs.find((api) => api.id === editingApiId);
      if (!api) return;
      toast({ title: "Connecting", description: "Connecting to custom API..." });
      setIsTestingConnection(true); setTestingStage("connecting");
      const config = { api_url: customAPIForm.apiUrl, api_key: customAPIForm.apiKey, auth_type: customAPIForm.authType, headers: customAPIForm.headers };
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const result = await ConnectionAPI.createConnection("customapi", config);
      const connectResult = await ConnectionAPI.connect(result.connection_id);
      setIsTestingConnection(false); setTestingStage(null);
      if (connectResult.status === "connected") {
        setCustomAPIs((prevAPIs) => prevAPIs.map((api) => (api.id === editingApiId ? { ...api, isConnected: true, apiUrl: customAPIForm.apiUrl, apiKey: customAPIForm.apiKey, headers: customAPIForm.headers, authType: customAPIForm.authType, connectionId: result.connection_id } : api)));
        toast({ title: "Connection Successful", description: "Successfully connected to custom API." });
        setTestStatus({ status: "success", message: "Connection established successfully", details: "Custom API is now connected.", timestamp: new Date().toISOString() });
      } else {
        toast({ title: "Connection Failed", description: connectResult.error || "Failed to connect to custom API.", variant: "destructive" });
        setTestStatus({ status: "error", message: "Connection failed", details: connectResult.error || "Could not connect to custom API.", timestamp: new Date().toISOString() });
      }
      setActiveModal(null); setEditingApiId(null);
    } catch (error) {
      setIsTestingConnection(false); setTestingStage(null);
      toast({ title: "Error", description: "Failed to set up custom API.", variant: "destructive" });
      setTestStatus({ status: "error", message: "Connection error", details: error instanceof Error ? error.message : "An error occurred connecting to custom API.", timestamp: new Date().toISOString() });
    }
  };
  const updateCustomAPISettings = () => {
    if (!editingApiId) return;
    toast({ title: "Updating", description: "Updating custom API settings..." });
    setTimeout(() => {
      setCustomAPIs((prevAPIs) => prevAPIs.map((api) => (api.id === editingApiId ? { ...api, apiUrl: customAPIForm.apiUrl, apiKey: customAPIForm.apiKey, headers: customAPIForm.headers, authType: customAPIForm.authType } : api)));
      setActiveModal(null); setEditingApiId(null);
      toast({ title: "Settings Updated", description: "Successfully updated custom API settings." });
    }, 1500);
  };

  const handleBack = () => { setCurrentStep(0); router.push("/components/FirstTimeSetUp/OrganizationSetup"); };
  const handleNext = () => { if (isAnyConnected) { setCurrentStep(2); router.push("/components/FirstTimeSetUp/employees"); } else setShowConnectionRequiredTooltip(true); };

  const renderPlatformCard = (name: string, icon: React.ReactNode, description: string, connectionKey: keyof ConnectionStatus, serviceName: string) => {
    const isConnected = connections[connectionKey];
    const connectionId = connectionIds[connectionKey];
    return (
      <Card className="bg-white border border-gray-200 shadow-md hover:shadow-xl rounded-lg transition-all duration-300">
        <CardHeader className="flex flex-row items-center gap-4">
          <div className="w-12 h-12 flex items-center justify-center rounded-md">{icon}</div>
          <div><CardTitle>{name}</CardTitle></div>
          <Badge variant={isConnected ? "green" : "customGray"} className="ml-auto w-28 text-center">{isConnected ? "Connected" : "Not Connected"}</Badge>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-muted-foreground">
            <p>{description}</p>
            {connectionId && <p className="mt-1 text-xs">Connection ID: {connectionId}</p>}
          </div>
        </CardContent>
        <div className="flex justify-between p-4">
          {isConnected ? (
            <>
              <Button variant="outline" size="sm" className="flex-1 bg-red-500 hover:bg-red-600 text-white" onClick={() => disconnectService(connectionKey)}>Disconnect</Button>
              <Button variant="outline" size="sm" className="ml-2" onClick={() => showSettingsModal(serviceName)}><Cog className="h-4 w-4" /></Button>
              <Button variant="outline" size="sm" className="ml-2" onClick={() => showStatsModal(serviceName)}><Info className="h-4 w-4" /></Button>
            </>
          ) : (
            <Button variant="outline" size="sm" className="w-full bg-blue-500 hover:bg-blue-600 text-white" onClick={() => connectService(connectionKey)}>Connect</Button>
          )}
        </div>
      </Card>
    );
  };

  const renderTestConnectionButton = (service: string, config: any) => (
    <Button type="button" variant="outline" onClick={() => testConnection(service, config)} disabled={isTestingConnection} className={`w-36 ${isTestingConnection ? "bg-blue-50" : ""}`}>
      {isTestingConnection ? (
        <div className="flex items-center justify-center">
          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          <span className="text-xs">{testingStage === "initializing" ? "Initializing..." : testingStage === "validating" ? "Validating..." : testingStage === "connecting" ? "Connecting..." : testingStage === "completed" ? "Finishing..." : "Error..."}</span>
        </div>
      ) : (
        "Test Connection"
      )}
    </Button>
  );

  return (
    <main className="min-h-screen bg-background">
      <div className="container px-4 py-6 md:px-6 md:py-12 lg:py-16">
        <div className="flex flex-col gap-8">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">Data Source Connection</h2>
            <p className="text-muted-foreground mt-2">Connect to your workplace platforms to collect data for analysis.</p>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {renderPlatformCard(
              "Microsoft 365",
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 23 23" className="bg-[#f3f2f1]">
                <path fill="#F25022" d="M1 1h9v9H1z" />
                <path fill="#80BA01" d="M13 1h9v9h-9z" />
                <path fill="#02A4EF" d="M1 13h9v9H1z" />
                <path fill="#FFB902" d="M13 13h9v9h-9z" />
              </svg>,
              "Connect to access emails, calendar, SharePoint, and Teams data.",
              "microsoft365",
              "microsoft365"
            )}
            {renderPlatformCard(
              "Google Workspace",
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" className="bg-white">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
              </svg>,
              "Connect to access Gmail, Calendar, Drive, and Google Chat data.",
              "googleWorkspace",
              "googleWorkspace"
            )}
            {renderPlatformCard(
              "Dropbox",
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" className="bg-[#0061ff]">
                <path d="M12 14.56l4.07-3.32 4.43 2.94-4.43 2.94L12 14.56zm-8.5-0.38l4.43-2.94 4.07 3.32-4.07 2.56L3.5 14.18zm8.5-7.37l4.07 3.32-4.07 2.56-4.07-2.56L12 6.81zm-4.07 5.88L3.5 9.75l4.43-2.94 4.07 2.56-4.07 3.32z" />
              </svg>,
              "Connect to access Dropbox files and sharing activities.",
              "dropbox",
              "dropbox"
            )}
            {renderPlatformCard(
              "Slack",
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" className="bg-[#4A154B]">
                <path d="M6 15a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0-6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm-6 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm6 0a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
              </svg>,
              "Connect to access Slack messages and activity data.",
              "slack",
              "slack"
            )}
            {renderPlatformCard(
              "Zoom",
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" className="bg-[#2D8CFF]">
                <path d="M16 8v8H8V8h8m0-2H8c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm4 2v8h-1V8h1m0-2h-1c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h1c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zM5 8v8H4V8h1m0-2H4c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h1c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2z" />
              </svg>,
              "Connect to access Zoom meeting and participant data.",
              "zoom",
              "zoom"
            )}
            {renderPlatformCard(
              "Jira",
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white" className="bg-[#0052CC]">
                <path d="M11.53 2l-4.78 4.78 4.78 4.78 4.78-4.78L11.53 2zm-4.78 4.78L2 11.53l4.78 4.78 4.78-4.78-4.78-4.78zm9.56 0l-4.78 4.78 4.78 4.78L21.06 11.53l-4.78-4.78zm-4.78 4.78L6.74 16.31l4.78 4.78 4.78-4.78-4.78-4.78z" />
              </svg>,
              "Connect to access Jira issues, projects, and workflow data.",
              "jira",
              "jira"
            )}
            {customAPIs.map((api) => (
              <CustomAPICard key={api.id} api={api} onConnect={() => connectCustomAPI(api.id)} onDisconnect={() => disconnectCustomAPI(api.id)} onSettings={() => showCustomAPISettingsModal(api.id)} onStats={() => showCustomAPIStatsModal(api.id)} onRename={(newName) => renameCustomAPI(api.id, newName)} onDelete={() => deleteCustomAPI(api.id)} />
            ))}
            <Card className="bg-white border border-dashed border-gray-300 shadow-sm hover:shadow-md rounded-lg transition-all duration-300 cursor-pointer" onClick={addCustomAPI}>
              <div className="flex flex-col items-center justify-center p-6 h-full">
                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3"><Plus className="h-6 w-6 text-gray-500" /></div>
                <p className="text-center text-gray-500 font-medium">Add New API Connection</p>
              </div>
            </Card>
          </div>
          <div className="flex justify-between mt-4">
            <Button onClick={handleBack} className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg">Back</Button>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div>
                    <Button onClick={handleNext} className={`bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg ${isAnyConnected ? "" : "opacity-50 cursor-not-allowed"}`} disabled={!isAnyConnected}>Next</Button>
                  </div>
                </TooltipTrigger>
                {!isAnyConnected && <TooltipContent><p>Connect at least one service to continue</p></TooltipContent>}
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
      </div>

      {/* Configuration Modals */}
      <ConfigModal isOpen={activeModal === "microsoft365"} onClose={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }} title="Microsoft 365 Configuration">
        <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit("microsoft365"); }}>
          <div className="space-y-4">
            <div><Label htmlFor="ms-client-id">Client ID</Label><Input id="ms-client-id" value={microsoft365Form.clientId} onChange={(e) => setMicrosoft365Form({ ...microsoft365Form, clientId: e.target.value })} required /></div>
            <div><Label htmlFor="ms-client-secret">Client Secret</Label><PasswordInput id="ms-client-secret" value={microsoft365Form.clientSecret} onChange={(e) => setMicrosoft365Form({ ...microsoft365Form, clientSecret: e.target.value })} required /></div>
            <div><Label htmlFor="ms-tenant-id">Tenant ID</Label><Input id="ms-tenant-id" value={microsoft365Form.tenantId} onChange={(e) => setMicrosoft365Form({ ...microsoft365Form, tenantId: e.target.value })} required /></div>
            <div><Label htmlFor="ms-redirect-uri">Redirect URI</Label><Input id="ms-redirect-uri" value={microsoft365Form.redirectUri} onChange={(e) => setMicrosoft365Form({ ...microsoft365Form, redirectUri: e.target.value })} required /><p className="text-xs text-gray-500 mt-1">This URI needs to be registered in your Azure AD app.</p></div>
            {testStatus && <ConnectionTestResults status={testStatus.status} message={testStatus.message} details={testStatus.details} timestamp={testStatus.timestamp} />}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }}>Cancel</Button>
              {renderTestConnectionButton("microsoft365", { tenant_id: microsoft365Form.tenantId, client_id: microsoft365Form.clientId, client_secret: microsoft365Form.clientSecret, redirect_uri: microsoft365Form.redirectUri })}
              <Button type="submit" disabled={isTestingConnection}>{isTestingConnection ? <div className="flex items-center"><Loader2 className="h-4 w-4 mr-2 animate-spin" />Connecting...</div> : "Connect"}</Button>
            </div>
          </div>
        </form>
      </ConfigModal>

      <ConfigModal isOpen={activeModal === "microsoft365_settings"} onClose={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }} title="Microsoft 365 Settings">
        <form onSubmit={(e) => { e.preventDefault(); setActiveModal(null); }}>
          <div className="space-y-4">
            <div><Label htmlFor="ms-client-id-settings">Client ID</Label><Input id="ms-client-id-settings" value={microsoft365Form.clientId} onChange={(e) => setMicrosoft365Form({ ...microsoft365Form, clientId: e.target.value })} required /></div>
            <div><Label htmlFor="ms-client-secret-settings">Client Secret</Label><PasswordInput id="ms-client-secret-settings" value={microsoft365Form.clientSecret} onChange={(e) => setMicrosoft365Form({ ...microsoft365Form, clientSecret: e.target.value })} required /></div>
            <div><Label htmlFor="ms-tenant-id-settings">Tenant ID</Label><Input id="ms-tenant-id-settings" value={microsoft365Form.tenantId} onChange={(e) => setMicrosoft365Form({ ...microsoft365Form, tenantId: e.target.value })} required /></div>
            <div><Label htmlFor="ms-redirect-uri-settings">Redirect URI</Label><Input id="ms-redirect-uri-settings" value={microsoft365Form.redirectUri} onChange={(e) => setMicrosoft365Form({ ...microsoft365Form, redirectUri: e.target.value })} required /></div>
            {testStatus && <ConnectionTestResults status={testStatus.status} message={testStatus.message} details={testStatus.details} timestamp={testStatus.timestamp} />}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }}>Cancel</Button>
              {renderTestConnectionButton("microsoft365", { tenant_id: microsoft365Form.tenantId, client_id: microsoft365Form.clientId, client_secret: microsoft365Form.clientSecret, redirect_uri: microsoft365Form.redirectUri })}
              <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </form>
      </ConfigModal>

      <ConfigModal isOpen={activeModal === "googleWorkspace"} onClose={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }} title="Google Workspace Configuration">
        <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit("googleWorkspace"); }}>
          <div className="space-y-4">
            <div><Label htmlFor="google-account-id">Account ID</Label><Input id="google-account-id" value={googleWorkspaceForm.accountId} onChange={(e) => setGoogleWorkspaceForm({ ...googleWorkspaceForm, accountId: e.target.value })} required placeholder="example.com" /><p className="text-xs text-gray-500 mt-1">Your Google Workspace domain (e.g., example.com)</p></div>
            <div><Label htmlFor="google-client-id">Client ID</Label><Input id="google-client-id" value={googleWorkspaceForm.clientId} onChange={(e) => setGoogleWorkspaceForm({ ...googleWorkspaceForm, clientId: e.target.value })} required /></div>
            <div><Label htmlFor="google-client-secret">Client Secret</Label><PasswordInput id="google-client-secret" value={googleWorkspaceForm.clientSecret} onChange={(e) => setGoogleWorkspaceForm({ ...googleWorkspaceForm, clientSecret: e.target.value })} required /></div>
            <div><Label htmlFor="google-redirect-uri">Redirect URI</Label><Input id="google-redirect-uri" value={googleWorkspaceForm.redirectUri} onChange={(e) => setGoogleWorkspaceForm({ ...googleWorkspaceForm, redirectUri: e.target.value })} required /></div>
            <div><Label htmlFor="google-scopes">API Scopes</Label><Textarea id="google-scopes" value={googleWorkspaceForm.scope} onChange={(e) => setGoogleWorkspaceForm({ ...googleWorkspaceForm, scope: e.target.value })} className="min-h-20" required /><p className="text-xs text-gray-500 mt-1">Space-separated list of OAuth scopes.</p></div>
            {testStatus && <ConnectionTestResults status={testStatus.status} message={testStatus.message} details={testStatus.details} timestamp={testStatus.timestamp} />}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }}>Cancel</Button>
              {renderTestConnectionButton("googleWorkspace", { account_id: googleWorkspaceForm.accountId, client_id: googleWorkspaceForm.clientId, client_secret: googleWorkspaceForm.clientSecret, redirect_uri: googleWorkspaceForm.redirectUri })}
              <Button type="submit" disabled={isTestingConnection}>{isTestingConnection ? <div className="flex items-center"><Loader2 className="h-4 w-4 mr-2 animate-spin" />Connecting...</div> : "Connect"}</Button>
            </div>
          </div>
        </form>
      </ConfigModal>

      <ConfigModal isOpen={activeModal === "googleWorkspace_settings"} onClose={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }} title="Google Workspace Settings">
        <form onSubmit={(e) => { e.preventDefault(); setActiveModal(null); }}>
          <div className="space-y-4">
            <div><Label htmlFor="google-account-id-settings">Account ID</Label><Input id="google-account-id-settings" value={googleWorkspaceForm.accountId} onChange={(e) => setGoogleWorkspaceForm({ ...googleWorkspaceForm, accountId: e.target.value })} required /></div>
            <div><Label htmlFor="google-client-id-settings">Client ID</Label><Input id="google-client-id-settings" value={googleWorkspaceForm.clientId} onChange={(e) => setGoogleWorkspaceForm({ ...googleWorkspaceForm, clientId: e.target.value })} required /></div>
            <div><Label htmlFor="google-client-secret-settings">Client Secret</Label><PasswordInput id="google-client-secret-settings" value={googleWorkspaceForm.clientSecret} onChange={(e) => setGoogleWorkspaceForm({ ...googleWorkspaceForm, clientSecret: e.target.value })} required /></div>
            <div><Label htmlFor="google-redirect-uri-settings">Redirect URI</Label><Input id="google-redirect-uri-settings" value={googleWorkspaceForm.redirectUri} onChange={(e) => setGoogleWorkspaceForm({ ...googleWorkspaceForm, redirectUri: e.target.value })} required /></div>
            <div><Label htmlFor="google-scopes-settings">API Scopes</Label><Textarea id="google-scopes-settings" value={googleWorkspaceForm.scope} onChange={(e) => setGoogleWorkspaceForm({ ...googleWorkspaceForm, scope: e.target.value })} className="min-h-20" required /></div>
            {testStatus && <ConnectionTestResults status={testStatus.status} message={testStatus.message} details={testStatus.details} timestamp={testStatus.timestamp} />}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }}>Cancel</Button>
              {renderTestConnectionButton("googleWorkspace", { account_id: googleWorkspaceForm.accountId, client_id: googleWorkspaceForm.clientId, client_secret: googleWorkspaceForm.clientSecret, redirect_uri: googleWorkspaceForm.redirectUri })}
              <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </form>
      </ConfigModal>

      <ConfigModal isOpen={activeModal === "dropbox"} onClose={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }} title="Dropbox Configuration">
        <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit("dropbox"); }}>
          <div className="space-y-4">
            <div><Label htmlFor="dropbox-app-key">App Key</Label><Input id="dropbox-app-key" value={dropboxForm.appKey} onChange={(e) => setDropboxForm({ ...dropboxForm, appKey: e.target.value })} required /></div>
            <div><Label htmlFor="dropbox-app-secret">App Secret</Label><PasswordInput id="dropbox-app-secret" value={dropboxForm.appSecret} onChange={(e) => setDropboxForm({ ...dropboxForm, appSecret: e.target.value })} required /></div>
            <div><Label htmlFor="dropbox-redirect-uri">Redirect URI</Label><Input id="dropbox-redirect-uri" value={dropboxForm.redirectUri} onChange={(e) => setDropboxForm({ ...dropboxForm, redirectUri: e.target.value })} required /></div>
            {testStatus && <ConnectionTestResults status={testStatus.status} message={testStatus.message} details={testStatus.details} timestamp={testStatus.timestamp} />}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }}>Cancel</Button>
              {renderTestConnectionButton("dropbox", { app_key: dropboxForm.appKey, client_secret: dropboxForm.appSecret, redirect_uri: dropboxForm.redirectUri })}
              <Button type="submit" disabled={isTestingConnection}>{isTestingConnection ? <div className="flex items-center"><Loader2 className="h-4 w-4 mr-2 animate-spin" />Connecting...</div> : "Connect"}</Button>
            </div>
          </div>
        </form>
      </ConfigModal>

      <ConfigModal isOpen={activeModal === "dropbox_settings"} onClose={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }} title="Dropbox Settings">
        <form onSubmit={(e) => { e.preventDefault(); setActiveModal(null); }}>
          <div className="space-y-4">
            <div><Label htmlFor="dropbox-app-key-settings">App Key</Label><Input id="dropbox-app-key-settings" value={dropboxForm.appKey} onChange={(e) => setDropboxForm({ ...dropboxForm, appKey: e.target.value })} required /></div>
            <div><Label htmlFor="dropbox-app-secret-settings">App Secret</Label><PasswordInput id="dropbox-app-secret-settings" value={dropboxForm.appSecret} onChange={(e) => setDropboxForm({ ...dropboxForm, appSecret: e.target.value })} required /></div>
            <div><Label htmlFor="dropbox-redirect-uri-settings">Redirect URI</Label><Input id="dropbox-redirect-uri-settings" value={dropboxForm.redirectUri} onChange={(e) => setDropboxForm({ ...dropboxForm, redirectUri: e.target.value })} required /></div>
            {testStatus && <ConnectionTestResults status={testStatus.status} message={testStatus.message} details={testStatus.details} timestamp={testStatus.timestamp} />}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }}>Cancel</Button>
              {renderTestConnectionButton("dropbox", { app_key: dropboxForm.appKey, client_secret: dropboxForm.appSecret, redirect_uri: dropboxForm.redirectUri })}
              <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </form>
      </ConfigModal>

      <ConfigModal isOpen={activeModal === "slack"} onClose={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }} title="Slack Configuration">
        <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit("slack"); }}>
          <div className="space-y-4">
            <div><Label htmlFor="slack-workspace-id">Workspace ID</Label><Input id="slack-workspace-id" value={slackForm.workspaceId} onChange={(e) => setSlackForm({ ...slackForm, workspaceId: e.target.value })} placeholder="T01ABC123DE" required /><p className="text-xs text-gray-500 mt-1">Your Slack workspace identifier (e.g., T01ABC123DE)</p></div>
            <div><Label htmlFor="slack-client-id">Client ID</Label><Input id="slack-client-id" value={slackForm.clientId} onChange={(e) => setSlackForm({ ...slackForm, clientId: e.target.value })} required /></div>
            <div><Label htmlFor="slack-client-secret">Client Secret</Label><PasswordInput id="slack-client-secret" value={slackForm.clientSecret} onChange={(e) => setSlackForm({ ...slackForm, clientSecret: e.target.value })} required /></div>
            <div><Label htmlFor="slack-redirect-uri">Redirect URI</Label><Input id="slack-redirect-uri" value={slackForm.redirectUri} onChange={(e) => setSlackForm({ ...slackForm, redirectUri: e.target.value })} required /></div>
            <div><Label htmlFor="slack-scopes">API Scopes</Label><Input id="slack-scopes" value={slackForm.scopes} onChange={(e) => setSlackForm({ ...slackForm, scopes: e.target.value })} required /><p className="text-xs text-gray-500 mt-1">Space-separated list of scopes.</p></div>
            {testStatus && <ConnectionTestResults status={testStatus.status} message={testStatus.message} details={testStatus.details} timestamp={testStatus.timestamp} />}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }}>Cancel</Button>
              {renderTestConnectionButton("slack", { workspace_id: slackForm.workspaceId, client_id: slackForm.clientId, client_secret: slackForm.clientSecret, redirect_uri: slackForm.redirectUri })}
              <Button type="submit" disabled={isTestingConnection}>{isTestingConnection ? <div className="flex items-center"><Loader2 className="h-4 w-4 mr-2 animate-spin" />Connecting...</div> : "Connect"}</Button>
            </div>
          </div>
        </form>
      </ConfigModal>

      <ConfigModal isOpen={activeModal === "slack_settings"} onClose={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }} title="Slack Settings">
        <form onSubmit={(e) => { e.preventDefault(); setActiveModal(null); }}>
          <div className="space-y-4">
            <div><Label htmlFor="slack-workspace-id-settings">Workspace ID</Label><Input id="slack-workspace-id-settings" value={slackForm.workspaceId} onChange={(e) => setSlackForm({ ...slackForm, workspaceId: e.target.value })} required /></div>
            <div><Label htmlFor="slack-client-id-settings">Client ID</Label><Input id="slack-client-id-settings" value={slackForm.clientId} onChange={(e) => setSlackForm({ ...slackForm, clientId: e.target.value })} required /></div>
            <div><Label htmlFor="slack-client-secret-settings">Client Secret</Label><PasswordInput id="slack-client-secret-settings" value={slackForm.clientSecret} onChange={(e) => setSlackForm({ ...slackForm, clientSecret: e.target.value })} required /></div>
            <div><Label htmlFor="slack-redirect-uri-settings">Redirect URI</Label><Input id="slack-redirect-uri-settings" value={slackForm.redirectUri} onChange={(e) => setSlackForm({ ...slackForm, redirectUri: e.target.value })} required /></div>
            <div><Label htmlFor="slack-scopes-settings">API Scopes</Label><Input id="slack-scopes-settings" value={slackForm.scopes} onChange={(e) => setSlackForm({ ...slackForm, scopes: e.target.value })} required /></div>
            {testStatus && <ConnectionTestResults status={testStatus.status} message={testStatus.message} details={testStatus.details} timestamp={testStatus.timestamp} />}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }}>Cancel</Button>
              {renderTestConnectionButton("slack", { workspace_id: slackForm.workspaceId, client_id: slackForm.clientId, client_secret: slackForm.clientSecret, redirect_uri: slackForm.redirectUri })}
              <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </form>
      </ConfigModal>

      <ConfigModal isOpen={activeModal === "zoom"} onClose={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }} title="Zoom Configuration">
        <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit("zoom"); }}>
          <div className="space-y-4">
            <div><Label htmlFor="zoom-account-id">Account ID</Label><Input id="zoom-account-id" value={zoomForm.accountId} onChange={(e) => setZoomForm({ ...zoomForm, accountId: e.target.value })} required /></div>
            <div><Label htmlFor="zoom-client-id">Client ID</Label><Input id="zoom-client-id" value={zoomForm.clientId} onChange={(e) => setZoomForm({ ...zoomForm, clientId: e.target.value })} required /></div>
            <div><Label htmlFor="zoom-client-secret">Client Secret</Label><PasswordInput id="zoom-client-secret" value={zoomForm.clientSecret} onChange={(e) => setZoomForm({ ...zoomForm, clientSecret: e.target.value })} required /></div>
            <div><Label htmlFor="zoom-redirect-uri">Redirect URI</Label><Input id="zoom-redirect-uri" value={zoomForm.redirectUri} onChange={(e) => setZoomForm({ ...zoomForm, redirectUri: e.target.value })} required /></div>
            {testStatus && <ConnectionTestResults status={testStatus.status} message={testStatus.message} details={testStatus.details} timestamp={testStatus.timestamp} />}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }}>Cancel</Button>
              {renderTestConnectionButton("zoom", { account_id: zoomForm.accountId, client_id: zoomForm.clientId, client_secret: zoomForm.clientSecret, redirect_uri: zoomForm.redirectUri })}
              <Button type="submit" disabled={isTestingConnection}>{isTestingConnection ? <div className="flex items-center"><Loader2 className="h-4 w-4 mr-2 animate-spin" />Connecting...</div> : "Connect"}</Button>
            </div>
          </div>
        </form>
      </ConfigModal>

      <ConfigModal isOpen={activeModal === "zoom_settings"} onClose={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }} title="Zoom Settings">
        <form onSubmit={(e) => { e.preventDefault(); setActiveModal(null); }}>
          <div className="space-y-4">
            <div><Label htmlFor="zoom-account-id-settings">Account ID</Label><Input id="zoom-account-id-settings" value={zoomForm.accountId} onChange={(e) => setZoomForm({ ...zoomForm, accountId: e.target.value })} required /></div>
            <div><Label htmlFor="zoom-client-id-settings">Client ID</Label><Input id="zoom-client-id-settings" value={zoomForm.clientId} onChange={(e) => setZoomForm({ ...zoomForm, clientId: e.target.value })} required /></div>
            <div><Label htmlFor="zoom-client-secret-settings">Client Secret</Label><PasswordInput id="zoom-client-secret-settings" value={zoomForm.clientSecret} onChange={(e) => setZoomForm({ ...zoomForm, clientSecret: e.target.value })} required /></div>
            <div><Label htmlFor="zoom-redirect-uri-settings">Redirect URI</Label><Input id="zoom-redirect-uri-settings" value={zoomForm.redirectUri} onChange={(e) => setZoomForm({ ...zoomForm, redirectUri: e.target.value })} required /></div>
            {testStatus && <ConnectionTestResults status={testStatus.status} message={testStatus.message} details={testStatus.details} timestamp={testStatus.timestamp} />}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }}>Cancel</Button>
              {renderTestConnectionButton("zoom", { account_id: zoomForm.accountId, client_id: zoomForm.clientId, client_secret: zoomForm.clientSecret, redirect_uri: zoomForm.redirectUri })}
              <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </form>
      </ConfigModal>

      <ConfigModal isOpen={activeModal === "jira"} onClose={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }} title="Jira Configuration">
        <form onSubmit={(e) => { e.preventDefault(); handleFormSubmit("jira"); }}>
          <div className="space-y-4">
            <div><Label htmlFor="jira-instance-url">Instance URL</Label><Input id="jira-instance-url" value={jiraForm.instanceUrl} onChange={(e) => setJiraForm({ ...jiraForm, instanceUrl: e.target.value })} required placeholder="https://your-domain.atlassian.net" /></div>
            <div><Label htmlFor="jira-client-id">Client ID</Label><Input id="jira-client-id" value={jiraForm.clientId} onChange={(e) => setJiraForm({ ...jiraForm, clientId: e.target.value })} required /></div>
            <div><Label htmlFor="jira-client-secret">Client Secret</Label><PasswordInput id="jira-client-secret" value={jiraForm.clientSecret} onChange={(e) => setJiraForm({ ...jiraForm, clientSecret: e.target.value })} required /></div>
            <div><Label htmlFor="jira-redirect-uri">Redirect URI</Label><Input id="jira-redirect-uri" value={jiraForm.redirectUri} onChange={(e) => setJiraForm({ ...jiraForm, redirectUri: e.target.value })} required /><p className="text-xs text-gray-500 mt-1">This URI needs to be registered in your Atlassian app.</p></div>
            {testStatus && <ConnectionTestResults status={testStatus.status} message={testStatus.message} details={testStatus.details} timestamp={testStatus.timestamp} />}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }}>Cancel</Button>
              {renderTestConnectionButton("jira", { instance_url: jiraForm.instanceUrl, client_id: jiraForm.clientId, client_secret: jiraForm.clientSecret, redirect_uri: jiraForm.redirectUri })}
              <Button type="submit" disabled={isTestingConnection}>{isTestingConnection ? <div className="flex items-center"><Loader2 className="h-4 w-4 mr-2 animate-spin" />Connecting...</div> : "Connect"}</Button>
            </div>
          </div>
        </form>
      </ConfigModal>

      <ConfigModal isOpen={activeModal === "jira_settings"} onClose={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }} title="Jira Settings">
        <form onSubmit={(e) => { e.preventDefault(); setActiveModal(null); }}>
          <div className="space-y-4">
            <div><Label htmlFor="jira-instance-url-settings">Instance URL</Label><Input id="jira-instance-url-settings" value={jiraForm.instanceUrl} onChange={(e) => setJiraForm({ ...jiraForm, instanceUrl: e.target.value })} required /></div>
            <div><Label htmlFor="jira-client-id-settings">Client ID</Label><Input id="jira-client-id-settings" value={jiraForm.clientId} onChange={(e) => setJiraForm({ ...jiraForm, clientId: e.target.value })} required /></div>
            <div><Label htmlFor="jira-client-secret-settings">Client Secret</Label><PasswordInput id="jira-client-secret-settings" value={jiraForm.clientSecret} onChange={(e) => setJiraForm({ ...jiraForm, clientSecret: e.target.value })} required /></div>
            <div><Label htmlFor="jira-redirect-uri-settings">Redirect URI</Label><Input id="jira-redirect-uri-settings" value={jiraForm.redirectUri} onChange={(e) => setJiraForm({ ...jiraForm, redirectUri: e.target.value })} required /></div>
            {testStatus && <ConnectionTestResults status={testStatus.status} message={testStatus.message} details={testStatus.details} timestamp={testStatus.timestamp} />}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }}>Cancel</Button>
              {renderTestConnectionButton("jira", { instance_url: jiraForm.instanceUrl, client_id: jiraForm.clientId, client_secret: jiraForm.clientSecret, redirect_uri: jiraForm.redirectUri })}
              <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </form>
      </ConfigModal>

      <ConfigModal isOpen={activeModal === "customAPI"} onClose={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }} title={`${editingApiId ? customAPIs.find((api) => api.id === editingApiId)?.name || "Custom API" : "Custom API"} Configuration`}>
        <form onSubmit={(e) => { e.preventDefault(); handleCustomAPIFormSubmit(); }}>
          <div className="space-y-4">
            <div><Label htmlFor="api-url">API Endpoint URL</Label><Input id="api-url" value={customAPIForm.apiUrl} onChange={(e) => setCustomAPIForm({ ...customAPIForm, apiUrl: e.target.value })} placeholder="https://api.example.com/data" required /></div>
            <div><Label htmlFor="api-key">API Key</Label><PasswordInput id="api-key" value={customAPIForm.apiKey} onChange={(e) => setCustomAPIForm({ ...customAPIForm, apiKey: e.target.value })} required /></div>
            <div><Label htmlFor="auth-type">Authentication Type</Label><select id="auth-type" value={customAPIForm.authType} onChange={(e) => setCustomAPIForm({ ...customAPIForm, authType: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md" required><option value="Bearer">Bearer Token</option><option value="Basic">Basic Auth</option><option value="ApiKey">API Key in Header</option><option value="None">No Auth</option></select></div>
            <div><Label htmlFor="headers">Custom Headers (JSON format)</Label><Textarea id="headers" value={customAPIForm.headers} onChange={(e) => setCustomAPIForm({ ...customAPIForm, headers: e.target.value })} className="font-mono text-sm min-h-20" placeholder='{"Content-Type": "application/json", "X-Custom-Header": "value"}' required /></div>
            {testStatus && <ConnectionTestResults status={testStatus.status} message={testStatus.message} details={testStatus.details} timestamp={testStatus.timestamp} />}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }}>Cancel</Button>
              {renderTestConnectionButton("customapi", { api_url: customAPIForm.apiUrl, api_key: customAPIForm.apiKey, auth_type: customAPIForm.authType, headers: customAPIForm.headers })}
              <Button type="submit" disabled={isTestingConnection}>{isTestingConnection ? <div className="flex items-center"><Loader2 className="h-4 w-4 mr-2 animate-spin" />Connecting...</div> : "Connect"}</Button>
            </div>
          </div>
        </form>
      </ConfigModal>

      <ConfigModal isOpen={activeModal === "customAPI_settings"} onClose={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }} title={`${editingApiId ? customAPIs.find((api) => api.id === editingApiId)?.name || "Custom API" : "Custom API"} Settings`}>
        <form onSubmit={(e) => { e.preventDefault(); updateCustomAPISettings(); }}>
          <div className="space-y-4">
            <div><Label htmlFor="api-url-settings">API Endpoint URL</Label><Input id="api-url-settings" value={customAPIForm.apiUrl} onChange={(e) => setCustomAPIForm({ ...customAPIForm, apiUrl: e.target.value })} required /></div>
            <div><Label htmlFor="api-key-settings">API Key</Label><PasswordInput id="api-key-settings" value={customAPIForm.apiKey} onChange={(e) => setCustomAPIForm({ ...customAPIForm, apiKey: e.target.value })} required /></div>
            <div><Label htmlFor="auth-type-settings">Authentication Type</Label><select id="auth-type-settings" value={customAPIForm.authType} onChange={(e) => setCustomAPIForm({ ...customAPIForm, authType: e.target.value })} className="w-full p-2 border border-gray-300 rounded-md" required><option value="Bearer">Bearer Token</option><option value="Basic">Basic Auth</option><option value="ApiKey">API Key in Header</option><option value="None">No Auth</option></select></div>
            <div><Label htmlFor="headers-settings">Custom Headers (JSON format)</Label><Textarea id="headers-settings" value={customAPIForm.headers} onChange={(e) => setCustomAPIForm({ ...customAPIForm, headers: e.target.value })} className="font-mono text-sm min-h-20" required /></div>
            {testStatus && <ConnectionTestResults status={testStatus.status} message={testStatus.message} details={testStatus.details} timestamp={testStatus.timestamp} />}
            <div className="flex justify-end space-x-2 pt-4">
              <Button type="button" variant="outline" onClick={() => { setActiveModal(null); setTestStatus(null); setTestingStage(null); }}>Cancel</Button>
              {renderTestConnectionButton("customapi", { api_url: customAPIForm.apiUrl, api_key: customAPIForm.apiKey, auth_type: customAPIForm.authType, headers: customAPIForm.headers })}
              <Button type="submit">Save Changes</Button>
            </div>
          </div>
        </form>
      </ConfigModal>

      {(activeModal === "microsoft365_stats" || activeModal === "googleWorkspace_stats" || activeModal === "dropbox_stats" || activeModal === "slack_stats" || activeModal === "zoom_stats" || activeModal === "jira_stats" || activeModal === "customAPI_stats") && (
        <StatsModal isOpen={true} onClose={() => { setActiveModal(null); setActiveStats(null); }} title={activeModal.split("_")[0]} stats={activeStats} isLoading={isLoadingStats} />
      )}

      <ConnectionRequiredTooltip isOpen={showConnectionRequiredTooltip} onClose={() => setShowConnectionRequiredTooltip(false)} />
    </main>
  );
};

export default ConnectionPage;