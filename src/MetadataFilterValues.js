// MetadataFilterValues.js
import React, { useState, useEffect } from 'react';

function MetadataFilterValues({ onDataLoaded }) {
  const [metadataValues, setMetadataValues] = useState({ metadataHeaders: [], metadataValues: {} });

  useEffect(() => {
    fetch('https://perfwsw3.aus.stglabs.ibm.com:3011/fetchCollectionData/merged')
      .then((response) => response.json())
      .then((fetchedData) => {
        const metadataHeaders = fetchedData.length > 0 ? Object.keys(fetchedData[0].metadata) : [];
        const uniqueValues = {};

        metadataHeaders.forEach((header) => {
          const values = fetchedData.map((entry) => entry.metadata[header]);
          uniqueValues[header] = [...new Set(values)];
        });

        setMetadataValues({ metadataHeaders, metadataValues: uniqueValues });
        onDataLoaded({ metadataHeaders, metadataValues: uniqueValues });
      });
  }, [onDataLoaded]);

  // No need to render anything in this component
  return null;
}

export default MetadataFilterValues;

