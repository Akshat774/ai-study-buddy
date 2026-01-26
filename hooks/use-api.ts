"use client";

import { useCallback, useState } from "react";

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  [key: string]: any;
}

export function useApi<T = any>(
  endpoint: string,
  options: {
    onSuccess?: (data: T) => void;
    onError?: (error: string) => void;
  } = {},
) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<T | null>(null);

  const call = useCallback(
    async (body: Record<string, any>) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || `API Error: ${response.status}`);
        }

        if (result.success === false) {
          throw new Error(result.error || "API returned unsuccessful response");
        }

        setData(result.data || result);
        options.onSuccess?.(result.data || result);
        return result;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(errorMsg);
        options.onError?.(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [endpoint, options],
  );

  return { loading, error, data, call };
}

export function useGenerateStudyPlan() {
  const [plan, setPlan] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    async (params: {
      subject: string;
      exam: string;
      numDays: string;
      difficulty: string;
      topicsLength: string;
    }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/generate-study-plan", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to generate study plan");
        }

        setPlan(data.plan);
        return data.plan;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { plan, loading, error, generate };
}

export function useSolveDoubt() {
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const solve = useCallback(
    async (params: { question: string; subject: string; examType: string }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/solve-doubt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to solve doubt");
        }

        setAnswer(data.answer);
        return data.answer;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { answer, loading, error, solve };
}

export function useSummarizeNotes() {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const summarize = useCallback(
    async (params: { notes: string; subject: string; examType: string }) => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch("/api/summarize-notes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(params),
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.error || "Failed to summarize notes");
        }

        setSummary(data.summary);
        return data.summary;
      } catch (err) {
        const errorMsg = err instanceof Error ? err.message : String(err);
        setError(errorMsg);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  return { summary, loading, error, summarize };
}
