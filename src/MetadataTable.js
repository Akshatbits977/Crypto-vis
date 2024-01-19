import React, { useState, useEffect } from 'react';
  
// ... (other imports)

function MetadataTable({ searchQuery }) {
    const [data, setData] = useState([]);

    useEffect(() => {
        // Fetch only the metadata field from the 'merged' collection on your server
        fetch('https://perfwsw3.aus.stglabs.ibm.com:3011/fetchCollectionData/merged?fields=metadata')
            .then((response) => response.json())
            .then((fetchedData) => setData(fetchedData));
    }, []);

    if (data.length === 0) return <p>Loading...</p>;

    // Assuming 'collectionDate' is a property of the 'metadata' object
    const headers = ["collectionDate", ...Object.keys(data[0].metadata)];

    const filteredData = data.filter(entry => 
        entry.metadata.collectionDate && entry.metadata.collectionDate.toLowerCase().includes(searchQuery.toLowerCase())
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
                        <td>{entry.metadata.collectionDate}</td>
                        {Object.keys(entry.metadata).map((key, idx) => (
                            // Exclude 'collectionDate' as it is already rendered separately
                            key !== 'collectionDate' && <td key={idx}>{entry.metadata[key]}</td>
                        ))}
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

export default MetadataTable;

