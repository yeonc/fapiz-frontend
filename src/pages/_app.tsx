import PropTypes from 'prop-types'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import { CacheProvider, EmotionCache } from '@emotion/react'
import GlobalContainer from 'components/layouts/containers/globalContainer'
import globalResetStyles from 'styles/globalResetStyles'
import globalFullHeightStyles from 'styles/globalFullHeightStyles'
import theme from 'theme'
import createEmotionCache from 'createEmotionCache'
import { SWRConfig } from 'swr'
import swrFetcher from 'services/fetcher/swrFetcher'
import { AuthProvider } from 'context/AuthContext'

// Client-side cache, shared for the whole session of the user in the browser.
const clientSideEmotionCache = createEmotionCache()

interface MyAppProps extends AppProps {
  emotionCache?: EmotionCache
}

export default function MyApp(props: MyAppProps) {
  const { Component, emotionCache = clientSideEmotionCache, pageProps } = props

  return (
    <CacheProvider value={emotionCache}>
      <Head>
        <meta name="viewport" content="initial-scale=1, width=device-width" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {globalResetStyles}
        {globalFullHeightStyles}
        <SWRConfig
          value={{
            fetcher: swrFetcher,
          }}
        >
          <GlobalContainer>
            <AuthProvider>
              <Component {...pageProps} />
            </AuthProvider>
          </GlobalContainer>
        </SWRConfig>
      </ThemeProvider>
    </CacheProvider>
  )
}

MyApp.propTypes = {
  Component: PropTypes.elementType.isRequired,
  emotionCache: PropTypes.object,
  pageProps: PropTypes.object.isRequired,
}
