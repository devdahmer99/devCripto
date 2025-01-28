import { useState, FormEvent, useEffect } from 'react';
import styles from './home.module.css';
import { BsSearch } from 'react-icons/bs';
import { Link, useNavigate } from 'react-router-dom';

interface CoinProp {
    id: string;
    name: string;
    priceUsd: string;
    vwap24Hr: string;
    volumeUsd24Hr: string;
    changePercent24Hr: string;
    supply: string;
    marketCapUsd: string;
    maxSupply: string;
    rank: string;
    symbol: string;
    explorer: string;
    formatedPrice?: string;
    formatMarketCap?: string;
    formatVolume?: string;
}

interface DataProp {
    data: CoinProp[];

}

export default function Home() {
    const [input, setInput] = useState('');
    const navigate = useNavigate();
    const [coins, setCoins] = useState<CoinProp[]>([]);

    useEffect(() => {
        getData();
    }, [])

    async function getData() {
        fetch("https://api.coincap.io/v2/assets?limit=10&offset=0")
        .then(response => response.json())
        .then((data : DataProp) => {

            const coinsData = data.data;

            const price = Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD"
            })

            const priceCompact = Intl.NumberFormat("en-US", {
                style: "currency",
                currency: "USD",
                notation: "compact"
            })


            const formatedResult = coinsData.map((item) => {
                const formated = {
                    ...item,
                    formatedPrice: price.format(Number(item.priceUsd)),
                    formatMarketCap: priceCompact.format(Number(item.marketCapUsd)),
                    formatVolume: priceCompact.format(Number(item.volumeUsd24Hr)),
                }
                return formated;
            })
            setCoins(formatedResult)
        })
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        if(input == '') {
            return;
        }
        navigate(`/detail/${input}`);
    }

    function handleGetMore() {
        
    }

    return (
        <main className={styles.container}>
            <form className={styles.form} onSubmit={handleSubmit}>
                <input type="text" 
                placeholder='Digite o nome da moeda... ex: bitcoin'
                value={input} onChange={(e) => setInput(e.target.value)}/>
                <button type="submit">
                    <BsSearch size={30} color='#fff'/>
                </button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th scope="col">Moeda</th>
                        <th scope="col">Valor de Mercado</th>
                        <th scope="col">Preço</th>
                        <th scope="col">Volume</th>
                        <th scope="col">Mudança em 24h</th>
                    </tr>
                </thead>
                <tbody id="tbody">
                    {coins.length > 0 && coins.map((item) => (
                        <tr className={styles.tr} key={item.id}>
                              <td className={styles.tdlabel} data-label="Moeda">
                                <img className={styles.logoCoin}
                                src={`https://assets.coincap.io/assets/icons/${item.symbol.toLowerCase()}@2x.png`}  alt="icones das moedas"/>
                                  <div className={styles.name}>
                                      <Link to={`/detail/${item.id}`}>
                                          <span>{item.name}</span> | {item.symbol}
                                      </Link>
                                  </div>
                              </td>
                              <td className={styles.tdlabel} data-label="Valor de Mercado">
                                {item.formatMarketCap}
                              </td>
                              <td className={styles.tdlabel} data-label="Preço">
                                 {item.formatedPrice}
                              </td>
                              <td className={styles.tdlabel} data-label="Volume">
                                  {item.formatVolume}
                              </td>
                              <td className={Number(item.changePercent24Hr) > 0 ? styles.tdProfit : styles.tdLoss} data-label="Mudança em 24h">
                                  <span>{Number(item.changePercent24Hr).toFixed(2)}</span>
                              </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <button className={styles.buttonMore} onClick={handleGetMore}>Carregar mais</button>
        </main>
    )
}