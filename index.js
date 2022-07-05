const axios = require('axios');

const getMarketItems = async () => {
    const {data} = await axios.get('https://market.csgo.com/ajax/i_popularity/all/all/all/1/56/0;500000/all/all/all?sd=desc');
    return data[0];
}

const getUSDCurrency = async () => {
    const {data} = await axios.get('https://free.currconv.com/api/v7/convert?q=USD_RUB&compact=ultra&apiKey=ec55a5efa0e734db4506');
    return data.USD_RUB;
}

const getMoneyItem = async (itemName) => {
    const {data} = await axios.get(`https://inventories.cs.money/5.0/load_bots_inventory/730?buyBonus=30&isStore=true&limit=1&maxPrice=10000&minPrice=1&name=${itemName}&offset=0&order=asc&sort=price&withStack=true`);
    if(data?.error === 2) {return data}
    return data.items[0];
}

const compare = async () => {
    let marketItems = await getMarketItems();
    const USDCurrency = await getUSDCurrency();

    for(const marketItem of marketItems) {
        const name = marketItem[8];
        const price = marketItem[3];

        if ((!name.includes('Dragon King')) && (!name.includes('StatTrak'))) {
            const moneyItem = await getMoneyItem(name);

            if (moneyItem?.price) {
                const profit = Math.floor(((price * 0.95) * 0.95 - moneyItem.price * USDCurrency) * 100) / 100;
                if (profit >= 40) {
                    console.log(name, profit.toString()+" ₽");
                }
            }
        }
    }
}

compare()


