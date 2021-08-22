import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import OptionPriceCalculator from "../components/CalculatorForm"

import Container from '@material-ui/core/Container'

import profilePic from '../public/profile.jpg'
import ReactRoundedImage from "react-rounded-image";
import LinkedInIcon from '@material-ui/icons/LinkedIn';

import { Button, Grid, Link } from '@material-ui/core';

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

        <div className={styles.description}>
          <p>European options calculator using Black-Scholes and Monte-Carlo methods.
          Uses Yahoo Finance reference data for the selected ticker to calculate volatility and dividend yield.
          Computes Greeks and plots options diagrams.</p>
        </div>

        <div className={styles.grid}>
          <OptionPriceCalculator/>
        </div>
      </main>

      <br/>

      <footer className={styles.footer}>
        <div align="center">
        <Grid container>
          <Grid item xs={6} sm={6}>
            <ReactRoundedImage
              image="/profile.jpg"
              roundedColor="#2c3e50"
              imageWidth="150"
              imageHeight="150"
              roundedSize="13"
              borderRadius="70"
            />
          </Grid>
          <Grid item xs={6} sm={6}>
            <p>My name is <strong>Zhibek</strong>. Hope you found my calculator useful. I am a UCL MSc Financial Mathematics Graduate seeking a quant role, preferrably in London. </p>
            <br/>
            You can reach out to me on my  <a href="https://uk.linkedin.com/in/zhibek-bakhytzhanova-6aa727195" className={styles.linked_in}>LinkedIn <LinkedInIcon size="small"/></a>
          </Grid>

        </Grid>
        </div>
      </footer>
    </div>
  )
}
