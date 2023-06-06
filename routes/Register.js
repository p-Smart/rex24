const Accounts = require("../models/Accounts")
const { genDetail } = require("../components/generateDetails")
const connToPuppeteer = require("../config/pupConnect")
const {REF_URL} = process.env

const delay = {delay: 10}
const Register = async (_, res) => {
    
    try{
        var {browser, page} = await connToPuppeteer()
        
        const {user_name, password} = await genDetail()

        await page.goto(REF_URL)
        console.log('Gone to homepage page')

        await page.goto('https://rex24.store/reg/')
        console.log('Gone to register page')
        // console.log(await page.evaluate(() => document.body.textContent))

        await Promise.all([
            page.waitForFunction( () => document.querySelector(`input#login`) !== null ),
            page.waitForFunction( () => document.querySelector(`input#password_1`) !== null ),
            page.waitForFunction( () => document.querySelector(`input#password_2`) !== null ),
            page.waitForFunction( () => document.querySelector(`div.shape_button.text_2`) !== null ),
        ])
        console.log('Waited for inputs')

        await page.evaluate( (user_name, password) => {
            document.querySelector(`input#login`).value = user_name
            document.querySelector(`input#password_1`).value = password
            document.querySelector(`input#password_2`).value = password
            document.querySelector(`div.shape_button.text_2`).click()
        }, user_name, password )

        // await page.type(`input#login`, user_name, delay)

        // await page.type(`input#password_1`, password, delay)

        // await page.type(`input#password_2`, password, delay)
        console.log('Typed in all inputs')

        // await page.click(`div.shape_button.text_2`)

        const response = 
        await Promise.race([
            page.waitForFunction( () => document.querySelector(`#MsgError`).style.display !== 'none' )
            .then( () => 'Error' ),
            page.waitForFunction(() => document.querySelector(`.ft_profile_balance_1.ft_font_09`) !== null),
            page.waitForNavigation()
        ])
        
        if(response === 'Error'){
            console.log(await page.evaluate(() => document.querySelector(`#MsgError`).textContent))
            return res.json({
                error: {
                    message: 'Error registering...'
                }
            })
        }
        console.log('registered')

        await Accounts.create({
            user_name: user_name,
            password: password,
            reg_date: new Date(),
        })

        console.log('Done')

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
        console.log('Closed browser')
    }
}

module.exports = Register