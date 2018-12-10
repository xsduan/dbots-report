module.exports = {
  // type: bots[]|bots
  // bots that you want to watch
  bots: {
    // here is an example of a bot object. override it in a higher priority
    // file. see file priority and other such behavior at:
    // https://github.com/lorenwest/node-config/wiki/Configuration-Files

    // name of bot
    name: 'blank_bot',
    token: '000000000000000000000000.000000.000000000000000000000000000',
    url_args: { id: '000000000000000000' },
    // api endpoints on notifications. Same template format applies.
    apis: [
      {
        url: 'https://discord.bots.gg/api/v1/bots/000000000000000000/stats',
        // if token exists, it will assume that Authorization header is required
        token: '000000000000000000000000000000000000.00000000000000000000000000000000000000000000000000000000000000000000000000.000000000000000000000000000000000-000000000',
        // define if the authorization field should be named something other
        // than Authorization
        // auth_header: 'Authorization',
        // define if the post function should be anything other than
        // JSON.stringify
        // transform: raw(data => data),
      },
      { url: 'http://example.com' },
    ],
    // should we keep updates on data over time for personal analytics
    keep_data: true,
    // how often we should check. Any interval less than `persist_interval` will
    // have their client persisted to avoid frequent bootup costs, but any above
    // will be rebooted each time to avoid hogging connection slots and memory.
    interval: 3600000, // (1 hr)
  },

  // lack of a database file overrides all `keep_data` reports.
  db: 'dbot-report.sqlite',

  defaults: {
    keep_data: false,
    interval: 3600000, // (1 hr)
  },

  // below what interval should the client for a bot be persisted.
  persist_interval: 300000, // (5 min)
}
