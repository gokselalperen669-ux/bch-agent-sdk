export const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const getApiUrl = (endpoint: string) => {
    const formattedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${API_BASE_URL}${formattedEndpoint}`;
};
