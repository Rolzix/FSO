import React from "react";

interface AppBarTabProps {
  label: string;
  active?: boolean;
}

const AppBarTab: React.FC<AppBarTabProps> = ({ label, active }) => {
  return <div className={`app-bar-tab ${active ? "active" : ""}`}>{label}</div>;
};

export default AppBarTab;
