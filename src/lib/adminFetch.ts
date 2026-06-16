const TOKEN_KEY = 'adminToken'

export function adminFetch(url: string, init: RequestInit = {}): Promise<Response> {
  const token = localStorage.getItem(TOKEN_KEY)
  const { headers, ...rest } = init
  return fetch(url, {
    ...rest,
    headers: {
      ...(headers as Record<string, string>),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  })
}
