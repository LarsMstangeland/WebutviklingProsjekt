# Food Junkies

## Setup database connections

The database connections should already set up in our config files. However these are `.gitignored` and will not show up if the repo is cloned from github. But they will be defined in this repo if you have gained access via, file sharing/zipping. The needed info will be in the server/config.ts file. You might also need to install bcryptjs and @types/bcryptjs to support hashing passwords. We decided to keep these node_module files to make it easier for configuration and usage. They are outside the the main repo.

`server/config.ts`:

```ts
process.env.MYSQL_HOST = "mysql.stud.ntnu.no";
process.env.MYSQL_USER = "larsmst_Prosjekt";
process.env.MYSQL_PASSWORD = "****";
process.env.MYSQL_DATABASE = "****";
```

`server/test/config.ts`:

```ts
process.env.MYSQL_HOST = "mysql.stud.ntnu.no";
process.env.MYSQL_USER = "larsmst_Prosjekt";
process.env.MYSQL_PASSWORD = "****";
process.env.MYSQL_DATABASE = "****";
```

These environment variables will be used in the `server/src/mysql-pool.ts` file.

## Start server

Install dependencies and start server:

```sh
cd server
npm install
npm start
```

### Run server tests:

- Note that you need to be present in the server folder

```sh
npm test
```

## Bundle client files to be served through server

Install dependencies and bundle client files:

```sh
cd client
npm install
npm start
```

### Run client tests:

- Note that you need to be present in the client folder
- Note that the test start is edited to support openhandles, ran into a circular json error, that gets handled by that flag

```sh
npm test
```
