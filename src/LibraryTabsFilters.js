// LibraryTabsFilters.js
import React, { useState, useEffect } from 'react';

function LibraryTabsFilters({ onFilterChange }) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [metadataFilters, setMetadataFilters] = useState({});
  const [metadataValues, setMetadataValues] = useState({});

  useEffect(() => {
    // Fetch metadata values
    fetch('https://perfwsw3.aus.stglabs.ibm.com:3011/fetchCollectionData/merged')
      .then((response) => response.json())
      .then((fetchedData) => {
        const metadataHeaders = fetchedData.length > 0 ? Object.keys(fetchedData[0].metadata) : [];
        const uniqueValues = {};

        metadataHeaders.forEach((header) => {
          const values = fetchedData.map((entry) => entry.metadata[header]);
          uniqueValues[header] = [...new Set(values)];
        });

        setMetadataValues(uniqueValues);
      });
  }, []);

  const handleStartDateChange = (e) => {
    setStartDate(e.target.value);
  };

  const handleEndDateChange = (e) => {
    setEndDate(e.target.value);
  };

  const handleMetadataFilterChange = (header, value) => {
    setMetadataFilters((prevFilters) => ({
      ...prevFilters,
      [header]: value,
    }));
  };

  const handleApplyFilters = () => {
    onFilterChange({
      startDate,
      endDate,
      metadataFilters,
    });
  };

  return (
    <div style={{ marginTop: '20px', maxWidth: '400px' }}>
      <h3>Filters</h3>
      <div>
        <label>Start Date:</label>
        <input type="date" value={startDate} onChange={handleStartDateChange} />
      </div>
      <div>
        <label>End Date:</label>
        <input type="date" value={endDate} onChange={handleEndDateChange} />
      </div>
      <div style={{ height: '300px', width: '100%', overflowX: 'auto', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '4px', padding: '10px' }}>
        <h4>Metadata Filters:</h4>
        {Object.keys(metadataValues).map((header) => (
          <div key={header}>
            <label>{header}:</label>
            <select
              value={metadataFilters[header] || ''}
              onChange={(e) => handleMetadataFilterChange(header, e.target.value)}
            >
              <option value="">Select {header}</option>
              {metadataValues[header]?.map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        ))}
      </div>
      <button onClick={handleApplyFilters}>Apply Filters</button>
    </div>
  );
  
  
}

export default LibraryTabsFilters;

