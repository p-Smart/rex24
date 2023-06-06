const pup = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')
pup.use(StealthPlugin())
const { generateRandomIps, genUserAgent } = require('../components/generateDetails')
const {BROWSERLESS_KEY, PUPPETEER_EXECUTABLE_PATH} = process.env


const defaultTimeout = 25000
const viewportWidth = 1500
const viewportHeight = 667
const connToPuppeteer = async () => {
    const ip = generateRandomIps(2)
    const userAgent = genUserAgent()
    // const browser = await pup.launch({
    //     headless: false,
    //     executablePath: PUPPETEER_EXECUTABLE_PATH,
    //     defaultViewport: { width: viewportWidth, height: viewportHeight },
    //     args: ['--no-sandbox', '--disable-setuid-sandbox'],
    // })

    const browser = await pup.connect({
        browserWSEndpoint: `wss://chrome.browserless.io?token=${BROWSERLESS_KEY}`,
        defaultViewport: { width: viewportWidth, height: viewportHeight },
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
    }, {timeout: 0})
    console.log('Connected to browser')

    const page = await browser.newPage()

    await page.setUserAgent(userAgent)
    await page.setDefaultTimeout(defaultTimeout)
    await page.setExtraHTTPHeaders({
        'X-Forwarded-For': ip,
    })
    await page.setRequestInterception(true);

    page.on('request', (request) => {
      if (request.resourceType() === 'image') {
        request.abort();
      } else {
        request.continue();
      }
    })



    return {
        browser: browser,
        page: page
    }
}


module.exports = connToPuppeteer