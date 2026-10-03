import { createBrowserRouter } from "react-router";

import { Layout } from "./components/Layout";
import { ProtectedRoute } from "./components/ProtectedRoute";

import { LandingPage } from "./pages/LandingPage";
import { LoginPage } from "./pages/LoginPage";
import { DashboardPage } from "./pages/DashboardPage";
import { NewAnalysisPage } from "./pages/NewAnalysisPage";
import { ProcessingPage } from "./pages/ProcessingPage";
import { AnalysisResultsPage } from "./pages/AnalysisResultsPage";
import { HistoryPage } from "./pages/HistoryPage";
import { MarketInsightsPage } from "./pages/MarketInsightsPage";
import { LearningPage } from "./pages/LearningPage";
import { ProjectsPage } from "./pages/ProjectsPage";
import { SettingsPage } from "./pages/SettingsPage";

export const router = createBrowserRouter([
  // --------------------------------------------------
  // PUBLIC ROUTES
  // --------------------------------------------------

  {
    path: "/",
    Component: LandingPage,
  },

  {
    path: "/login",
    Component: LoginPage,
  },

  // --------------------------------------------------
  // PROTECTED ROUTES
  // --------------------------------------------------

  {
    Component: ProtectedRoute,
    children: [
      {
        Component: Layout,
        children: [
          {
            path: "/dashboard",
            Component: DashboardPage,
          },
          {
            path: "/analysis/new",
            Component: NewAnalysisPage,
          },
          {
            path: "/analysis/processing",
            Component: ProcessingPage,
          },
          {
            path: "/analysis/:id",
            Component: AnalysisResultsPage,
          },
          {
            path: "/history",
            Component: HistoryPage,
          },
          {
            path: "/learning",
            Component: LearningPage,
          },
          {
            path: "/projects",
            Component: ProjectsPage,
          },
          {
            path: "/market",
            Component: MarketInsightsPage,
          },
          {
            path: "/settings",
            Component: SettingsPage,
          },
        ],
      },
    ],
  },
]);