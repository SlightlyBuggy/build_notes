'use client'
import { useState, useEffect } from "react"

export default function ApiRouteTest() {

    const [data, setData] = useState([])
    const [isLoading, setLoading] = useState(true)

    useEffect(() => {
        fetch('/api/users')
            .then((res) => res.json())
            .then((data: any) => {
                setData(data)
                setLoading(false)
            })
    }, [])

    if (isLoading) return <p>Loading...</p>
    if(!data) return <p>No data</p>

    const listItems = data.map((item: any) => <div>{item.name}</div>)

    return (

        <div>
            {listItems}
        </div>
    )
    
}