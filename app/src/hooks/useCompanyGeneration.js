import { useReducer, useRef, useEffect, useCallback } from "react";

function generationReducer(state, action) {
  switch (action.type) {
    case "GENERATE_START":
      return { status: "loading", error: null };
    case "GENERATE_SUCCESS":
      return { status: "idle", error: null };
    case "GENERATE_ERROR":
      return { status: "error", error: action.payload };
    default:
      return state;
  }
}

// Encapsulates the /api/generate call: request state machine, AbortController
// lifecycle (aborts in-flight requests on unmount or re-trigger), and error
// normalization. The generated company is handed back via onGeneratedCompany
// so the caller decides where the list lives.
export default function useCompanyGeneration({ onGeneratedCompany }) {
  const [state, dispatch] = useReducer(generationReducer, {
    status: "idle",
    error: null,
  });
  const abortRef = useRef(null);

  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  const generate = useCallback(async () => {
    if (state.status === "loading") return;

    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    dispatch({ type: "GENERATE_START" });

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-forge-token": import.meta.env.VITE_FORGE_AUTH_TOKEN || "",
        },
        body: JSON.stringify({}),
        signal: controller.signal,
      });

      if (!response.ok) {
        throw new Error("Generation failed, try again.");
      }

      const company = await response.json();
      if (controller.signal.aborted) return;

      onGeneratedCompany(company);
      dispatch({ type: "GENERATE_SUCCESS" });
    } catch (err) {
      if (err.name === "AbortError") return;
      console.warn("[Forge] Company generation failed:", err);
      dispatch({
        type: "GENERATE_ERROR",
        payload: err.message || "Generation failed, try again.",
      });
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
      }
    }
  }, [state.status, onGeneratedCompany]);

  return { status: state.status, error: state.error, generate };
}
