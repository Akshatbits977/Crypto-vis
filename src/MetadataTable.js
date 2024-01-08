import React, { useState, useEffect } from 'react';

function MetadataTable({ searchQuery }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Fetch data from the 'merged' collection on your server
        fetch('https://perfwsw3.aus.stglabs.ibm.com:3011/fetchCollectionData/merged')
            .then((response) => response.json())
            .then((fetchedData) => setData(fetchedData));
    }, []);

    if (data.length === 0) return <p>Loading...</p>;

    const headers = ["collectionDate", ...Object.keys(data[0].metadata)];

    const filteredData = data.filter(entry => 
        entry.collectionDate.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <table>
            <thead>
                <tr>
                    {headers.map((header) => (
                        <th key={header}>{header}</th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {filteredData.map((entry, index) => (
                    <tr key={index}>
                        <td>{entry.collectionDate}</td>
                        {Object.values(entry.metadata).map((value, idx) => (
                            <td key={idx}>{value}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default MetadataTable;

