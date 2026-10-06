document.addEventListener("DOMContentLoaded", () => {
    const diabetesForm = document.getElementById("diabetes-form");

    if (diabetesForm) {
        diabetesForm.addEventListener("submit", handleDiabetesSubmit);
    }
});

function handleDiabetesSubmit(event) {
    event.preventDefault();

    // 1. Extract values from form inputs
    const glucose = parseFloat(document.getElementById("glucose").value) || 0;
    const bp = parseFloat(document.getElementById("bp").value) || 0;
    const bmi = parseFloat(document.getElementById("bmi").value) || 0;
    const age = parseInt(document.getElementById("age").value, 10) || 0;
    const insulin = parseFloat(document.getElementById("insulin").value) || 0;
    const skin = parseFloat(document.getElementById("skin").value) || 0;
    const pregnancies = parseInt(document.getElementById("pregnancies").value, 10) || 0;
    const dpf = parseFloat(document.getElementById("dpf").value) || 0;

    // 2. Simple risk score logic
    let riskScore = 0;
    if (glucose > 140) riskScore += 35;
    else if (glucose > 100) riskScore += 15;

    if (bmi > 30) riskScore += 25;
    else if (bmi > 25) riskScore += 10;

    if (age > 45) riskScore += 15;
    if (dpf > 0.5) riskScore += 15;
    if (bp > 90) riskScore += 10;

    // Cap maximum risk score at 99%
    riskScore = Math.min(Math.round(riskScore), 99);

    // Determine Risk Level category
    let riskLevel = "Low Risk";
    if (riskScore >= 60) {
        riskLevel = "High Risk";
    } else if (riskScore >= 30) {
        riskLevel = "Moderate Risk";
    }

    // 3. Create Patient Record Object
    const newRecord = {
        id: "DIA-" + Date.now().toString().slice(-6),
        type: "Diabetes",
        date: new Date().toISOString(),
        riskScore: riskScore,
        riskLevel: riskLevel,
        metrics: {
            glucose,
            bp,
            bmi,
            age,
            insulin,
            skin,
            pregnancies,
            dpf
        }
    };

    // 4. Save to localStorage under patientRecords
    const existingRecords = JSON.parse(localStorage.getItem("patientRecords")) || [];
    existingRecords.unshift(newRecord); // Add new record to beginning of array
    localStorage.setItem("patientRecords", JSON.stringify(existingRecords));

    // Save latest assessment result for diagnosis-result.html page to render
    localStorage.setItem("latestResult", JSON.stringify(newRecord));

    // 5. Navigate to diagnosis result page
    window.location.href = "diagnosis-result.html";
}