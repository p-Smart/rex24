const Accounts = require("../models/Accounts")
const connToPuppeteer = require("../config/pupConnect")




const delay = {delay: 10}
const PlaceWithdrawal = async (_, res) => {
    try{
        const account = await Accounts.findOne({
            working: false,
            withdrawn: false,
            address: { $nin: [null, "", undefined] }
            // balance: {$gte: 2}
        })
        if(!account){
            return res.json({
                error: {
                    message: 'No accounts left'
                }
            })
        }

        var {email, password, address, security_code, balance} = account
        console.log('Trying withdrawal for ', email)
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
        await page.waitForSelector('.isShowPopup .btn')
        await page.click('.isShowPopup .btn')

        await page.waitForSelector('.tools > :nth-child(2)')
        await page.evaluate(() => document.querySelector('.tools > :nth-child(2)').click())

        await page.waitForSelector('.van-toast')
        await page.waitForFunction(() => window.getComputedStyle(document.querySelector('.van-toast')).display !== 'none')

        await page.waitForFunction(() => window.getComputedStyle(document.querySelector('.van-toast')).display === 'none')

        await Promise.all([
            page.waitForSelector('.formInfo > :nth-child(6)'),
            page.waitForSelector('.formInfo > :nth-child(7)'),
            page.waitForSelector('.formInfo > :nth-child(8)'),
            page.waitForSelector('.formInfo > .btnOk')
        ])

        await page.type('input[placeholder="quota 2 - 99999"]', balance.toString(), delay)
        await page.type('textarea.input', address, delay)
        await page.type('input[type="password"]', security_code, delay)
        await page.click('.formInfo > .btnOk')

        await page.waitForFunction(() => window.getComputedStyle(document.querySelector('.van-toast')).display !== 'none')

        await page.waitForFunction(() => window.getComputedStyle(document.querySelector('.van-toast')).display === 'none')

        console.log(await page.evaluate( () => document.querySelector('.van-toast').textContent ))

        // await Accounts.updateOne({email: email}, {withdrawn: true})

        console.log('Withdrawal placed for ', email)




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
        // await page?.close()
        // await browser?.close()
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

module.exports = PlaceWithdrawal