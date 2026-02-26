import { useEffect, useState } from 'react'

export const App = () => {
    const [appName, setAppName] = useState<string | null>(null)

    useEffect(() => {
        const fetchAppName = async () => {
            const response = await fetch('/api/home/app-name')
            const data = await response.json()
            setAppName(data.name)
        }
        fetchAppName()
    }, [])

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <h1>{appName ?? 'Loading...'}</h1>
        </div>
    )
}
