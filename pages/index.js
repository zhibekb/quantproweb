import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import OptionPriceCalculator from "../components/CalculatorForm"


import Container from '@material-ui/core/Container'

export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>QuantPro Option Price Calculator</title>
        <meta name="description" content="European Options Price Calculator using Black-Scholes and Monte Carlo. Quant Analyst in London. Zhibek Bakhytzhanova." />
        <link rel="icon" href="/favicon.ico" />
      </Head>


      <main className={styles.main}>
        <h1 className={styles.title}>
          Options Price Calculator
        </h1>

        <div className={styles.grid}>
          <OptionPriceCalculator/>
        </div>
      </main>

      <br/>

      <footer className={styles.footer}>
        <div align="center">
          Created By <strong>Zhibek Bakhytzhanova</strong>
        </div>
      </footer>
    </div>
  )
}
