require('dotenv').config()
const express = require('express')
const app = express()
const KeepAppAlive = require('./routes/KeepAppAlive')
const connectToDB = require('./config/dbConnect')
const Register = require('./routes/Register')
const connToPuppeteer = require('./config/pupConnect')

connectToDB()


app.use(express.urlencoded({ extended: true }))


app.get('/', KeepAppAlive)

app.get('/register', Register)


app.get('/test', async (_, res) => {
  try{
    var {browser, page} = await connToPuppeteer()
    await page.goto('https://example.com/')
    const response = await page.evaluate( () => document.body.textContent )


    res.json({
      success: true,
      response: response
    });
  }
  catch(err){
    res.json({
      error: {
        message: err.message
      }
    });
  }
  finally{
    await page?.close
    await browser?.close
  }
})






















app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
})
  
  app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
      error: {
        message: `You're lost, man!`
      }
    });
    next()
})



app.listen(process.env.PORT || 3000, () => console.log(`Server running...`))

