const variables = {
  Api: {
    port: process.env.port || 3001
  },
  Database: {
    connection: process.env.connection || 'mongodb://localhost:27017/cards'
  },
  Security: {
    secretKey: 'falousIF'
  }
}

export default variables
