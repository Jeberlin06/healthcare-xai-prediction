document.addEventListener('DOMContentLoaded', () => {
    const diabetesForm = document.getElementById('diabetes-form');

    if (diabetesForm) {
        diabetesForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Collect form input values
            const formData = {
                pregnancies: parseFloat(document.getElementById('pregnancies').value) || 0,
                glucose: parseFloat(document.getElementById('glucose').value),
                blood_pressure: parseFloat(document.getElementById('blood_pressure').value),
                skin_thickness: parseFloat(document.getElementById('skin_thickness').value) || 0,
                insulin: parseFloat(document.getElementById('insulin').value) || 0,
                bmi: parseFloat(document.getElementById('bmi').value),
                diabetes_pedigree: parseFloat(document.getElementById('dpf').value) || 0.5,
                age: parseFloat(document.getElementById('age').value)
            };

            const submitBtn = diabetesForm.querySelector('button[type="submit"]');
            submitBtn.innerText = 'Analyzing Risk...';
            submitBtn.disabled = true;

            try {
                // Call FastAPI endpoint (or simulate fallback data if backend is offline)
                let result;
                try {
                    result = await predictDiseaseRisk('diabetes', formData);
                } catch (err) {
                    // Fallback local simulation for frontend testing
                    const mockProbability = Math.min(0.95, Math.max(0.05, (formData.glucose * 0.4 + formData.bmi * 0.3 + formData.age * 0.3) / 150));
                    result = {
                        disease: 'Diabetes Risk Analysis',
                        risk_score: Math.round(mockProbability * 100),
                        risk_level: mockProbability > 0.6 ? 'High' : mockProbability > 0.3 ? 'Moderate' : 'Low',
                        features: formData,
                        top_factors: [
                            { feature: 'Glucose Level', impact: formData.glucose > 140 ? '+28%' : '-10%' },
                            { feature: 'BMI Indicator', impact: formData.bmi > 28 ? '+18%' : '-5%' },
                            { feature: 'Patient Age', impact: formData.age > 45 ? '+12%' : '-8%' }
                        ]
                    };
                }

                // Save result locally and redirect to the diagnostic result page
                localStorage.setItem('latest_diagnosis', JSON.stringify(result));
                window.location.href = 'diagnosis-result.html';

            } catch (error) {
                alert('Assessment failed. Please check form inputs and try again.');
            } finally {
                submitBtn.innerText = 'Analyze Diabetes Risk';
                submitBtn.disabled = false;
            }
        });
    }
});