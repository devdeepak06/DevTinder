# Notes
### Ep 1- Creating our express server
- Create a git repo
- Initialize the repo
- node_modules, package.json, package-lock.json
```
node_modules: This directory contains all the packages (or modules) that your project depends on. When you install packages using npm (Node Package Manager) or yarn, they get stored here. It's typically huge and not meant to be manually modified because it's automatically managed by npm or yarn.

package.json: This file is like a manifest for your project. It includes metadata about your project and lists the packages it depends on. It also defines scripts for tasks like running tests or starting your application. It's crucial for sharing your project with others because it specifies what dependencies are needed and allows others to replicate your environment easily.

package-lock.json: This file is generated automatically by npm. It keeps track of the exact versions of every package and its dependencies that were installed in node_modules. It ensures that subsequent installs are deterministic, meaning everyone working on the project installs the same versions of dependencies, minimizing compatibility issues.
```
- Install express
- Create a server
- Listen to port 7777
- Write request handler for /test, /hello
- Install nodemon and update scripts inside package.json
- What are dependencies
- What is the use of "-g" while npm Install
- Difference between caret  and tilde ( ^ vs ~ )
### Ep 2- Routing and Requesting handle
- Add .gitignore file to ignore the node_modules
- Create a remote repo on github
- Push all code to remote origin
- order of the routes metter a lot
- http protocols, methods
- Install Postman app and make a workspace/collection > test API call
- Write logic to handle GET, POST, PATCH, PUT DELETE API Calls and test them on Postman
- Explore routing and use of ?, +, (), * in the routes
- Use of regex in routes /a/, /.*fly$/, make custom regex
- Reading the query params in the routes => we can use req.query
- Reading the dynamic routes => we can use req.params
```
app.get('/users/:id', (req, res) => {
  const { id } = req.params; // Dynamic route parameter
  const { filter, sort } = req.query; // Query parameters
  res.send(`User ID: ${id}, Filter: ${filter}, Sort: ${sort}`);
});

// Response: User ID: 123, Filter: name, Sort: asc
```
### Ep 3- Middleware and error handeling
- Multiple route handlers
- next() function
- next function and errors along with res.send()
- app.use("/route", rH, [rH2, rH3], rH4, rH5);
- what is a middleware? Why do we need it?
- How express JS basically handles requests behind the scenes
- Difference between app.use and app.all
- Write a dummy auth middleware for admin
- Write a dummy auth middleware for all user routes, except /user/login
- Error Handling using app.use("/", (err, req, res, next) = {});

- Create a free cluster on MongoDB Atlas and connect to the cluster
- install mongoose and create a connection to the cluster
- call the connectDB function and connect to the database before starting the server on port 7777
- json vs js object
- Add the express.json() middleware to parse the incoming request body
- make your api to dynamically connect to the database
