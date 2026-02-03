const API_BASE_URL = 'http://localhost:8000/api';

export const api = {
    uploadDataset: async (file: File) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch(`${API_BASE_URL}/datasets/`, {
            method: 'POST',
            body: formData,
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error || 'Upload failed');
        }

        return response.json();
    },

    getLatestStats: async () => {
        const response = await fetch(`${API_BASE_URL}/datasets/latest/`);
        if (!response.ok) {
            throw new Error('Failed to fetch stats');
        }
        return response.json();
    },

    getHistory: async () => {
        const response = await fetch(`${API_BASE_URL}/datasets/`);
        if (!response.ok) {
            throw new Error('Failed to fetch history');
        }
        return response.json();
    }
};
