/**
 * Simple test version of App to debug click issues
 */

import React, { useState } from 'react';

function App() {
  const [count, setCount] = useState(0);

  const handleClick = () => {
    setCount(count + 1);
    console.log('Button clicked!', count);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Inter, sans-serif' }}>
      <h1 style={{ color: '#4CAF50' }}>FridgeChef Debug</h1>
      <p>Testing basic functionality...</p>
      
      <button 
        onClick={handleClick}
        style={{
          backgroundColor: '#4CAF50',
          color: 'white',
          padding: '12px 24px',
          border: 'none',
          borderRadius: '8px',
          fontSize: '16px',
          cursor: 'pointer'
        }}
      >
        Click me! Count: {count}
      </button>
      
      <div style={{ marginTop: '20px' }}>
        {count > 0 && <p>Button is working! Clicked {count} times.</p>}
      </div>
    </div>
  );
}

export default App;
