import pandas as pd
import numpy as np
import pickle
from xgboost import XGBClassifier
from sklearn.model_selection import train_test_split

# --- 1. Diabetes Model ---
diabetes_df = pd.DataFrame({
    'Pregnancies': np.random.randint(0, 10, 500),
    'Glucose': np.random.randint(70, 200, 500),
    'BloodPressure': np.random.randint(60, 120, 500),
    'SkinThickness': np.random.randint(10, 50, 500),
    'Insulin': np.random.randint(15, 250, 500),
    'BMI': np.random.uniform(18.5, 45.0, 500),
    'DiabetesPedigreeFunction': np.random.uniform(0.08, 2.4, 500),
    'Age': np.random.randint(21, 80, 500),
    'Outcome': np.random.randint(0, 2, 500)
})

X_d = diabetes_df.drop('Outcome', axis=1)
y_d = diabetes_df['Outcome']
model_d = XGBClassifier(use_label_encoder=False, eval_metric='logloss')
model_d.fit(X_d, y_d)

with open('model_diabetes.pkl', 'wb') as f:
    pickle.dump(model_d, f)

# --- 2. Heart Disease Model ---
heart_df = pd.DataFrame({
    'age': np.random.randint(29, 77, 500),
    'sex': np.random.randint(0, 2, 500),
    'cp': np.random.randint(0, 4, 500),
    'trestbps': np.random.randint(94, 200, 500),
    'chol': np.random.randint(126, 564, 500),
    'fbs': np.random.randint(0, 2, 500),
    'restecg': np.random.randint(0, 3, 500),
    'thalach': np.random.randint(71, 202, 500),
    'exang': np.random.randint(0, 2, 500),
    'oldpeak': np.random.uniform(0.0, 6.2, 500),
    'target': np.random.randint(0, 2, 500)
})

X_h = heart_df.drop('target', axis=1)
y_h = heart_df['target']
model_h = XGBClassifier(use_label_encoder=False, eval_metric='logloss')
model_h.fit(X_h, y_h)

with open('model_heart.pkl', 'wb') as f:
    pickle.dump(model_h, f)

# --- 3. Kidney Disease Model ---
kidney_df = pd.DataFrame({
    'age': np.random.randint(20, 80, 500),
    'bp': np.random.randint(50, 120, 500),
    'sg': np.random.uniform(1.005, 1.025, 500),
    'al': np.random.randint(0, 5, 500),
    'su': np.random.randint(0, 5, 500),
    'bgr': np.random.randint(70, 490, 500),
    'bu': np.random.randint(10, 391, 500),
    'sc': np.random.uniform(0.4, 15.0, 500),
    'classification': np.random.randint(0, 2, 500)
})

X_k = kidney_df.drop('classification', axis=1)
y_k = kidney_df['classification']
model_k = XGBClassifier(use_label_encoder=False, eval_metric='logloss')
model_k.fit(X_k, y_k)

with open('model_kidney.pkl', 'wb') as f:
    pickle.dump(model_k, f)

print("All disease models trained and saved successfully!")