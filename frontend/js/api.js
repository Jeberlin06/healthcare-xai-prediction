const API_BASE_URL = 'http://127.0.0.1:8000';

/**
 * Send clinical metrics to the backend model endpoint
 * @param {string} diseaseType - 'diabetes', 'heart', or 'kidney'
 * @param {Object} payload - Input feature key-value pairs
 */
async function predictDiseaseRisk(diseaseType, payload) {
    try {
        const response = await fetch(`${API_BASE_URL}/api/predict/${diseaseType}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return await response.json();
    } catch (error) {
        console.error('Error submitting assessment:', error);
        throw error;
    }
}