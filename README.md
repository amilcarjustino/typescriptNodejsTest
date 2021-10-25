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



**2. Improve the program to take a command line argument with the name of the github user;**

First, changed *package.json*, *scripts/test* file   
`"test": "node ./node_modules/ts-node/dist/bin.js server.ts" ` 
  to  
 `"test": "node ./node_modules/ts-node/dist/bin.js server.ts $1"`

Then added in *server.ts*   
`let login = 'gaearon';
if (process.argv[2]) {
  login = process.argv[2];
};` 

and created a new constant:  
`const uri = 'https://api.github.com/users/' + login;` 
to use further in 
`.then(() => request({
    uri: uri,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  }))`
  
  instead of       
  `.then(() => request({
  uri: 'https://api.github.com/users/gaearon',
  headers: {
        'User-Agent': 'Request-Promise'
    },
  json: true
}))`


**3. Add more fields (to the database and to the API calls;**

Decided to add the fields: (id, name, company, location).
Changed in *server.ts* file:
Added `.then(()=>db.none('ALTER TABLE github_users ADD COLUMN IF NOT EXISTS location TEXT'))` in promise chain.
and changed

`.then((data: GithubUsers) => db.one(
  'INSERT INTO github_users (login) VALUES ($[login]) RETURNING id', data)`
to
`.then((data: GithubUsers) => db.one(
      'INSERT INTO github_users (id, login, name, company, location) VALUES ($[id],$[login],$[name],$[company],$[location]) RETURNING id', data)`

**4. Don't allow duplicate users on the database;**

I want to make unique the *login* fields.
I added a code, to be used only once, because I cannot add a unique constraint, when I have duplicated entries in the table.
Si I drop github_users with `/* if (process.argv[3]) {
  db.none('DROP TABLE github_users').then((data)=>{console.info('Table github_users dropped');console.table(data)});
};  */` using a any second argument and then, I commented out this snippet, to have a working example, strating from the beggining, to be able to add a unique field *login*.
Still hasn't figured out a way, to avoid the message *"login_unique" already exists*

