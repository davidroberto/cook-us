export const apiFetch = async <T>(
    url: string,
    token: string | null,
    options?: RequestInit,
): Promise<T> => {
    const res = await fetch(url, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
            ...options?.headers,
        },
    })
    if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error((err as { message?: string }).message ?? 'Erreur réseau')
    }
    return res.json() as Promise<T>
}
