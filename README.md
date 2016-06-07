# Node Business Intelligence Tools (Alpha)
NodeJS based framework for pulling, transforming and displaying data.

## Getting Started

The fastest way to get up and running is with docker

`docker run -d -p 1337:1337 nodebit/nodebit`

Next add a user with 

`curl localhost:1337/users -H "Content-Type: application/json" -X POST -d '{"email":"user@email.com", "password": "password"}' http://localhost:1337/auth/signup`

You should now be able to login at http://localhost:1337

## Using NodeBIT

The simplest way to get some data going is to use an external URL.

So click the +SOURCE button then select URL from the dropdown.

You should be able to throw in any CSV file with headers here's a sample that we like:
https://www.crowdflower.com/wp-content/uploads/2016/03/blockbuster-top_ten_movies_per_year_DFE.csv

Give that source a name of your choice and hit your browsers back button.

Next create a new dataset with this source by clicking +DATASET

The first text field on the left is for the name of the dataset. Choose a name and press save.
The next dropdown is for choosing a source. Select the source we just created and press save.

Now after a few seconds(http requests can take a little) you should see a table with some rows and columns.

Let's chart this data.

Jump over to the dropdown on the right and select chart (wait, a url reload needs to occur here). Then when the charting tools arrive choose one x axis and one y axis.

Now a chart has been created and your dataset is complete.

Now you can leave this chart by pressing your browsers back arrow.

Any datasets you create can be added to a dashboard.


## Currently supported:

### Sources:
- Postgres 
- SQL Server
- CSV URL

### Source Transformations:
- SQL

### Transformations:
- None

### Outputs:
- Plotly JS(Bar, Line, Scatter, Histogram)
- Statistic (label + value)

## Setup

### - Install dependencies
`npm install`

### Use python2 (recommended virtualenv) for setup of kerberos

### Start webpack-dev-server
`node .\node_modules\webpack-dev-server\bin\webpack-dev-server.js`

### Run mongo server in the background

### Start the Server
`npm start`

### Create an authenticated user
`curl localhost:1337/users curl -H "Content-Type: application/json" -X POST -d '{"email":"email@email.com", "password": "password"}' http://localhost:1337/auth/signup`
