import useSWR from 'swr'

const useUsers = () => {
  const { data, error } = useSWR({ url: 'api/users' })

  return {
    users: data,
    isLoading: !data && !error,
    error,
  }
}

export default useUsers
