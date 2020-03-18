from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_squared_error, r2_score
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd

# Importing the dataset
dataset = pd.read_csv('/home/ptondreau/Documents/pr_cn/p1/data.csv')
X = dataset.iloc[:, 1:2].values
y = dataset.iloc[:, 2].values

# Fitting Simple Linear Regression to data
regressor = LinearRegression()
regressor.fit(X, y)

# Predicting the Test set results
y_prediction = regressor.predict(X)

# Visualising the Training set results
plt.scatter(X, y, color='red')
plt.plot(X, y_prediction, color='blue')
plt.title('N elementos vs tiempo (sec)')
plt.xlabel('N elementos')
plt.ylabel('tiempo (sec)')
plt.show()

print('Coeficientes: \n', regressor.coef_)
# The mean squared error
print('Mean squared error: %s'
      % mean_squared_error(y, y_prediction))
# The coefficient of determination: 1 is perfect prediction
print('Coeficiente de determinacion: %s'
      % r2_score(y, y_prediction))
