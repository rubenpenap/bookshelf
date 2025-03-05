import {useQuery} from 'react-query'
import {client} from 'utils/api-client'

function useListItems(user) {
  const result = useQuery({
    queryKey: 'list-items',
    queryFn: () =>
      client(`list-items`, {token: user.token}).then(data => data.listItems),
  })
  return {...result, listItems: result.data ?? []}
}

function useListItem(user, bookId) {
  const {listItems} = useListItems(user)
  return listItems?.find(li => li.bookId === bookId) ?? null
}

export {useListItems, useListItem}
