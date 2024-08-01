const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();

if (process.env.NODE_ENV === 'development') {
  db.$on('query', (e) => {
    console.log(e.query);
    console.log(e.params);
  });
}

module.exports = db;