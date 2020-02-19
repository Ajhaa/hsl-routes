import React, { useState } from 'react';
import { debounce } from 'lodash';
import Axios from 'axios';

const DIGITRANSIT_URL = 'https://api.digitransit.fi/geocoding/v1/search'

const searchLocation = async (location, callback) => {
  if (!location) {
    return callback([])
  }
  const fullUrl = `${DIGITRANSIT_URL}?text=${location}&focus.point.lon=25.025549&focus.point.lat=60.228204&size=5`;
  const result = await Axios.get(fullUrl);

  callback(result.data.features);
}
const debouncedSearch = debounce(searchLocation, 300);

export default ({ setTarget }) => {
  const [results, setResults] = useState([]);
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
    debouncedSearch(event.target.value, setResults);
  }

  return (
    <div style={{ width: '30%', fontSize: 'small' }}>
      <input type="text" value={inputValue} onChange={handleInputChange}/>
      {results.map(r => <div key={r.properties.id} onClick={() => setTarget(r)}>{r.properties.label}</div>)}
    </div>
  )
}
