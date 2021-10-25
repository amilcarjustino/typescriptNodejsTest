## Typescript Interview Test

1. Install postgres & nodejs
2. Create the test database using the `./createdb.sh` script
3. Install the `npm_modules` for this project running `npm install`
4. Run `npm run test` to get the program running (modify the user and password if needed)
5. Examine the typescript code under `server.ts`

**All Steps Done**


## CHALLENGE:
**1. Improve the database calls to allow the program to be run any number of times (without complaining that the table already exists);**

Replaced in *server.ts*
`db.none('CREATE TABLE github_users (id BIGSERIAL, login TEXT, name TEXT, company TEXT)')`
with
`db.none('CREATE TABLE  IF NOT EXISTS github_users (id BIGSERIAL, login TEXT, name TEXT, company TEXT)')`