const EMAILJS_CONFIG = {
    SERVICE_ID: "YOUR_SERVICE_ID_HERE",
    TEMPLATE_ID: "YOUR_TEMPLATE_ID_HERE",
    PUBLIC_KEY: "YOUR_PUBLIC_KEY_HERE"
};
const API_BASE_URL = "https://healthcare-xai-prediction.onrender.com";
// Fetch patient records
fetch(`${API_BASE_URL}/patients`)
  .then(response => response.json())
  .then(data => console.log(data));

// Upload kidney prediction batch file
const formData = new FormData();
formData.append("file", fileInputElement.files[0]);

fetch(`${API_BASE_URL}/predict/batch/kidney`, {
  method: "POST",
  body: formData
})
  .then(response => response.json())
  .then(data => console.log("Prediction Results:", data));
