import axios from 'axios';

const marketAPIKey = '';

const getMidPrice = async (itemID) => {
    const {data} = await axios.post(`https://market.csgo.com/api/ItemHistory/${itemID}/?key=${marketAPIKey}`);
    return data.average / 100;
}

const getMarketItems = async () => {
    try {
        const {data} = await axios.get(`https://market.csgo.com/ajax/i_popularity/all/all/all/1/56/0;1000/all/all/all?sd=desc`);
        return data[0];
    } catch (e) {
        console.log('Some error in market block');
    }

}

// https://free.currconv.com/api/v7/convert?q=USD_RUB&compact=ultra&apiKey=ec55a5efa0e734db4506
const getUSDCurrency = async () => {
    const {data} = await axios.get('https://openexchangerates.org/api/latest.json?app_id=df535d51c2bb45bc8c3fafb98784bee2&symbols=RUB');
    // return data.USD_RUB;
    return data.rates.RUB;
}

const getMoneyItem = async (itemName) => {
    const {data} = await axios.get(`https://inventories.cs.money/5.0/load_bots_inventory/730?buyBonus=30&isStore=true&limit=1&maxPrice=10000&minPrice=1&name=${itemName}&offset=0&order=asc&sort=price&withStack=true`);
    if (data?.error) {
        return data;
    }

    return data.items[0];
}

const compare = async () => {
    let marketItems = await getMarketItems();
    const USDCurrency = await getUSDCurrency();

    for (const marketItem of marketItems) {
        let name = marketItem[8];
        const price = marketItem[3];
        const classID = marketItem[0];
        const instanceID = marketItem[1];

        if ((!name.includes('Dragon King'))
            && (!name.includes('StatTrak'))
            && (!name.includes('Music Kit'))
            && (!name.includes('Case'))
            && (!name.includes('Gloves'))
            && (!name.includes('Knife'))
            && (!name.includes('Daggers'))) {

            const moneyItem = await getMoneyItem(name);

            if (moneyItem?.price) {
                const profit = Math.floor(((price * 0.95) * 0.95 - moneyItem.price * USDCurrency) * 100) / 100;

                if (profit >= 30) {
                    const midPrice = await getMidPrice(`${String(classID)}_${String(instanceID)}`);
                    console.log(
                        `${name}\n`,
                        `price: ${String(price)} ₽\n`,
                        `mid price: ${String(midPrice)} ₽\n`,
                        `profit: ${String(profit)} ₽\n`,
                        `market: https://market.csgo.com/item/${classID}-${instanceID}-${name.replace(/ /g, '+').replace('(', '%28').replace(')', '%29')} \n`,
                        `money: https://cs.money/ru/csgo/store/?search=${name.replace(/ /g, '+').split('(')[0]}&sort=price&order=asc \n`
                    );
                }
            }
        }
    }
};

compare();





