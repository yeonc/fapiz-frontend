import useMe from 'hooks/useMe'

const withLogin = (Component: any) => {
  const { me } = useMe()
  const isLoggedIn = !!me

  return ({ ...props }) => isLoggedIn && <Component {...props} />
}

export default withLogin
