import React, { useState, useEffect } from 'react';

function DataGrid() {
    const [data, setData] = useState([]);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedLibrary, setSelectedLibrary] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        fetch('https://perfwsw3.aus.stglabs.ibm.com:3011/fetchCollectionData/merged?fields=library,collectionDate')
            .then((response) => response.json())
            .then((fetchedData) => {
                setData(fetchedData);
            });
    }, []);

    const handleDateClick = (date) => {
        setSelectedDate(date);
        setSelectedLibrary(null);
    };

    const handleLibraryClick = (library) => {
        setSelectedLibrary(library);
    };

    const handleBackToDates = () => {
        setSelectedDate(null);
        setSelectedLibrary(null);
    };

    const handleBackToLibraries = () => {
        setSelectedLibrary(null);
    };

    const handleDateSearch = (e) => {
        if (e.key === 'Enter') {
            setSelectedDate(null);
            setSelectedLibrary(null);
        }
        setSearchQuery(e.target.value);
    };

    const uniqueDates = [...new Set(data.map(entry => entry.collectionDate))];
    const filteredDates = uniqueDates
        .filter(date => date.toLowerCase().includes(searchQuery.toLowerCase()));

    const filteredCiphers = selectedLibrary?.Ciphers.filter(cipher => 
        cipher.CipherName.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <div>
            <div>
                <input 
                    type="text" 
                    placeholder="Search for a collection date..." 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleDateSearch}
                />
                {filteredDates.length > 0 && (
                    <ul>
                        {filteredDates.map((date, index) => (
                            <li key={index} onClick={() => handleDateClick(date)}>
                                {date}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
            
            {selectedDate && (
                <button onClick={handleBackToDates}>Back to Dates</button>
            )}

            {!selectedDate && uniqueDates.map((date, index) => (
                <div key={index}>
                    <button onClick={() => handleDateClick(date)}>
                        {date}
                    </button>
                </div>
            ))}

            {selectedDate && !selectedLibrary && (
                <button onClick={handleBackToLibraries}>Back to Libraries</button>
            )}

            {selectedDate && !selectedLibrary && data.find(entry => entry.collectionDate === selectedDate).library.map((lib, index) => (
                <button key={index} onClick={() => handleLibraryClick(lib)}>
                    {lib.LibraryName}
                </button>
            ))}

            {selectedLibrary && (
                <div>
                    <input 
                        type="text" 
                        placeholder="Search for a cipher..." 
                        value={searchQuery} 
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <table>
                        <thead>
                            <tr>
                                <th>Library Name</th>
                                <th>Cipher Name</th>
                                <th>Type</th>
                                <th>Message Size</th>
                                <th>Value</th>
                                <th>Unit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCiphers.map((cipher, index) => (
                                <tr key={index}>
                                    <td>{cipher.LibraryName}</td>
                                    <td>{cipher.CipherName}</td>
                                    <td>{cipher.Type}</td>
                                    <td>{cipher.MessageSize}</td>
                                    <td>{cipher.Value}</td>
                                    <td>{cipher.Unit}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default DataGrid;


