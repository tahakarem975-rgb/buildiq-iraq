// API functions for project management
import { supabase } from "@/integrations/supabase/client";

// Projects API
export async function createProject(data: {
  name: string;
  description?: string;
  client_id?: string;
  status?: string;
}) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("Not authenticated");
  
  const { data: project, error } = await supabase
    .from("projects")
    .insert({
      ...data,
      user_id: user.user.id,
      status: data.status || "active",
    })
    .select()
    .single();
  
  if (error) throw error;
  return project;
}

export async function getProjects() {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("Not authenticated");
  
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.user.id)
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return projects || [];
}

export async function getProject(projectId: string) {
  const { data: project, error } = await supabase
    .from("projects")
    .select("*")
    .eq("id", projectId)
    .single();
  
  if (error) throw error;
  return project;
}

export async function updateProject(
  projectId: string,
  data: { name?: string; description?: string; status?: string; is_favorite?: boolean }
) {
  const { data: project, error } = await supabase
    .from("projects")
    .update({ ...data, updated_at: new Date().toISOString() })
    .eq("id", projectId)
    .select()
    .single();
  
  if (error) throw error;
  return project;
}

export async function deleteProject(projectId: string) {
  const { error } = await supabase.from("projects").delete().eq("id", projectId);
  if (error) throw error;
}

// Calculations API
export async function saveCalculation(data: {
  type: string;
  inputs: Record<string, any>;
  results: Record<string, any>;
  total_cost?: number;
  title?: string;
  project_id?: string;
  notes?: string;
}) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("Not authenticated");
  
  const { data: calculation, error } = await supabase
    .from("calculations")
    .insert({
      ...data,
      user_id: user.user.id,
    })
    .select()
    .single();
  
  if (error) throw error;
  return calculation;
}

export async function getCalculations(projectId?: string) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("Not authenticated");
  
  let query = supabase
    .from("calculations")
    .select("*")
    .eq("user_id", user.user.id);
  
  if (projectId) {
    query = query.eq("project_id", projectId);
  }
  
  const { data: calculations, error } = await query.order("created_at", {
    ascending: false,
  });
  
  if (error) throw error;
  return calculations || [];
}

export async function getCalculation(calculationId: string) {
  const { data: calculation, error } = await supabase
    .from("calculations")
    .select("*")
    .eq("id", calculationId)
    .single();
  
  if (error) throw error;
  return calculation;
}

export async function updateCalculation(
  calculationId: string,
  data: {
    title?: string;
    notes?: string;
    is_favorite?: boolean;
    project_id?: string | null;
  }
) {
  const { data: calculation, error } = await supabase
    .from("calculations")
    .update({ ...data })
    .eq("id", calculationId)
    .select()
    .single();
  
  if (error) throw error;
  return calculation;
}

export async function deleteCalculation(calculationId: string) {
  const { error } = await supabase
    .from("calculations")
    .delete()
    .eq("id", calculationId);
  
  if (error) throw error;
}

// Favorites API
export async function toggleFavorite(
  favoriteType: "calculator" | "project",
  itemId: string
) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("Not authenticated");
  
  if (favoriteType === "calculator") {
    // Check if already favorited
    const { data: existing } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.user.id)
      .eq("calculator_type", itemId)
      .single();
    
    if (existing) {
      // Remove favorite
      const { error } = await supabase
        .from("favorites")
        .delete()
        .eq("id", existing.id);
      if (error) throw error;
      return { isFavorite: false };
    } else {
      // Add favorite
      const { error } = await supabase.from("favorites").insert({
        user_id: user.user.id,
        calculator_type: itemId,
      });
      if (error) throw error;
      return { isFavorite: true };
    }
  } else {
    // Toggle project favorite
    const { data: project, error: fetchError } = await supabase
      .from("projects")
      .select("is_favorite")
      .eq("id", itemId)
      .single();
    
    if (fetchError) throw fetchError;
    
    const { data: updated, error: updateError } = await supabase
      .from("projects")
      .update({ is_favorite: !project.is_favorite })
      .eq("id", itemId)
      .select()
      .single();
    
    if (updateError) throw updateError;
    return { isFavorite: updated.is_favorite };
  }
}

