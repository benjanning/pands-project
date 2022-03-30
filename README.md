# pands-project
The Pands-Project for the Programming and Scripting course

# What is the Iris Data Set?

One of the most popular datasets for machine learning, The Iris Dataset is made up three species of Iris Flowers and 50 samples of each species.

The species are: Setosa, Versicolor and Virginica.

For each sample there are four different measurements:  The length and width of the Sepals and the length and width of the Petals.  This makes it a multivariate dataset, meaning there are two or more variable quantities.

A Botanist named Edgar Anderson collected the original data, before a statistician named Ronald Fisher popularised the data when he used it in his work to demonstrate the use of statistics in classification.  Fisher's findings, which state that a species of Iris could be determined by the measurements of its Sepals and Petals also helps us classify newer iris flowers with the dataset.

Below are some of the key reasons explaining why the Iris Data remains so popular for data analysts:

Due to the null values present in the dataset and equal representation of each class, it is seen as fair and balanced.  Centimetres are used to measure each of the four features.  Classification is quite easy, as the setosa is seperable (linearly) from the other species.  The other two species have overlap in features, but are also distinguishable when looking at certain measurements.  For these reasons, the power of machine learning and prediction can be used effectively on this dataset.  


[01]

# Approach

I began researching the Iris Data Set and investigating how to analyse it by going through various websites and watching videos. Seeing how other people have approached the task in the past and comparing different methods was a good starting point for the project.

An exploratory data analysis approach seemed most popular with others and also most logical.  I opted for this, as well as combining it with some machine learning algorithms.  Modules such as Pandas, Matplotlib and Numpy were essential in visualising the data and drawing conclusions from there. 

# Research and Investigation of the Iris Data Set

I first downloaded the Iris Data CSV file, which was the key file used to investigate the relationship between the three species of flower. 

# Import the Modules

The first step in the Jupyter Notebook involved importing all the relevant modules, which were:

1) Pandas - For manipulating and analyzing the data. Often used fr CSV files, as well as SQL.
2) Numpy - For mathematical computation, as well as scientific tasks.
3) OS - For creating, removing directories.
4) Matplotlib - For plotting the data on graphs, showing the data on histograms, scatterplots etc.
5) Seaborn - For Data Visualisation, drawing attractive/better looking graphs.

# Load the Data Set

Now it was time to import the CSV file and display it using Pandas (pd for short).
I also wanted to look at some basic stats and info about the data, using dataframe (df).
I checking how many samples of each class there were, to ensure it was 50 each.

# Data Analysis

After doing research on methods of comparing and cross-referencing data sets, I found the pairplot function in Seaborn.  This visual representation gives a great overview of the data set as a whole. 

I then printed histogrmas of Petal Length and Width, as well as Sepal Length and Width.  

The scatter plot required definition of the colors, variety, defining the x and y labels and adding a legend.

# Coorelation Matrix

Afte researching methods of correlation and coeffecients between variables I decided to include a coorelation Matrix, which can be run with a simple bit of code: df.corr() 

It appears that a distinction exists between petal and sepal measurements so perhaps there is some internal consistency within them. 

Here we can see that:

(Petal length and width are very highly positively correlated (r = 0.96), which tells us that as one gets larger so does the other, indicating that petal length and width have a close relationship.
On the other hand, sepal measurements have a very weak relationship with one another (r = -0.12).
Both petal length and width have very strong positive correlations with sepal length (r = 0.87 and 0.82 respectively) indicating that as both get larger, so does sepal length.
Both petal length and width have fairly weak negative correlations with sepal width (r = -0.43 and -0.37 respectively) indicating there is not much of a relationship between these features.
These correlations tell us that sepal width is not moderately or highly correlated with any other measurement.

A heatmap was also used, as it could represent the data more visually.)

# Label Encoder

(Machine learning usually deals with datasets which contains multiple labels in one or more than one columns. These labels can be in the form of words or numbers. Label Encoding refers to converting the labels into numeric form so as to convert it into the machine-readable form.  This task was performed using Scikit-learn.)

# Model Training

After researching techniques for evaluating the performance of a machine learning algorithm, I opted for train test split, as it can be used for classification or regression problems and can be used for any supervised learning algorithm. [01]

I also opted for logistic regression, as it can be used to to predict the probability of a categorical dependent variable. [02]

I was now able to print a metric to get the overall performance of the algorithm.  [3]

The K-Nearest Neighbour (KNN) algorithm interprets the dataset as numpy arrays and builds a basic model using scikit-learn.  [04]

(KNN can be used for classification prediction models and so is fitting for the Iris Dataset. A KNN model is built with a dataset that contains input features and output labels and, when presented with new data, uses Euclidean Distance to measure the distance between the new data points and a certain number of established data points. The number of data points, called k, can be adjusted based on the size of the dataset. If the majority of established data points nearest the new data point match a particular label, the model will ascertain that the new data presented belongs to that label.)

The Decision Tree Classifier uses internal nodes which represent the features of a dataset, the branches represent the decision rules and each leaf node represents the outcome.














# Conclusion

Many interesting observations were made about the iris data set in this project while using exploratory data analysis.  The main observations were as follows:

The iris setosa is distinguishable (linearly) from the versicolor and the virginica.
It could be reliably predicted that the species of iris is setosa, if we were presented with measurements of short, narrow petals, but wide sepals.

Differentiating between species is more dependant on the petal measurements than the sepal measurements of an iris.

Looking at the data, the virginica irises are more likely to have wider and longer petals than the versicolor.
Distinguishing between these two species in sepal measurements is more difficult.

The KNN model used in the project is reliable at identifying the setosa species, but would find it more diffult to differentiate between the versicolor and virginica. There are other more advanced models which could improve on these predictions, but as we are only scratching the surface in this project.  Our aim is to give an overview of the iris dataset and show how it can be used in machine learning.

# References

[01] - https://stats.stackexchange.com/questions/74776/what-aspects-of-the-iris-data-set-make-it-so-successful-as-an-example-teaching#:~:text=The%20Iris%20dataset%20is%20deservedly,is%20small%20but%20not%20trivial.
[01] - https://machinelearningmastery.com/train-test-split-for-evaluating-machine-learning-algorithms/
[02] - https://towardsdatascience.com/building-a-logistic-regression-in-python-step-by-step-becd4d56c9c8
[03] - https://www.kaggle.com/getting-started/27261
[04] - https://towardsdatascience.com/machine-learning-basics-with-the-k-nearest-neighbors-algorithm-6a6e71d01761#:~:text=Summary-,The%20k%2Dnearest%20neighbors%20(KNN)%20algorithm%20is%20a%20simple,that%20data%20in%20use%20grows.




