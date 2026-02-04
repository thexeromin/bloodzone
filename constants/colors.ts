export const Colors = {
  // Brand identity
  primary: "#D32F2F", // Main Actions, Active Tabs, Primary Buttons (Medical Red)
  primaryDark: "#B71C1C", // Pressed states, Darker Headers
  primaryLight: "#FFEBEE", // Light red backgrounds (Tags, Badges, Selected Items)

  secondary: "#2196F3", // Secondary Actions, Info Links (Trust Blue)
  secondaryLight: "#E3F2FD", // Light blue backgrounds

  accent: "#FF5252", // Highlights, Notification dots, "Urgent" markers

  // Backgrounds & surfaces
  background: "#F4F6F9", // Main Screen Background (Soft Cool Grey)
  surface: "#FFFFFF", // Cards, Modals, Inputs, Bottom Sheets (Pure White)
  surfaceHighlight: "#F8FAFC", // Slightly highlighted surface (e.g., pressed list item)

  // Text & typography
  textMain: "#1E293B", // Headings, Primary Content (Dark Slate - softer than black)
  textSub: "#64748B", // Subtitles, Captions, Descriptions (Medium Slate)
  textMuted: "#94A3B8", // Placeholders, Disabled Text, very subtle details
  textInverse: "#FFFFFF", // Text on Primary/Dark Backgrounds

  // Borders & dividers
  border: "#E2E8F0", // Standard Borders (Cards, Inputs)
  borderFocus: "#CBD5E1", // Focused Input Border

  // Status indicators
  success: "#4CAF50", // Completed, Online, Eligible to Donate
  successBg: "#E8F5E9", // Green Backgrounds (Pills, Alerts)

  warning: "#FF9800", // Pending, Waiting, Recovery Mode
  warningBg: "#FFF3E0", // Orange Backgrounds

  error: "#EF5350", // Errors, Delete Actions, "Critical Urgency"
  errorBg: "#FEF2F2", // Red Backgrounds

  info: "#0288D1", // Information alerts
  infoBg: "#E1F5FE", // Blue Backgrounds

  // Special utils
  shadow: "#0F172A", // Shadow color for elevation (Dark Blue-Grey)
  overlay: "rgba(0,0,0,0.5)", // Modal backdrops

  // Gradients (for expo-linear-gradient)
  gradientPrimary: ["#D32F2F", "#EF5350"] as const,
  gradientDark: ["#475569", "#64748B"] as const
};