export async function getFavoriteCalculators() {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("Not authenticated");
  
  const { data: favorites, error } = await supabase
    .from("favorites")
    .select("calculator_type")
    .eq("user_id", user.user.id)
    .not("calculator_type", "is", null);
  
  if (error) throw error;
  return (favorites || []).map((f) => f.calculator_type || "");
}

export async function getFavoriteProjects() {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("Not authenticated");
  
  const { data: projects, error } = await supabase
    .from("projects")
    .select("*")
    .eq("user_id", user.user.id)
    .eq("is_favorite", true);
  
  if (error) throw error;
  return projects || [];
}

// PDF Reports API
export async function savePDFReport(data: {
  project_id?: string;
  calculation_id?: string;
  file_name: string;
  file_path?: string;
  file_size?: number;
}) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("Not authenticated");
  
  const { data: report, error } = await supabase
    .from("pdf_reports")
    .insert({
      ...data,
      user_id: user.user.id,
      status: "generated",
    })
    .select()
    .single();
  
  if (error) throw error;
  return report;
}

export async function getPDFReports(projectId?: string) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("Not authenticated");
  
  let query = supabase
    .from("pdf_reports")
    .select("*")
    .eq("user_id", user.user.id);
  
  if (projectId) {
    query = query.eq("project_id", projectId);
  }
  
  const { data: reports, error } = await query.order("generated_at", {
    ascending: false,
  });
  
  if (error) throw error;
  return reports || [];
}

export async function updatePDFReport(
  reportId: string,
  data: { status?: string; downloaded_at?: string }
) {
  const { data: report, error } = await supabase
    .from("pdf_reports")
    .update(data)
    .eq("id", reportId)
    .select()
    .single();
  
  if (error) throw error;
  return report;
}

export async function deletePDFReport(reportId: string) {
  const { error } = await supabase
    .from("pdf_reports")
    .delete()
    .eq("id", reportId);
  
  if (error) throw error;
}

// Analytics & Statistics API
export async function getUserStatistics() {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("Not authenticated");
  
  // Get total projects
  const { count: totalProjects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.user.id);
  
  // Get total calculations
  const { count: totalCalculations } = await supabase
    .from("calculations")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.user.id);
  
  // Get total favorite items
  const { count: favoriteCalculators } = await supabase
    .from("favorites")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.user.id)
    .not("calculator_type", "is", null);
  
  // Get favorite projects
  const { count: favoriteProjects } = await supabase
    .from("projects")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.user.id)
    .eq("is_favorite", true);
  
  // Get total PDF reports
  const { count: totalReports } = await supabase
    .from("pdf_reports")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.user.id);
  
  // Get downloaded reports
  const { count: downloadedReports } = await supabase
    .from("pdf_reports")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.user.id)
    .not("downloaded_at", "is", null);
  
  // Get calculations by type
  const { data: calcByType } = await supabase
    .from("calculations")
    .select("type")
    .eq("user_id", user.user.id);
  
  const calculationsByType: Record<string, number> = {};
  (calcByType || []).forEach((calc) => {
    calculationsByType[calc.type] = (calculationsByType[calc.type] || 0) + 1;
  });
  
  return {
    totalProjects: totalProjects || 0,
    totalCalculations: totalCalculations || 0,
    favoriteCalculators: favoriteCalculators || 0,
    favoriteProjects: favoriteProjects || 0,
    totalReports: totalReports || 0,
    downloadedReports: downloadedReports || 0,
    calculationsByType,
  };
}

export async function getRecentCalculations(limit = 10) {
  const { data: user } = await supabase.auth.getUser();
  if (!user.user) throw new Error("Not authenticated");
  
  const { data: calculations, error } = await supabase
    .from("calculations")
    .select("*")
    .eq("user_id", user.user.id)
    .order("created_at", { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return calculations || [];
}
