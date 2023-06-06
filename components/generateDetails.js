const fs = require('fs')
const ua = require("user-agents")
const Accounts = require('../models/Accounts');
const genIp = () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');

const genPassword = (firstName, lastName) => `${firstName.slice(0, 2)}${lastName.slice(-2)}${Math.floor(Math.random() * 9000 + 1000)}`;

const genUserAgent = () => new ua().toString().replace(/\/[^/]* (?=[^ ]*$)/, `/${genIp()} `)

const generateRandomIps = count => Array.from({ length: count }, () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.')).join(', ')

let firstNames = ['Abdulahi', 'Adaeze', 'Adeola', 'Adesuwa', 'Ahmed', 'Aisha', 'Akpan', 'Amara', 'Anuoluwa', 'Ayomide', 'Bello', 'Chiamaka', 'Chioma', 'Chukwuemeka', 'Daniel', 'Ebere', 'Efe', 'Ego', 'Emeka', 'Esther', 'Folake', 'Funke', 'Ganiyu', 'Hassan', 'Ifunanya', 'Ikechukwu', 'Ireti', 'Isaiah', 'Jemima', 'Kehinde', 'Lanre', 'Mariam', 'Mojisola', 'Ngozi', 'Nkem', 'Obinna', 'Ogechi', 'Olumide', 'Onyinyechi', 'Osaze', 'Patience', 'Rashidat', 'Sadiq', 'Segun', 'Suleiman', 'Temitope', 'Uche', 'Uchenna', 'Ugochi', 'Victor', 'Yakubu', 'Yusuf', 'Zainab', 'Zara', 'Zeinab', 'Zainabu', 'Zainat', 'Zaraatu', 'Zulai', 'Zuleikha', 'Zuwaira', 'Zuwairatu', 'Zuwena', 'Adams', 'Agwu', 'Akpan', 'Aminu', 'Ayodele', 'Babatunde', 'Bello', 'Danjuma', 'Ekechukwu', 'Ekwuazi', 'Eze', 'Idowu', 'Ifeanyi', 'Igbo', 'Igwe', 'Ike', 'Ikeh', 'Ilozumba', 'Iwu', 'Kalu', 'Kwame', 'Lai', 'Lawani', 'Mbachu', 'Nwabueze', 'Nwadiogbu', 'Ogunlana', 'Ojo', 'Okagbue', 'Okoli', 'Okonkwo', 'Oladele', 'Olaleye', 'Olowu', 'Onuigbo', 'Onwuzurike', 'Opara', 'Ozoemena', 'Salami', 'Ugwu', 'Ukaegbu', 'Uzoma', 'Zakari', 'Zubair'];
let lastNames = ['Abdullahi', 'Adeniyi', 'Adeolu', 'Agbaje', 'Akindele', 'Amadi', 'Anikulapo', 'Balogun', 'Chukwuma', 'Duru', 'Egwu', 'Ejiofor', 'Eke', 'Ekwueme', 'Emeka', 'Ibe', 'Ibrahim', 'Idris', 'Igwe', 'Ijeoma', 'Ikechukwu', 'Ikenwa', 'Iloka', 'Jaja', 'Kalu', 'Lawal', 'Madu', 'Mbah', 'Nwachukwu', 'Nwadike', 'Nwosu', 'Obi', 'Odeyemi', 'Odum', 'Ogunbiyi', 'Okafor', 'Okoro', 'Okoye', 'Ola', 'Olawale', 'Olowo', 'Onu', 'Onwuka', 'Opara', 'Oti', 'Owolabi', 'Oyekanmi', 'Oyelade', 'Salisu', 'Uba', 'Ugwu', 'Uzoma', 'Yusuf', 'Zubairu', 'Adams', 'Agwu', 'Akpan', 'Aminu', 'Ayodele', 'Babatunde', 'Bello', 'Danjuma', 'Ekechukwu', 'Ekwuazi', 'Eze', 'Ibrahim', 'Idowu', 'Ifeanyi', 'Igbo', 'Igwe', 'Ike', 'Ikeh', 'Ilozumba', 'Iwu', 'Kalu', 'Kwame', 'Lai', 'Lawani', 'Mbachu', 'Nwabueze', 'Nwadiogbu', 'Nwosu', 'Ogunlana', 'Ojo', 'Okagbue', 'Okoli', 'Okonkwo', 'Oladele', 'Olaleye', 'Olowu', 'Onuigbo', 'Onwuzurike', 'Opara', 'Ozoemena', 'Salami', 'Ugwu', 'Ukaegbu', 'Uzoma', 'Yusuf', 'Zakari', 'Zubair'];

const genDetail = async () => {
    let firstName = firstNames[Math.floor(Math.random() * firstNames.length)]
    let lastName = lastNames[Math.floor(Math.random() * lastNames.length)]
    let user_name = `${firstName.toLowerCase()}${lastName.toLowerCase()}${Math.floor(Math.random() * 900) + 100}`

    const duplicate = await Accounts.findOne({user_name: user_name})
    if (duplicate){
        return genDetail()
    }

    return {
        user_name: user_name,
        password: genPassword(firstName, lastName)
    }
} 


module.exports = {
    genUserAgent: genUserAgent,
    genDetail: genDetail,
    generateRandomIps: generateRandomIps
}