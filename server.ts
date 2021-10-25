const pgPromise = require('pg-promise');
const R = require('ramda');
const request = require('request-promise');

let login = 'gaearon';
if (process.argv[2]) {
  login = process.argv[2];
};

const uri = 'https://api.github.com/users/' + login;

// Limit the amount of debugging of SQL expressions
const trimLogsSize: number = 200;

// Database interface
interface DBOptions {
    host: string
    , database: string
  , user?: string
  , password?: string
  , port?: number
};

// Actual database options
const options: DBOptions = {
  // user: ,
  // password: ,
  host: 'localhost',
  database: 'lovelystay_test',
};

console.info('Connecting to the database:',
  `${options.user}@${options.host}:${options.port}/${options.database}`);

console.info(`Getting user data of ${login} from console.log(${uri})`);


const pgpDefaultConfig = {
  promiseLib: require('bluebird'),
  // Log all querys
  query(query) {
    console.log('[SQL   ]', R.take(trimLogsSize, query.query));
  },
  // On error, please show me the SQL
  error(err, e) {
    if (e.query) {
      console.error('[SQL   ]', R.take(trimLogsSize, e.query), err);
    }
  }
};

interface GithubUsers {
    id: number,
  login: string,
  name: string,
  company: string,
  location: string
};

const pgp = pgPromise(pgpDefaultConfig);
const db = pgp(options);

// **  Helper to drop the table, if a third argument exists
/* if (process.argv[3]) {
  db.none('DROP TABLE github_users').then((data)=>{console.info('Table github_users dropped');console.table(data)});
};  */

db.none('CREATE TABLE  IF NOT EXISTS github_users (id BIGSERIAL, login TEXT, name TEXT, company TEXT)')
  .then(() => db.none('ALTER TABLE github_users ADD COLUMN IF NOT EXISTS location TEXT'))
  .then(() => db.none('ALTER TABLE github_users ADD CONSTRAINT login_unique UNIQUE (login)'))
  .then(() => request({
    uri: uri,
    headers: {
      'User-Agent': 'Request-Promise'
    },
    json: true
  }))
  .then((data: GithubUsers) => db.one(
    'INSERT INTO github_users (id, login, name, company, location) VALUES ($[id],$[login],$[name],$[company],$[location]) RETURNING id', data)
  ).then(({ id }) => console.log(id))
  .then(() => process.exit(0));
