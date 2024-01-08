// LibraryTabs.js
import React, { useState, useEffect } from 'react';
import CipherBarGraph from './CipherBarGraph';
import LibraryTabsFilters from './LibraryTabsFilters';

function LibraryTabs() {
  const [data, setData] = useState([]);
  const [selectedLibrary, setSelectedLibrary] = useState(null);
  const [distinctCiphers, setDistinctCiphers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [checkedCiphers, setCheckedCiphers] = useState({});
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [metadataFilters, setMetadataFilters] = useState({}); // New state for metadata filters
  const [metadataValues, setMetadataValues] = useState({}); // New state for metadata values

  useEffect(() => {
    fetch('https://perfwsw3.aus.stglabs.ibm.com:3011/fetchCollectionData/merged')
      .then((response) => response.json())
      .then((fetchedData) => {
        setData(fetchedData);

        // Set metadata values for dropdown suggestions
        const metadataHeaders = fetchedData.length > 0 ? Object.keys(fetchedData[0].metadata) : [];
        const uniqueValues = {};

        metadataHeaders.forEach((header) => {
          const values = fetchedData.map((entry) => entry.metadata[header]);
          uniqueValues[header] = [...new Set(values)];
        });

        setMetadataValues(uniqueValues);
      });
  }, []);

  useEffect(() => {
    if (selectedLibrary) {
      const allCiphers = [];
      data.forEach((entry) => {
        entry.library.forEach((lib) => {
          if (lib.LibraryName === selectedLibrary) {
            lib.Ciphers.forEach((cipher) => {
              const cipherName = selectedLibrary === 'openssl' ? `${cipher.CipherName}_${cipher.Type}_${cipher.MessageSize}` : cipher.CipherName;
              allCiphers.push(cipherName);
            });
          }
        });
      });
      setDistinctCiphers([...new Set(allCiphers)]);
    }
  }, [selectedLibrary, data]);

  const filteredCiphers = distinctCiphers.filter((cipherName) =>
    cipherName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCheckboxChange = (cipherName) => {
    setCheckedCiphers((prevState) => ({
      ...prevState,
      [cipherName]: !prevState[cipherName],
    }));
  };

  const buildHierarchy = (ciphers) => {
    const hierarchy = {};

    ciphers.forEach((cipher) => {
      let currentLevel = hierarchy;
      cipher.split(/[:_-]/).forEach((part) => {
        if (!currentLevel[part]) {
          currentLevel[part] = {};
        }
        currentLevel = currentLevel[part];
      });
      currentLevel._cipherName = cipher;
    });

    return hierarchy;
  };

  const handleParentCheckboxChange = (node) => {
    const allCiphers = [];

    const extractCiphers = (subNode) => {
      if (subNode._cipherName) {
        allCiphers.push(subNode._cipherName);
      } else {
        Object.values(subNode).forEach(extractCiphers);
      }
    };

    extractCiphers(node);

    const areAllChecked = allCiphers.every((cipher) => checkedCiphers[cipher]);
    const newCheckedState = !areAllChecked;

    const newCheckedCiphers = { ...checkedCiphers };
    allCiphers.forEach((cipher) => {
      newCheckedCiphers[cipher] = newCheckedState;
    });

    setCheckedCiphers(newCheckedCiphers);
  };

  const renderHierarchy = (node, key, level = 0) => {
    const paddingLeft = `${level * 20}px`;

    if (node._cipherName) {
      return (
        <div key={node._cipherName} style={{ paddingLeft }}>
          <input
            type="checkbox"
            id={node._cipherName}
            name={node._cipherName}
            checked={!!checkedCiphers[node._cipherName]}
            onChange={() => handleCheckboxChange(node._cipherName)}
          />
          <label htmlFor={node._cipherName}>{node._cipherName}</label>
        </div>
      );
    }

    return (
      <details key={key} style={{ paddingLeft }}>
        <summary>
          <input type="checkbox" onChange={() => handleParentCheckboxChange(node)} />
          {key}
        </summary>
        {Object.keys(node).map((subKey) => renderHierarchy(node[subKey], subKey, level + 1))}
      </details>
    );
  };

  const handleFilterChange = (filters) => {
    setStartDate(filters.startDate);
    setEndDate(filters.endDate);
    setMetadataFilters(filters.metadataFilters);
  };

  const filteredData = data.filter((entry) => {
    const entryDate = new Date(entry.collectionDate);
    if (startDate && entryDate < new Date(startDate)) return false;
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      if (entryDate > endOfDay) return false;
    }

    // Check metadata filters
    for (const [header, value] of Object.entries(metadataFilters)) {
      if (entry.metadata && entry.metadata[header] && entry.metadata[header].toLowerCase().includes(value.toLowerCase())) {
        continue;
      } else {
        return false;
      }
    }

    return true;
  });

  return (
    <div style={{ display: 'flex' }}>
      <div>
        {data.length > 0 &&
          data[0].library.map((lib, index) => (
            <button key={index} onClick={() => setSelectedLibrary(lib.LibraryName)}>
              {lib.LibraryName}
            </button>
          ))}

        {selectedLibrary && (
          <input
            type="text"
            placeholder="Search for a cipher..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        )}

        {selectedLibrary && renderHierarchy(buildHierarchy(filteredCiphers), selectedLibrary)}

        {/* Metadata Filters */}
        <LibraryTabsFilters
          onFilterChange={handleFilterChange}
          metadataHeaders={data.length > 0 ? Object.keys(data[0].metadata) : []}
          metadataValues={metadataValues} // Pass metadata values to LibraryTabsFilters
        />
      </div>
      <div>
        {data && data.length > 0 && (
          <CipherBarGraph data={filteredData} selectedCiphers={Object.keys(checkedCiphers).filter((cipher) => checkedCiphers[cipher])} />
        )}
      </div>
    </div>
  );
}

export default LibraryTabs;

