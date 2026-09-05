import React, { useState } from 'react';

function App() {
  const [task, setTask] = useState('');
  const [date, setDate] = useState('');
  const [emailTo, setEmailTo] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Sending...');

    try {
      const response = await fetch('http://localhost:5000/api/schedule-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, date, emailTo })
      });

      const data = await response.json();
      setStatus(data.message);
      
      // Clear form fields
      setTask('');
      setDate('');
      setEmailTo('');
    } catch (error) {
      setStatus('Something went wrong!');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '50px auto', fontFamily: 'sans-serif' }}>
      <h2>Mini Calendar / Reminders</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <input 
          type="text" 
          placeholder="What needs to be done?" 
          value={task} 
          onChange={(e) => setTask(e.target.value)} 
          required 
          style={{ padding: '10px' }}
        />
        
        <input 
          type="datetime-local" 
          value={date} 
          onChange={(e) => setDate(e.target.value)} 
          required 
          style={{ padding: '10px' }}
        />
        
        <input 
          type="email" 
          placeholder="Which email should receive the notification?" 
          value={emailTo} 
          onChange={(e) => setEmailTo(e.target.value)} 
          required 
          style={{ padding: '10px' }}
        />

        <button type="submit" style={{ padding: '10px', backgroundColor: '#007BFF', color: 'white', border: 'none', cursor: 'pointer' }}>
          Schedule
        </button>
      </form>

      {status && <p style={{ marginTop: '20px', fontWeight: 'bold' }}>{status}</p>}
    </div>
  );
}

export default App;
