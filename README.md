## NEST BACKEND SAMPLE PROJECT

required to install

- [NodeJS](https://nodejs.org/en/download/)
- [Docker](https://www.docker.com/products/docker-desktop)
- [Mongo Compass](https://www.mongodb.com/products/compass)
- [DBeaver for Postgresql](https://dbeaver.io/)
- [Postman](https://www.postman.com/downloads/)

configuration

create `.env` file from `.env-sample`

## Database installation in a Docker

**postgresql**

```cmd
docker run --name nest-postgres -e POSTGRES_PASSWORD=123 -d -p 5432:5432 postgres
```

**mongodb**

```cmd
docker run -d -p 27017:27017 --name nest-mongo \
      -e MONGO_INITDB_ROOT_USERNAME=admin \
      -e MONGO_INITDB_ROOT_PASSWORD=password \
      mongo
```

![docker](./docker.png)

**installation**

```
npm i
```

Run

```
npm start
npm run dev
```
