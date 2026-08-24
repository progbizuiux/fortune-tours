import { useEffect, useState } from "react";

export function useExperiences() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchExperiences = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/experiences");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          setData(result.data);
        } else {
          throw new Error(result.message || "Failed to fetch experiences");
        }
      } catch (err) {
        console.error("Error fetching experiences:", err);
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchExperiences();
  }, []);

  return { data, loading, error };
}

/* Convenience hook for individual sections */
export function useJourneys() {
  const { data, loading, error } = useExperiences();
  return { journeys: data?.journeys, loading, error };
}

export function useJournal() {
  const { data, loading, error } = useExperiences();
  return { journal: data?.journal, loading, error };
}

export function useFeaturedDestinations() {
  const { data, loading, error } = useExperiences();
  return { featured: data?.featured, loading, error };
}

export function useDepartures() {
  const { data, loading, error } = useExperiences();
  return { departures: data?.departures, loading, error };
}
