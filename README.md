# pands-project
The Pands-Project for the Programming and Scripting course

# What is the Iris Data Set?

The Iris Dataset consists of 50 samples each of three different species of iris flower: setosa, versicolor and virginica. It contains four different measurements for each sample in centimetres - the length and width of sepals and petals - making it a multivariate dataset.

The data was collected by botanist Edgar Anderson in the Gaspé Peninsula and popularised when it was used by biologist and statistician Ronald Fisher in his 1936 paper The Use of Multiple Measurements in Taxonomic Problems to demonstrate how statistics can be used for classification. He argues that, based on some significant attribute differences between the species in this dataset, iris group membership could potentially be determined by sepal and petal measurements alone - a method that would become known as linear discriminant analysis. From here it is postulated that new iris flowers could be classified based on the statistical information gleaned from the dataset.

The Iris Dataset remains a popular example as an introduction to exploratory data analysis, pattern recognition, and machine learning algorithms for the following reasons (Brownlee, 2016):

It is a complete, balanced dataset in that there are no null values and each class is equally represented.
Each of the four features (sepal and petal length and width) are measured in the same units (centimetres).
One iris species (setosa) is linearly separable from the other two. While the other species have some overlap, they are still largely distinguishable from one another in certain measurements. Thus, classification is relatively easy and, by extension, the predictive capability of the data is quite strong.

# Approach

# Research and Investigation of the Iris Data Set

I began researching the Iris Data Set and investingating how to analyse it by going through various websites and watching videos. Seeing how other people have approached the task in the past and comparing different methods was a good starting point for the project.

I then donaloaded the Iris Data CSV file, which was the key file used to investigate the relationship between the three species of flower. 

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

Afte researching methods of correlation and coeffecients between variables I decided to include a coorelation Matrix, which can be run with a simple bit of code - df.corr() 

It appears that a distinction exists between petal and sepal measurements so perhaps there is some internal consistency within them. 

Here we can see that:

Petal length and width are very highly positively correlated (r = 0.96), which tells us that as one gets larger so does the other, indicating that petal length and width have a close relationship.
On the other hand, sepal measurements have a very weak relationship with one another (r = -0.12).
Both petal length and width have very strong positive correlations with sepal length (r = 0.87 and 0.82 respectively) indicating that as both get larger, so does sepal length.
Both petal length and width have fairly weak negative correlations with sepal width (r = -0.43 and -0.37 respectively) indicating there is not much of a relationship between these features.
These correlations tell us that sepal width is not moderately or highly correlated with any other measurement.

A heatmap was also used, as it could represent the data more visually.

# Label Encoder

Machine learning usually deals with datasets which contains multiple labels in one or more than one columns. These labels can be in the form of words or numbers. Label Encoding refers to converting the labels into numeric form so as to convert it into the machine-readable form.  This task was performed using Scikit-learn.

# Model Training

After researching techniques for evaluating the performance of a machine learning algorithm, I opted for train test split, as it can be used for classification or regression problems and can be used for any supervised learning algorithm. [01]

I also opted for logistic regression, as it can be used to to predict the probability of a categorical dependent variable. [02]

I was now able to print a metric to get the overall performance of the algorithm.  [3]

The K-Nearest Neighbour (KNN) algorithm interprets the dataset as numpy arrays and builds a basic model using scikit-learn.  

The Decision Tree Classifier uses internal nodes which represent the features of a dataset, the branches represent the decision rules and each leaf node represents the outcome.














# Findings

# Conclusion

# References

[01] - https://machinelearningmastery.com/train-test-split-for-evaluating-machine-learning-algorithms/
[02] - https://towardsdatascience.com/building-a-logistic-regression-in-python-step-by-step-becd4d56c9c8
[03] - https://www.kaggle.com/getting-started/27261
[04] - [9] https://towardsdatascience.com/machine-learning-basics-with-the-k-nearest-neighbors-algorithm-6a6e71d01761#:~:text=Summary-,The%20k%2Dnearest%20neighbors%20(KNN)%20algorithm%20is%20a%20simple,that%20data%20in%20use%20grows.




