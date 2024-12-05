import React from 'react'

export const Estados = () => {
    const [Artiuclos, setArticulos] = useState([]);
    const [ordenes, setOrdenes] = useState([]);
    
    const fetchArticulos = async () => {
        try {
            const response = await fetch(`http://localhost:3027/articulosAll`);
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            const data = await response.json();
            console.log("data", data);
            setArticulos(data);
        } catch (error) {
            console.error("There has been a problem with your fetch operation:", error);
        }
    };

    const fetchOrdenes = async () => {
        try {
            const response = await fetch(`http://localhost:3034/ordenesAll`);
            console.log("response", response)
            const data = await response.json();
            setOrdenes(data);
        } catch (error) {
            console.error('Error fetching ordenes:', error);
        }
    };


    useEffect(() => {
        fetchArticulos();
        fetchOrdenes();
    }, []);


    return (
        <div>Ventas</div>
    )
    
}
