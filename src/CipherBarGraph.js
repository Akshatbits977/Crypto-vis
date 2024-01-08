import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

function CipherBarGraph({ data, selectedCiphers }) {
    if (!data) data = [];
    if (!selectedCiphers) selectedCiphers = [];

    const generateRandomColor = () => `#${Math.floor(Math.random()*16777215).toString(16)}`;

    const generateColors = (count) => {
        const colors = [];
        for (let i = 0; i < count; i++) {
            colors.push(generateRandomColor());
        }
        return colors;
    };

    const colors = generateColors(selectedCiphers.length);
    
    function formatDate(isoString) {
        const date = new Date(isoString);
        if (!isNaN(date.getTime())) {
            return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
        }
        return isoString;
    }

    const processedData = data.map(entry => {
        let obj = { date: formatDate(entry.collectionDate) };
        entry.library.forEach(lib => {
            lib.Ciphers.forEach(cipher => {
                const cipherName = lib.LibraryName === 'openssl' ? `${cipher.CipherName}_${cipher.Type}_${cipher.MessageSize}` : cipher.CipherName;
                if (selectedCiphers.includes(cipherName)) {
                    obj[cipherName] = cipher.Value;
                }
            });
        });
        return obj;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));

    // Calculate the width of the chart based on the number of selected ciphers
    const chartWidth = Math.max(800, selectedCiphers.length * 50);

    return (
        <div style={{ margin: '20px' }}>
            <h3>Performance Metrics Over Time</h3>
            <div style={{ overflowX: 'auto' }}>
                <BarChart width={chartWidth} height={400} data={processedData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" angle={-45} textAnchor="end" interval={0} height={70} />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    {selectedCiphers.map((cipherName, index) => (
                        <Bar dataKey={cipherName} fill={colors[index]} key={cipherName} />
                    ))}
                </BarChart>
            </div>
        </div>
    );
}

export default CipherBarGraph;

