'use strict'

const setupDatabase = require('./lib/db')
const setupAgentModel = require('./models/agent')
const setupMetricModel = require('./models/metric')
const defaults = require('defaults')

module.exports = async function (config) {
  config = defaults(config, {
    dialect: 'sqlite',
    pool: {
      max: 10,
      min: 0,
      idle: 1000
    },
    query: {
      raw: true
    }
  })

  const sequelize = setupDatabase(config)
  const AgentModel = setupAgentModel(config)
  const MetricModel = setupMetricModel(config)

  // establishing the relationshio between our dbs
  AgentModel.hasMany(MetricModel)
  MetricModel.belongsTo(AgentModel)

  // it queries the db to test the connection
  await sequelize.authenticate()

  // if we have a config.setup ready, we are gonna create a db forcing it. If there was a previous db it will be erased
  if (config.setup) {
    await sequelize.sync({force: true})
  }

  const Agent = {}
  const Metric = {}

  return {
    Agent,
    Metric
  }
}
