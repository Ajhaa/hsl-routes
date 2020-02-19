import React, { useState } from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { gql } from 'apollo-boost';
import SearchField from './SearchField';

const ROUTE = gql`
query SearchRoute($lat1: Float!, $lat2: Float!, $lon1: Float!, $lon2: Float!) {
  plan(
    from: {lat: $lat1, lon: $lon1}
    to: {lat: $lat2, lon: $lon2}
    numItineraries: 3
  ) {
    itineraries {
      legs {
        startTime
        endTime
        mode
        duration
        realTime
        distance
        transitLeg
      }
    }
  }
}

`

const App = () => {
  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);

  const [search, { data, error }] = useLazyQuery(ROUTE);

  const searchRoute = () => {
    const c1 = from.geometry.coordinates;
    const c2 = to.geometry.coordinates;
    
    search({ variables: 
      { 
        lat1: c1[1], lon1: c1[0],
        lat2: c2[1], lon2: c2[0],   
      }
    });
  }

  if (error) {
    console.log(error);
  }

  console.log(from)
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-around' }}>
        <SearchField setTarget={setFrom} />
        <SearchField setTarget={setTo} />
      </div>
      <hr />
      <div style={{ fontSize: 'small', display: 'flex', justifyContent: 'space-around' }}>
        <span style={{ width: '30%' }}>{from && from.properties.label}</span>
        <button 
          disabled={!to || !from}
          onClick={searchRoute}
        >
            search route
        </button>
        <span style={{ width: '30%' }}>{to && to.properties.label}</span>
      </div>
      {data &&
        <div style={{ display: 'flex', justifyContent: 'space-around', flexDirection: 'column' }}>
          {data.plan.itineraries[0].legs.map(l => <div key={l.startTime}>{l.mode}</div>)}
        </div>
      }
    </div>
  )
}

export default App;
