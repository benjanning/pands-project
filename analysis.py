# Analysis Programme for the Iris Date Set

# Author: Ben Janning

# Import all the modules that we need.                                                                   
import numpy as np
import matplotlib.pyplot as plt
import pandas as pd                                                                 
import os
import seaborn as sns

# Open the CSV file using the Pandas module.
iris = pd.read_csv(r"iris.csv")                                                    
print(iris.head())                                                                  
print(iris.info())                                                                  
print(iris.shape)                                                                   
print(iris.describe())                                                              

# Output a summary of the Sepal Length Data, in the form of 
# Mean, Median, Min and Max
sepallength_stats = (iris["sepal.length"].mean(),                             
iris["sepal.length"].median(),                                                  
iris["sepal.length"].min(),                                                     
iris["sepal.length"].max())                                                     

print(sepallength_stats)

# Use the same process for the Sepal Width Data
sepalwidth_stats = (iris["sepal.width"].mean(),                              
iris["sepal.width"].median(),                                                  
iris["sepal.width"].min(),                                                     
iris["sepal.width"].max())                                                     

print(sepalwidth_stats)

# As well as the Petal Length Data 
petallength_stats = (iris["petal.length"].mean(),                             
iris["petal.length"].median(),                                                   
iris["petal.length"].min(),                                                      
iris["petal.length"].max())                                                     

print(petallength_stats)

# And the Petal Length Data
petalwidth_stats = (iris["petal.width"].mean(),                                
iris["petal.width"].median(),
iris["petal.width"].min(),
iris["petal.width"].max())

print(petalwidth_stats)

# Write all the Data to a new text file.
with open('summary.txt', 'w') as f:                                               
    f.write('Sepal Length: Mean, Median, Min and Max = ' + str(sepallength_stats))
    f.write('\n')                                                                 

with open('summary.txt', 'a') as f:                                               
    f.write('Sepal Width: Mean, Median, Min and Max = ' + str(sepalwidth_stats))
    f.write('\n')

with open('summary.txt', 'a') as f:                                               
    f.write('Petal Length: Mean, Median, Min and Max = ' + str(petallength_stats))   
    f.write('\n')

with open('summary.txt', 'a') as f:                                               
    f.write('Petal Width: Mean, Median, Min and Max = ' + str(petalwidth_stats))  
    f.write('\n')
    
# Printing Histograms for all the Data with MatPlotLib
iris.hist(column = "sepal.length")                                               
plt.savefig('sepallength.png')                                              
plt.show()

iris.hist(column = "sepal.width")
plt.savefig('sepalwidth.png') 
plt.show()

iris.hist(column = "petal.length")
plt.savefig('petallength.png') 
plt.show()

iris.hist(column = "petal.width")
plt.savefig('petalwidth.png') 
plt.show()

# Scatter Plots
sepalScatter= iris.plot.scatter(x='sepal.length', y='sepal.width', c='Purple')   
plt.show()

petalScatter= iris.plot.scatter(x='petal.length', y='petal.width', c='Orange')    
plt.show()


