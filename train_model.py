import pandas as pd
import numpy as np

# Generate 100 days of synthetic Kochi weather data
np.random.seed(42)
clouds = np.random.randint(0, 100, 100)
temp = np.random.randint(24, 35, 100)

# ECE Formula: Efficiency drops as clouds increase and temp goes too high
# Efficiency = 1.0 - (clouds * 0.007) - ((temp-25) * 0.01) + noise
efficiency = 1.0 - (clouds * 0.007) - ((temp - 25) * 0.01) + np.random.normal(0, 0.02, 100)
efficiency = np.clip(efficiency, 0.1, 0.98)

df = pd.DataFrame({'clouds': clouds, 'temp': temp, 'efficiency': efficiency})
df.to_csv('solar_training_data.csv', index=False)
print("✅ Training dataset 'solar_training_data.csv' created!")