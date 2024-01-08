import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function CipherLineGraph({ data, selectedCiphers }) {
    if (!data) data = [];
    if (!selectedCiphers) selectedCiphers = [];

    const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff7300", "#413ea0", "#a4de6c", "#d0ed57", "#ffc658", "#8884d8", "#82ca9d"];
    let colorIndex = 0;

    function formatDate(isoString) {
        const date = new Date(isoString);
        if (!isNaN(date.getTime())) { // Check if date is valid
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        }
        return isoString; // Return original string if date is invalid
    }

    const processedData = data.map(entry => {
        let obj = { date: formatDate(entry.collectionDate) };  // Use the correct key here
        entry.library.forEach(lib => {
            lib.Ciphers.forEach(cipher => {
                const cipherName = lib.LibraryName === 'openssl' ? `${cipher.CipherName}_${cipher.Type}_${cipher.MessageSize}` : cipher.CipherName;
                if (selectedCiphers.includes(cipherName)) {
                    obj[cipherName] = cipher.Value;
                }
            });
        });
        return obj;
    }).sort((a, b) => new Date(a.date) - new Date(b.date)); // Sorting by date

    return (
        <LineChart width={600} height={300} data={processedData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" angle={-45} textAnchor="end" interval={0} height={70} />
            <YAxis />
            <Tooltip />
            <Legend />
            {selectedCiphers.map(cipherName => (
                <Line type="monotone" dataKey={cipherName} stroke={colors[colorIndex++ % colors.length]} key={cipherName} />
            ))}
        </LineChart>
    );
}

export default CipherLineGraph;

