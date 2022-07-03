const axios = require('axios');
const cheerio = require('cheerio');

const parse = async () => {
    const getHTML = async (url) => {
        const {data} = await axios.get(url);
        return cheerio.load(data);
    }

    // call first set curency

    // set cookie

    // call again and parse
    const page = await getHTML('https://market.csgo.com/en');
    let marketItems = [];

    page('.market-items[id="applications"]').find('a.item ').each((i, el) => {
        const name = page(el).find('div.name').text().trim();
        const price = Number(page(el).find('div.price').text().trim());
        if((!name.includes('Dragon King')) && (!name.includes('StatTrak'))) {
            marketItems.push({name: name, price: price})
        }
    })

    return marketItems
}

const getMoneyItem = async (itemName) => {
    const {data} = await axios.get(`https://inventories.cs.money/5.0/load_bots_inventory/730?buyBonus=30&isStore=true&limit=1&maxPrice=10000&minPrice=1&name=${itemName}&offset=0&order=asc&sort=price&withStack=true`);
    if(data?.error === 2) {return data}
    return data.items[0]
}

const compare = async () => {
    let marketItems = await parse();
    for(const item of marketItems) {
        const moneyItem = await getMoneyItem(item.name)
        if(moneyItem?.price) {
            const profit = Math.floor(((item.price*0.95)*0.95 - moneyItem.price) * 100) / 100
            if(profit >= 1) {
                console.log(item.name, profit)
            }
        }
    }
}

compare()


