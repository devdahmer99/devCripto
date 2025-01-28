
import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { CoinProp } from "../home/home"
import styles from "./detail.module.css"


interface responseData {
    data: CoinProp
}

interface erroData {
    error: string;
}

type dataProps = responseData | erroData;

export default function Detail() {
const { cripto } = useParams();
const [coin, setCoin] = useState<CoinProp>();
const [loading, setLoading] = useState(true);
const navigate = useNavigate();

useEffect(() => {
    async function getCoin() {
        try {
            fetch(`https://api.coincap.io/v2/assets/${cripto}`)
            .then(response => response.json())
            .then((data: dataProps) => {
                if("error" in data) {
                    navigate("/");
                    return;
                }

                const price = Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD"
                })
    
                const priceCompact = Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    notation: "compact"
                })

                const resultData = {
                    ...data.data,
                    formatedPrice: price.format(Number(data.data.priceUsd)),
                    formatMarketCap: priceCompact.format(Number(data.data.marketCapUsd)),
                    formatVolume: priceCompact.format(Number(data.data.volumeUsd24Hr)),
                }

                setCoin(resultData);
                setLoading(false);
            });
        } catch(err) {
            console.log(err)
            navigate("/");
        }
    }

    getCoin();
},[cripto])

    if(loading) {
        return (
            <div className={styles.container}>
                <h4 className={styles.center}>Carregando detalhes da moeda...</h4>
            </div>
        )
    }

    return (
       <div className={styles.container}>
            <h1 className={styles.center}>{coin?.name}</h1>
            <h1 className={styles.center}>{coin?.symbol}</h1>
            <section className={styles.content}>
                <img className={styles.logo}
                    src={`https://assets.coincap.io/assets/icons/${coin?.symbol.toLowerCase()}@2x.png`}
                    alt="logo da moeda"
                />
                <h1>{coin?.name} | {coin?.symbol}</h1>

                <p><strong>Preço: </strong> {coin?.formatedPrice}</p>

                <a>
                    <strong>Mercado: </strong> {coin?.formatMarketCap}
                </a>

                <a>
                    <strong>Volume: </strong> {coin?.formatVolume}
                </a>

                <a>
                    <strong>Mudança em 24h: </strong>
                    <span className={Number(coin?.changePercent24Hr) > 0 ? styles.tdProfit : styles.tdLoss}>{Number(coin?.changePercent24Hr).toFixed(2)}%</span>
                </a>
            </section>
       </div>
    )
}