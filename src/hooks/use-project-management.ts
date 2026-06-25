// Custom hooks for project management
import { useEffect, useState } from "react";
import {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getCalculations,
  getCalculation,
  saveCalculation,
  updateCalculation,
  deleteCalculation,
  toggleFavorite,
  getFavoriteCalculators,
  getFavoriteProjects,
  getPDFReports,
  savePDFReport,
  updatePDFReport,
  deletePDFReport,
  getUserStatistics,
  getRecentCalculations,
} from "@/lib/api/project-management";

// Projects Hook
export function useProjects() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getProjects();
        setProjects(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load projects");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return {
    projects,
    loading,
    error,
    createProject: async (data: any) => {
      const project = await createProject(data);
      setProjects([project, ...projects]);
      return project;
    },
    updateProject: async (id: string, data: any) => {
      const project = await updateProject(id, data);
      setProjects(projects.map((p) => (p.id === id ? project : p)));
      return project;
    },
    deleteProject: async (id: string) => {
      await deleteProject(id);
      setProjects(projects.filter((p) => p.id !== id));
    },
  };
}

// Calculations Hook
export function useCalculations(projectId?: string) {
  const [calculations, setCalculations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getCalculations(projectId);
        setCalculations(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load calculations");
      } finally {
        setLoading(false);
      }
    })();
  }, [projectId]);

  return {
    calculations,
    loading,
    error,
    saveCalculation: async (data: any) => {
      const calculation = await saveCalculation(data);
      setCalculations([calculation, ...calculations]);
      return calculation;
    },
    updateCalculation: async (id: string, data: any) => {
      const calculation = await updateCalculation(id, data);
      setCalculations(calculations.map((c) => (c.id === id ? calculation : c)));
      return calculation;
    },
    deleteCalculation: async (id: string) => {
      await deleteCalculation(id);
      setCalculations(calculations.filter((c) => c.id !== id));
    },
  };
}

// Favorites Hook
export function useFavorites() {
  const [favoriteCalculators, setFavoriteCalculators] = useState<string[]>([]);
  const [favoriteProjects, setFavoriteProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const [calcs, projects] = await Promise.all([
          getFavoriteCalculators(),
          getFavoriteProjects(),
        ]);
        setFavoriteCalculators(calcs);
        setFavoriteProjects(projects);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load favorites");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return {
    favoriteCalculators,
    favoriteProjects,
    loading,
    error,
    toggleFavorite: async (type: "calculator" | "project", id: string) => {
      const result = await toggleFavorite(type, id);
      if (type === "calculator") {
        if (result.isFavorite) {
          setFavoriteCalculators([...favoriteCalculators, id]);
        } else {
          setFavoriteCalculators(favoriteCalculators.filter((c) => c !== id));
        }
      }
      return result;
    },
  };
}

// PDF Reports Hook
export function usePDFReports(projectId?: string) {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getPDFReports(projectId);
        setReports(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load reports");
      } finally {
        setLoading(false);
      }
    })();
  }, [projectId]);

  return {
    reports,
    loading,
    error,
    savePDFReport: async (data: any) => {
      const report = await savePDFReport(data);
      setReports([report, ...reports]);
      return report;
    },
    updatePDFReport: async (id: string, data: any) => {
      const report = await updatePDFReport(id, data);
      setReports(reports.map((r) => (r.id === id ? report : r)));
      return report;
    },
    deletePDFReport: async (id: string) => {
      await deletePDFReport(id);
      setReports(reports.filter((r) => r.id !== id));
    },
  };
}

// Statistics Hook
export function useUserStatistics() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getUserStatistics();
        setStats(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load statistics");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return {
    stats,
    loading,
    error,
  };
}

// Recent Calculations Hook
export function useRecentCalculations(limit = 10) {
  const [calculations, setCalculations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getRecentCalculations(limit);
        setCalculations(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load calculations");
      } finally {
        setLoading(false);
      }
    })();
  }, [limit]);

  return {
    calculations,
    loading,
    error,
  };
}
