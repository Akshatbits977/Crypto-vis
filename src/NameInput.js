import React, { useState } from 'react';

function NameInput({ onNameSubmit }) {
  const [name, setName] = useState('');

  return (
    <div>
      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <button onClick={() => onNameSubmit(name)}>Submit</button>
    </div>
  );
}

export default NameInput;

