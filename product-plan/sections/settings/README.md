# Settings

## Overview

The Settings page is a read-only configuration panel that displays ClawBoard's current environment variables grouped into logical sections. It shows connection status indicators for all external dependencies and provides a "Test Connection" action for the OpenRouter API key. Users edit values by modifying `.env.local` and restarting the app.

## User Flows

- View all current configuration values organized in grouped sections
- See the OpenRouter API key in a masked format
- Click "Test Connection" to verify the OpenRouter API key
- View connection status indicators for all dependencies
- Copy any configuration value to clipboard
- See an info banner explaining how to edit settings

## Design Decisions

- Info banner uses blue accent to be informative without being alarming
- Config values displayed in monospace for technical readability
- API key masked with only last 4 characters visible
- Connection status dots: green = connected, red = error, gray = unchecked
- "Recheck" button to refresh all connection statuses
- Single scrollable page with max-width container

## Data Shapes

**Entities:** ConfigEntry, ConfigSection, ConnectionStatus

## Components Provided

- `Settings` — Main settings page with info banner, config sections, and connection statuses
- `ConfigRow` — Single config entry row with label, value, copy button, and optional test button
- `ConnectionStatusList` — List of dependency health checks with status dots and details

## Callback Props

| Callback | Triggered When |
|----------|---------------|
| `onTestOpenRouterConnection` | User clicks "Test Connection" on the API key row |
| `onCopyValue` | User clicks copy button on any config value |
| `onRecheckStatuses` | User clicks "Recheck" to refresh connection statuses |
