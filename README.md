# Bootstrap project NodeJs + typeorm + GraphQL(ApolloServer) & jwt auth

install packages:
`yarn`

setup

create a .env file with the secrets for jwt

```
JWT_SECRET=my_secret
JWT_REFRESH_SECRET=my_secret2
```

config db connection in ormconfig.json

start dev server
`yarn start`

start dev server with nodemon
`yarn dev`

# geaphQL Middlewares

isAuth: check authentication

isAdmin: check admin role

# db initialization

file in this path are loaded into db at init if destination tables are empty
`src/db/*.yml`
