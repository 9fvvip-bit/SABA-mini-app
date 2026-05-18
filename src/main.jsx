import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  render() {
    if (this.state.error) {
      return (
        <div style={{
          minHeight: "100vh",
          background: "#080d18",
          color: "#fff",
          padding: 20,
          fontFamily: "Arial, sans-serif"
        }}>
          <h2>SABA Mini App Error</h2>
          <p style={{ color: "#ff9eb0" }}>{String(this.state.error?.message || this.state.error)}</p>
          <p>Please refresh after updating the latest files.</p>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById("root")).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);
