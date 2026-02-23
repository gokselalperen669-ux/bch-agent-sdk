// DEPRECATED: We are moving to direct Supabase client in the frontend for a Serverless architecture on Vercel.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

export const getApiUrl = (endpoint: string) => {
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_BASE_URL}${formattedEndpoint}`;
};
