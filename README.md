# ELIA

## Description
ELIA is an e-commerce platform for the direct sale of high-quality olive oil to helpadults from central/northern Europe with a low to medium income but a high interest in a healthy diet and social and ecological responsibility to find and buy affordable, high-quality olive oil by leaving out intermediaries and buying directly from the producers paired with a positive social and ecological impact.

### Grid System

- https://react-bootstrap.github.io/layout/grid/

### CSS Extension

- https://sass-lang.com/guide

### Backend Authentication

- https://www.youtube.com/watch?v=F-sFp_AvHc8&ab_channel=freeCodeCamp.org

### Frontend Authentication

- https://www.digitalocean.com/community/tutorials/how-to-add-login-authentication-to-react-applications

## 3. Development

### Install packages

Run the following command in /backend as well as in /frontend:

```
npm install
```

### Preparing the database

Install and run a mongodb instance on your machine on port 27107. The database must be accessible via mongo://localhost:27017.
In order to use the application in a meaningsful way, an admin user must be created. This is not possible via the UI (on purpose). Either create a admin user directly in the database (this is discouraged because it requires manual salting and hashing of the password) or create one via a http-POST request to http://localhost:4200/api/admin with username and password in the body. For deploying the application in a production envrionment, this endpoint should be either removed or protected.

### Run Node.js Application with nodemon

Run inside the backend/src folder:

```
npx nodemon index.js
```

### Run React application

Run inside the frontend folder:

```
npm start
```

The application can now be used on localhost:3000

***
