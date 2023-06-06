const Accounts = require("../models/Accounts")
const connToPuppeteer = require("../config/pupConnect")




const delay = {delay: 10}
const Login = async (_, res) => {
    const startOfToday = new Date().setUTCHours(4, 0, 0, 0)
    const endOfToday = new Date().setUTCHours(23, 59, 59, 999)
    try{
        const account = await Accounts.findOne({
            working: false,
            last_task_done: {
                $not: {
                    $gte: new Date(startOfToday),
                    $lt: new Date(endOfToday)
                }
            }
        })
        if(!account){
            return res.json({
                error: {
                    message: 'No accounts left'
                }
            })
        }

        var {email, password} = account
        console.log('Trying task for ', email)
        await Accounts.updateOne({email: email}, {working: true})


        var {browser, page} = await connToPuppeteer()

        await page.goto(`https://dior66.vip/#/login/index`)

        await Promise.all([
            page.waitForSelector(`input[placeholder="email"]`),
            page.waitForSelector(`input[placeholder="Login password"]`),
            page.waitForSelector(`div.btnOk.text-bold`),
        ])

        await page.type(`input[placeholder="email"]`, email, delay)
        await page.type(`input[placeholder="Login password"]`, password, delay)

        await page.click(`div.btnOk.text-bold`)

        await page.waitForSelector('.isShowPopup')

        await page.goto('https://dior66.vip/#/mission/index')

        await page.waitForSelector('.mission-box8 > .mission-card:nth-child(2) .toComplete')

        await page.click('.mission-box8 > .mission-card:nth-child(2) .toComplete')

        await page.waitForFunction(() => document.querySelector('.van-popup') !== null)
        await page.waitForFunction(() => {
            const element = document.querySelector('.van-popup')
            return window.getComputedStyle(element).display !== 'none'
        })
        await page.waitForFunction(() => {
            const element = document.querySelector('.van-popup')
            return window.getComputedStyle(element).display === 'none'
        })

        await page.goto('https://dior66.vip/#/myself/index')
        
        await page.goto('https://dior66.vip/#/myself/index')

        await page.waitForSelector('.totalInfo .numberInfo .number')

        const balance = await page.evaluate( () => document.querySelector('.totalInfo .numberInfo .number').textContent )

        await Accounts.updateOne({email: email}, {balance: balance, last_task_done: new Date()})

        console.log('Task Successful for ', email)




        res.json({
            success: true,
        })
    }
    catch(err){
        try{
            res.status(500).json({
                error: {
                    message: err.message
                }
            })
        }
        catch{
            console.error(err.message)
        }
    }
    finally{
        await page?.close()
        await browser?.close()
        const changeWorking = async () => {
            try{
                await Accounts.updateOne({email: email}, {working: false})
            }
            catch(err){
                await changeWorking()
            }
        }
        await changeWorking()
    }
}

module.exports = Login