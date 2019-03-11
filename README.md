# StockAIWebApp
StockAI Web Application



### Installation

  

requires

  

1)[Node.js](https://nodejs.org/) v8+ to run.

  

2)Install the following on your own

->MySql


3)npm install -g @angular/cli

  

### Development

`Frontend Angular 6`

  

`Development`

  

git clone https://github.com/nela-it/StockAIWebApp.git

  

```sh

cd StockAIWebApp/aiStock

npm install

npm start

```

  

Navigate to http://localhost:4200/. The app will automatically reload if you change any of the source files.

  

`Producation`

  

```sh

cd StockAIWebApp/aiStock

npm install

npm run build-prod

```

It will be show dist folder.

  

You can do that using `http-server.`

  

First install the package globally

```sh

npm install http-server -g

```

  

Then inside your project directory(in the terminal) just run

```sh

http-server dist/

or

cd dist/ && http-server

```

  
  

-----------------------------------------------------

`Backend nodeJs`

Config database credential in folder
config->dbConfig.js
 

Install the dependencies and devDependencies and start the server.

  

```sh

cd StockAIWebApp/API

npm install

npm run dev

```

 
  

