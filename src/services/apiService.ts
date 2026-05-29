// CivicTwin Hybrid API Service
// Connects to live Supabase Backend REST API + Gemini Edge Function, 
// or falls back to local Mock database if configuration keys are missing.

import { Report } from "@/context/AppContext";
import { MOCK_REPORTS } from "@/constants/mapHtml";

// Supabase Credentials
// Replace these with your project credentials to connect to a live backend!
export const SUPABASE_URL = ""; 
export const SUPABASE_ANON_KEY = "";

const isConfigured = SUPABASE_URL.trim() !== "" && SUPABASE_ANON_KEY.trim() !== "";

const getHeaders = (token?: string) => {
  return {
    "apikey": SUPABASE_ANON_KEY,
    "Authorization": token ? `Bearer ${token}` : `Bearer ${SUPABASE_ANON_KEY}`,
    "Content-Type": "application/json",
    "Prefer": "return=representation"
  };
};

export const apiService = {
  /**
   * 1. Fetch Bhopal Civic Reports
   */
  async getReports(): Promise<Report[]> {
    if (!isConfigured) {
      console.log("[CivicTwin API] Using local Mock reports database.");
      return MOCK_REPORTS;
    }

    try {
      // Fetch from the secure anonymous public_reports view (Reporter ID masked)
      const res = await fetch(`${SUPABASE_URL}/rest/v1/public_reports?select=*&order=created_at.desc`, {
        method: "GET",
        headers: getHeaders()
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      
      // Map database columns to app schema
      return data.map((r: any) => ({
        id: r.id,
        coordinates: [r.longitude, r.latitude],
        category: r.category,
        severity: r.severity,
        description: r.description,
        image: r.image_url,
        upvotes: r.upvotes,
        department: r.assigned_department,
        status: r.status,
        date: new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        aiReview: r.ai_description || r.ai_review || 'AI Diagnostics: Complete.',
        address: r.address || 'Bhopal City'
      }));
    } catch (error) {
      console.error("[CivicTwin API] Error fetching live reports, falling back to mock:", error);
      return MOCK_REPORTS;
    }
  },

  /**
   * 2. Submit a New Civic Report
   */
  async submitReport(
    report: {
      latitude: number;
      longitude: number;
      category: string;
      severity: number;
      description: string;
      imageUrl: string;
      department: string;
      aiReview?: string;
      address?: string;
    },
    reporterToken?: string
  ): Promise<any> {
    if (!isConfigured) {
      console.log("[CivicTwin API] Simulating local database submission.");
      const newReport = {
        id: `rep-${Date.now()}`,
        coordinates: [report.longitude, report.latitude],
        category: report.category,
        severity: report.severity,
        description: report.description,
        image: report.imageUrl,
        upvotes: 0,
        department: report.department,
        status: "Pending",
        date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        aiReview: report.aiReview || "AI Diagnostics: Processing submitted issue image.",
        address: report.address || "Near Bhopal Link Road, Bhopal"
      };
      MOCK_REPORTS.push(newReport as any);
      return { success: true, id: newReport.id };
    }

    try {
      const payload = {
        latitude: report.latitude,
        longitude: report.longitude,
        category: report.category,
        severity: report.severity,
        description: report.description,
        image_url: report.imageUrl,
        assigned_department: report.department,
        status: "Pending",
        ai_description: report.aiReview,
        address: report.address
      };

      const res = await fetch(`${SUPABASE_URL}/rest/v1/reports`, {
        method: "POST",
        headers: getHeaders(reporterToken),
        body: JSON.stringify(payload)
      });

      if (!res.ok) throw new Error(await res.text());
      const data = await res.json();
      return { success: true, data };
    } catch (error) {
      console.error("[CivicTwin API] Error submitting live report:", error);
      throw error;
    }
  },

  /**
   * 3. Run Gemini AI Diagnostics
   */
  async runGeminiAnalysis(
    base64Image: string,
    description: string
  ): Promise<{
    category: string;
    severity: number;
    description: string;
    department: string;
  }> {
    if (!isConfigured) {
      console.log("[CivicTwin API] Simulating local Gemini processing.");
      return new Promise((resolve) => {
        setTimeout(() => {
          const lowerText = description.toLowerCase();
          if (lowerText.includes('water') || lowerText.includes('sewage') || lowerText.includes('leak')) {
            resolve({
              category: 'Water',
              severity: 8,
              description: 'Visual evidence shows municipal water main leak flooding road. Secondary risk: local flooding.',
              department: 'Water Works Dept',
            });
          } else if (lowerText.includes('garbage') || lowerText.includes('smells') || lowerText.includes('dustbin')) {
            resolve({
              category: 'Sanitation',
              severity: 6,
              description: 'Overflowing community trash bin. Piles of organic garbage leaking onto footpaths.',
              department: 'Sanitation Dept',
            });
          } else if (lowerText.includes('electric') || lowerText.includes('wire') || lowerText.includes('light')) {
            resolve({
              category: 'Utility',
              severity: 9,
              description: 'Fallen live wire near public area. High probability of electric shock hazard.',
              department: 'MPEB (Electricity Board)',
            });
          } else {
            resolve({
              category: 'Roads',
              severity: 7,
              description: 'Deep road cavity (pothole) measuring ~15cm deep. High risk of two-wheeler accidents.',
              department: 'Municipal Corporation (PWD)',
            });
          }
        }, 1500);
      });
    }

    try {
      // Call Supabase Deno Edge Function
      const res = await fetch(`${SUPABASE_URL}/functions/v1/gemini-analysis`, {
        method: "POST",
        headers: getHeaders(),
        body: JSON.stringify({ image: base64Image, description })
      });

      if (!res.ok) throw new Error(await res.text());
      return await res.json();
    } catch (error) {
      console.error("[CivicTwin API] Gemini analysis error, using fallback logic:", error);
      throw error;
    }
  },

  /**
   * 4. Verify a Report (I See This Too / Upvote)
   */
  async verifyReport(reportId: string, userId?: string, userToken?: string): Promise<boolean> {
    if (!isConfigured) {
      console.log("[CivicTwin API] Local community upvote verified.");
      return true;
    }

    try {
      // 1. Increment report upvotes
      const upvoteRes = await fetch(`${SUPABASE_URL}/rest/v1/reports?id=eq.${reportId}`, {
        method: "PATCH",
        headers: getHeaders(userToken),
        body: JSON.stringify({ 
          // Increment is simulated via RPC or raw patch if value known
          upvotes: 1 
        })
      });

      if (!upvoteRes.ok) throw new Error(await upvoteRes.text());

      // 2. Award points to verifying user (+50 points) via secure RPC function
      if (userId) {
        await fetch(`${SUPABASE_URL}/rest/v1/rpc/increment_points`, {
          method: "POST",
          headers: getHeaders(userToken),
          body: JSON.stringify({ user_id: userId, points: 50 })
        });
      }

      return true;
    } catch (error) {
      console.error("[CivicTwin API] Error upvoting report:", error);
      return false;
    }
  },

  /**
   * 5. Update Profile
   */
  async updateProfile(userId: string, name: string, photoUrl: string, token?: string): Promise<boolean> {
    if (!isConfigured) return true;

    try {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
        method: "PATCH",
        headers: getHeaders(token),
        body: JSON.stringify({ user_name: name, profile_photo: photoUrl })
      });

      return res.ok;
    } catch (error) {
      console.error("[CivicTwin API] Profile update error:", error);
      return false;
    }
  }
};
