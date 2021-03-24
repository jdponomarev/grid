import Head from 'next/head'
import styles from '../styles/Home.module.css'
import ReactPlayer from 'react-player'


export default function Home() {
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Welcome to my test task!<br/>
          Please <a href="/grid">follow the link</a>
        </h1>
        <ReactPlayer style={{marginTop:"20px"}} url='https://play.vidyard.com/4i8kEUXHwNxHnteAFodFc7' />
      </main>
    </div>
  )
}
