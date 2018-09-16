# Seed Corn Project

#### To start the application:

- Clone the repository

- Run '**npm install**'

- Run '**npm run seedcorn**'

#

#### Using the application:

###### Search Page:
- Enter the full URL of an app from the Google Play Store into search box and click search

- The app details will be displayed along with its associated reviews

- Click save to save the app and reviews

###### Display Page:
- The page will load with a list of saved app names

- Click an app to display its reviews

- The sentiment analysis can be run for each review by clicking its run button

- For now, the name of the app needs to be clicked again to refresh the sentiment scores

#

#### Please note:
- There are only up to 40 reviews returned per app as this is how many are displayed per page on the Play Store.

- Due to the sentiment analysis being an intensive process, the reviews have to conducted one by one so that the application doesn't run out of memory and crash.

- Both of these limitations will be looked into further depending on the requirements, but are not expected to be completely removed.

- The StanfordNlp.jar file cannot be added to GIT as it is a very large file (> 3GB), so will need to be manually [downloaded](https://drive.google.com/file/d/1XOFnwqoC5Bnq7D8yu_yU6tXtCRkYsI0_/view?usp=sharing) and added to the route directory.