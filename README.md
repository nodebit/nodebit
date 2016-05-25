# Node Business Intelligence Tools (Alpha)

NodeJS based framework for pulling, transforming and displaying data.

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
