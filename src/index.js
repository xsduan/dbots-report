const c = require('config')
const Discord = require('discord.js')
const fetch = require('node-fetch')

const { resolveArray, deepEquals } = require('./util')

const defaultOpts = c.get('defaults')

function resolveApi({
  url,
  token,
  auth_header,
  transform = JSON.stringify,
}) {
  const headers = { 'Content-Type': 'application/json' }
  if (token) {
    headers[auth_header || 'Authorization'] = token
  }

  return async data => {
    console.log('notifying', url, 'with', data)

    const res = await fetch(url, {
      method: 'post',
      body: transform(data),
      headers,
    })

    const ostream = res.ok ? console.log : console.error
    ostream(`${url}:`, res.status, res.statusText, await res.text())
  }
}

async function createClient(token) {
  const client = new Discord.Client()
  await client.login(token)
  return client
}

class BotManager {
  constructor({ name, token, apis, ...opts }) {
    this.name = name
    this.token = token
    this.opts = { ...defaultOpts, ...opts }

    this.notifiers = this.resolveUrls(apis)
    this.client = null
  }

  resolveUrls(urls) {
    if (urls && urls.length) return resolveArray(urls).map(resolveApi)
    throw new TypeError(`No apis for bot ${this.name}.`)
  }

  async updateBotData(createClient, destroyClient = async () => {}) {
    try {
      const client = await createClient()
      const data = { guildCount: client.guilds.size }

      if (this.last && deepEquals(this.last.data, data)) {
        console.log('data not changed since', this.last.ts)
        return
      }
      this.last = { ts: new Date(), data }

      await Promise.all([
        ...this.notifiers.map(cb => cb(data)),
        destroyClient(client),
      ])
    } catch (e) {
      console.error(e)
    }
  }

  async start() {
    const { interval } = this.opts
    let updateCb
    if (interval <= c.get('persist_interval')) {
      this.client = await createClient(this.token)
      updateCb = async () => this.updateBotData(() => this.client)
    } else {
      updateCb = async () => {
        console.log(process.memoryUsage())
        this.updateBotData(
          async () => createClient(this.token),
          async client => client.destroy(),
        )
        console.log(process.memoryUsage())
      }
    }

    setInterval(updateCb, interval)

    console.log('executing first round...')
    return updateCb()
  }
}

(async function main() {
  try {
    const bots = resolveArray(c.get('bots')).map(b => new BotManager(b))
    await Promise.all(bots.map(b => b.start()))
    setInterval(() => console.error(process.memoryUsage()), 10000)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
})()
