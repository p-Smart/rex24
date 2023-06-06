const {POLONIEX_API_KEY, POLONIEX_SECRET_KEY} = process.env
const Accounts = require("../models/Accounts")
const Poloniex = require('poloniex-api-node')
const poloniex = new Poloniex({ apiKey: POLONIEX_API_KEY, apiSecret: POLONIEX_SECRET_KEY })
const axios = require('axios')


const storeDepositAddress = async (email, Accounts, poloniex, axios) => {
    // const content = JSON.stringify({currency: "TRX", blockchain: "TRX"})
    // const {data} = await axios.post(`https://sapi.poloniex.com/wallet/private/user/api/v1/deposit/address`, content,{
    //     headers: {
    //         "Polo-Fingerprint": 'c2e8770a57bb05f02fa99fc10237a5119cd9846f541dd4584604b76ae5a30ef53a8b04db874de335193addce89d42ea32157f8ed476c4d2a50a5e3f610f65139a99913111481b4f0bcb70e08e3e99405663d57242fe6defcf59d84bdbc754239',
    //         "Cookie": 'POLOSESSID=76134f582e874e47a743775ce0d94408; __zlcmid=1G9lraVYkjiCdlR',
    //         "Content-Type": 'application/json'
    //     }
    // })
    // const address = data?.data?.address

    const {address} = await poloniex.createNewCurrencyAddress({currency: 'TRX'})

    if(!address){
        return 'An error occurred'
    }

    const duplicate = await Accounts.findOne({address: address})
    if (duplicate){
        return 'An account has this address'
    }
    const response = await Accounts.updateOne({email: email}, {address: address})
    console.log('Successfully stored address for ', email)
    return response
}


const delay = {delay: 10}
const AddWithdrawalAddress = async (_, res) => {
    try{
        const account = await Accounts.findOne({ address: { $in: [null, "", undefined] } })
        if(!account){
            return res.json({
                error: {
                    message: 'All accounts have deposit addresses'
                }
            })
        }
        const {email} = account
        console.log('Adding address for ', email)


        const response = await storeDepositAddress(email, Accounts, poloniex, axios)

        res.json({
            success: true,
            response: response
        })
    }
    catch(err){
        try{
            res.status(500).json({
                error: {
                    message: err.response.data || err.message
                }
            })
        }
        catch{
            console.error(err.message)
        }
    }
    finally{

    }
}

module.exports = AddWithdrawalAddress