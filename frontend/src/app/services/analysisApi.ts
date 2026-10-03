import type {
  AnalysisHistoryItem,
  AnalysisResult,
} from "../types/analysis";
import { getToken, logout } from "../lib/auth";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000/api";

/* -------------------------------------------------
   CENTRAL API ERROR HANDLING
   ------------------------------------------------- */

async function getApiErrorMessage(
  response: Response,
  fallbackMessage: string,
): Promise<string> {
  if (response.status === 401) {
    logout();

    if (window.location.pathname !== "/login") {
      window.location.href = "/login";
    }

    return "Your session has expired. Please log in again.";
  }

  if (response.status === 403) {
    return "You do not have permission to perform this action.";
  }

  if (response.status === 404) {
    return "The requested analysis could not be found.";
  }

  if (response.status === 413) {
    return "The uploaded file is too large. Maximum file size is 5 MB.";
  }

  if (response.status === 415) {
    return "Only PDF files are accepted.";
  }

  if (response.status >= 500) {
    return "The server is temporarily unavailable. Please try again.";
  }

  try {
    const body = await response.json();

    if (typeof body.detail === "string") {
      return body.detail;
    }
  } catch {
    // Keep the safe fallback message.
  }

  return fallbackMessage;
}

function getNetworkErrorMessage(error: unknown): string {
  if (error instanceof TypeError) {
    return "Unable to connect to the server. Please check your connection and try again.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return "Something went wrong. Please try again.";
}

/* -------------------------------------------------
   CREATE NEW ANALYSIS
   ------------------------------------------------- */

export async function createAnalysis(
  file: File,
  targetRole: string,
): Promise<AnalysisResult> {
  const token = getToken();

  if (!token) {
    throw new Error("You must be logged in to analyze a resume.");
  }

  const formData = new FormData();

  formData.append("file", file);
  formData.append("target_role", targetRole);

  let response: Response;

  try {
    response = await fetch(`${API_BASE_URL}/analysis`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });
  } catch (error) {
    throw new Error(getNetworkErrorMessage(error));
  }

  if (!response.ok) {
    const message = await getApiErrorMessage(
      response,
      "Unable to analyze the resume.",
    );

    throw new Error(message);
  }

  try {
    return await response.json();
  } catch {
    throw new Error(
      "The analysis was completed, but the server returned an invalid response.",
    );
  }
}

/* -------------------------------------------------
   GET EXISTING ANALYSIS
   ------------------------------------------------- */

export async function getAnalysis(
  analysisId: string,
): Promise<AnalysisResult> {
  const token = getToken();

  if (!token) {
    throw new Error("You must be logged in to view this analysis.");
  }

  let response: Response;

  try {
    response = await fetch(
      `${API_BASE_URL}/analysis/${analysisId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } catch (error) {
    throw new Error(getNetworkErrorMessage(error));
  }

  if (!response.ok) {
    const message = await getApiErrorMessage(
      response,
      "Unable to load the analysis.",
    );

    throw new Error(message);
  }

  try {
    return await response.json();
  } catch {
    throw new Error(
      "The server returned an invalid analysis response.",
    );
  }
}

/* -------------------------------------------------
   GET AUTHENTICATED USER ANALYSIS HISTORY
   ------------------------------------------------- */

export async function getAnalysisHistory(): Promise<
  AnalysisHistoryItem[]
> {
  const token = getToken();

  if (!token) {
    throw new Error("You must be logged in to view analysis history.");
  }

  let response: Response;

  try {
    response = await fetch(
      `${API_BASE_URL}/analysis/history`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
  } catch (error) {
    throw new Error(getNetworkErrorMessage(error));
  }

  if (!response.ok) {
    const message = await getApiErrorMessage(
      response,
      "Unable to load analysis history.",
    );

    throw new Error(message);
  }

  try {
    return await response.json();
  } catch {
    throw new Error(
      "The server returned an invalid analysis history response.",
    );
  }
}