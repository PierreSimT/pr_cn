from sklearn.linear_model import LinearRegression
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd

# Importing the dataset
dataset = pd.read_csv('/home/ptondreau/Documents/MASTER/cuat2/pr_cn/p2/datos.csv')
X = dataset.iloc[:, 1:2].values
y = dataset.iloc[:, 3].values

# Fitting Simple Linear Regression to data
regressor = LinearRegression()
regressor.fit(X, y)

# Predicting the Test set results
y_prediction = regressor.predict(X)

# Visualising the Training set results
plt.scatter(X, y, color='red')
plt.scatter(X, y_prediction, color='blue')
plt.plot(X, y_prediction, color='blue')
plt.title('N elementos vs MB / sec')
plt.xlabel('N elementos')
plt.ylabel('MB / sec')
plt.show()