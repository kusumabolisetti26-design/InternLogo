import axios from 'axios';
import { 
  User, StudentProfile, CompanyProfile, Internship, 
  FitScoreBreakdown, TrustAnalysis, Application, JourneyStep, SkillGapAnalysisData
} from '../types';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercept requests to attach Bearer JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('internlogo_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authService = {
  login: async (credentials: { email: string; password: string }) => {
    const res = await api.post('/auth/login', credentials);
    return res.data;
  },
  register: async (userData: any) => {
    const res = await api.post('/auth/register', userData);
    return res.data;
  },
  getMe: async (): Promise<User> => {
    const res = await api.get('/auth/me');
    return res.data;
  },
  forgotPassword: async (email: string) => {
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  }
};

export const studentService = {
  getProfile: async (): Promise<StudentProfile> => {
    const res = await api.get('/students/profile');
    return res.data;
  },
  updateProfile: async (data: any): Promise<StudentProfile> => {
    const res = await api.put('/students/profile', data);
    return res.data;
  },
  completeOnboarding: async (data: any) => {
    const res = await api.post('/students/onboarding', data);
    return res.data;
  }
};

export const internshipService = {
  list: async (params?: any): Promise<Internship[]> => {
    const res = await api.get('/internships', { params });
    return res.data;
  },
  getById: async (id: number): Promise<Internship> => {
    const res = await api.get(`/internships/${id}`);
    return res.data;
  },
  create: async (data: any): Promise<Internship> => {
    const res = await api.post('/internships', data);
    return res.data;
  },
  update: async (id: number, data: any): Promise<Internship> => {
    const res = await api.put(`/internships/${id}`, data);
    return res.data;
  },
  report: async (id: number, data: { reason: string; details?: string }) => {
    const res = await api.post(`/internships/${id}/report`, data);
    return res.data;
  }
};

export const matchingService = {
  getRecommendations: async (limit = 10): Promise<Array<{ internship: Internship; fit_score: number; breakdown: FitScoreBreakdown }>> => {
    const res = await api.get('/matching/recommendations', { params: { limit } });
    return res.data;
  },
  getFitBreakdown: async (internshipId: number): Promise<FitScoreBreakdown> => {
    const res = await api.get(`/matching/${internshipId}/fit`);
    return res.data;
  }
};

export const trustService = {
  getScan: async (internshipId: number): Promise<TrustAnalysis> => {
    const res = await api.get(`/trust/${internshipId}`);
    return res.data;
  }
};

export const skillGapService = {
  getAnalysis: async (): Promise<SkillGapAnalysisData> => {
    const res = await api.get('/skill-gap');
    return res.data;
  }
};

export const journeyService = {
  getSteps: async (): Promise<JourneyStep[]> => {
    const res = await api.get('/journey');
    return res.data;
  },
  toggleStep: async (stepId: number, is_completed: boolean): Promise<JourneyStep> => {
    const res = await api.put(`/journey/${stepId}`, { is_completed });
    return res.data;
  }
};

export const savedService = {
  list: async (): Promise<Internship[]> => {
    const res = await api.get('/saved');
    return res.data;
  },
  save: async (internshipId: number) => {
    const res = await api.post(`/saved/${internshipId}`);
    return res.data;
  },
  remove: async (internshipId: number) => {
    const res = await api.delete(`/saved/${internshipId}`);
    return res.data;
  }
};

export const applicationService = {
  list: async (): Promise<Application[]> => {
    const res = await api.get('/applications');
    return res.data;
  },
  apply: async (data: { internship_id: number; notes?: string }): Promise<Application> => {
    const res = await api.post('/applications', data);
    return res.data;
  },
  update: async (id: number, data: { status: string; notes?: string; interview_date?: string }): Promise<Application> => {
    const res = await api.put(`/applications/${id}`, data);
    return res.data;
  },
  delete: async (id: number) => {
    const res = await api.delete(`/applications/${id}`);
    return res.data;
  }
};

export const companyService = {
  getDashboard: async () => {
    const res = await api.get('/company/dashboard');
    return res.data;
  },
  getCandidates: async (internshipId: number) => {
    const res = await api.get(`/company/internships/${internshipId}/candidates`);
    return res.data;
  },
  updateCandidateStatus: async (applicationId: number, data: { status: string; notes?: string; interview_date?: string }) => {
    const res = await api.put(`/company/applications/${applicationId}/status`, data);
    return res.data;
  }
};

export const adminService = {
  getAnalytics: async () => {
    const res = await api.get('/admin/analytics');
    return res.data;
  },
  getInternships: async () => {
    const res = await api.get('/admin/internships');
    return res.data;
  },
  updateVerification: async (internshipId: number, data: { verification_status: string; trust_score?: number }) => {
    const res = await api.put(`/admin/internships/${internshipId}/verification`, data);
    return res.data;
  },
  getReports: async () => {
    const res = await api.get('/admin/reports');
    return res.data;
  },
  resolveReport: async (reportId: number, data: { status: string; flag_internship?: boolean }) => {
    const res = await api.put(`/admin/reports/${reportId}`, data);
    return res.data;
  }
};

export const assistantService = {
  chat: async (message: string, context_internship_id?: number) => {
    const res = await api.post('/assistant/chat', { message, context_internship_id });
    return res.data;
  }
};

export default api;
