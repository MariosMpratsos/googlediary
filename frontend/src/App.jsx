import React, { useState, useEffect } from 'react';

function App() {
  const [task, setTask] = useState('');
  const [emailTo, setEmailTo] = useState('');
  
  // Automatically pre-fill current date and time + 5 minutes
  const now = new Date();
  const currentHour24 = now.getHours();
  const initialAMPM = currentHour24 >= 12 ? 'PM' : 'AM';
  let initialHour12 = currentHour24 % 12;
  if (initialHour12 === 0) initialHour12 = 12;

  now.setMinutes(now.getMinutes() + 5);

  const [selectedDate, setSelectedDate] = useState(now.toISOString().split('T')[0]);
  const [hour, setHour] = useState(String(initialHour12).padStart(2, '0'));
  const [ampm, setAmpm] = useState(initialAMPM);
  const [minute, setMinute] = useState(String(now.getMinutes()).padStart(2, '0'));
  const [second, setSecond] = useState('00');
  
  const [status, setStatus] = useState('');
  
  // History log state initialized from LocalStorage
  const [history, setHistory] = useState(() => {
    const savedHistory = localStorage.getItem('reminder_history');
    return savedHistory ? JSON.parse(savedHistory) : [];
  });

  const [filter, setFilter] = useState('All');

  // Save history to LocalStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('reminder_history', JSON.stringify(history));
  }, [history]);

  // Automatically update status to 'Done' when target time is reached
  useEffect(() => {
    const interval = setInterval(() => {
      setHistory(prevHistory => {
        let hasChanges = false;
        const updated = prevHistory.map(item => {
          if (item.status === 'Scheduled' && Date.now() >= item.timestamp) {
            hasChanges = true;
            return { ...item, status: 'Done' };
          }
          return item;
        });
        return hasChanges ? updated : prevHistory;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const todayStr = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedDate) {
      setStatus('Error: Please select a date!');
      return;
    }

    // Convert 12-hour format + AM/PM to 24-hour format
    let hour24 = Number(hour);
    if (ampm === 'PM' && hour24 < 12) {
      hour24 += 12;
    } else if (ampm === 'AM' && hour24 === 12) {
      hour24 = 0;
    }

    const [year, month, day] = selectedDate.split('-').map(Number);
    const finalDateObject = new Date(
      year, 
      month - 1, 
      day, 
      hour24, 
      Number(minute), 
      Number(second)
    );

    const targetTimestamp = finalDateObject.getTime();
    const currentTimestamp = Date.now();

    if (targetTimestamp <= currentTimestamp) {
      setStatus('Error: This time has already passed! Please choose a future time.');
      return; 
    }

    setStatus('Sending...');

    try {
      const response = await fetch('http://localhost:5000/api/schedule-reminder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          task, 
          targetTime: targetTimestamp, 
          emailTo 
        })
      });

      const data = await response.json();
      setStatus(data.message);
      
      const newLogItem = {
        id: Date.now(),
        task,
        emailTo,
        dateTime: finalDateObject.toLocaleString(),
        timestamp: targetTimestamp,
        status: 'Scheduled'
      };
      setHistory(prev => [newLogItem, ...prev]);

      setTask('');
      setEmailTo('');
    } catch (error) {
      setStatus('Something went wrong! Is the backend running?');
    }
  };

  const filteredHistory = history.filter(item => {
    const itemDate = new Date(item.timestamp);
    const nowTime = new Date();
    
    const itemDay = new Date(itemDate.getFullYear(), itemDate.getMonth(), itemDate.getDate()).getTime();
    const todayDay = new Date(nowTime.getFullYear(), nowTime.getMonth(), nowTime.getDate()).getTime();
    
    const oneDayMs = 24 * 60 * 60 * 1000;
    const tomorrowDay = todayDay + oneDayMs;
    const dayAfterTomorrowDay = todayDay + (2 * oneDayMs);

    if (filter === 'All') return true;
    if (filter === 'Past') return item.timestamp < nowTime.getTime();
    if (filter === 'Today') return itemDay === todayDay;
    if (filter === 'Tomorrow') return itemDay === tomorrowDay;
    if (filter === 'Before Day After Tomorrow') return itemDay <= dayAfterTomorrowDay;
    if (filter === 'After Day After Tomorrow') return itemDay > dayAfterTomorrowDay;

    return true;
  });

  const inputStyle = {
    padding: '10px',
    borderRadius: '5px',
    border: '1px solid #555',
    backgroundColor: '#333',
    color: 'white',
    width: '100%',
    boxSizing: 'border-box',
    colorScheme: 'dark'
  };

  const labelStyle = {
    fontSize: '12px',
    fontWeight: 'bold',
    marginBottom: '5px',
    display: 'block',
    color: '#aaa'
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', padding: '30px 20px', gap: '20px', flexWrap: 'wrap', minHeight: '100vh', backgroundColor: '#1a1a1a', color: 'white', fontFamily: 'sans-serif' }}>
      
      {/* --- FORM CARD --- */}
      <div style={{ width: '100%', maxWidth: '420px', padding: '25px', backgroundColor: '#2a2a2a', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.6)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#fff' }}>Advanced Reminder</h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          
          <div>
            <label style={labelStyle}>Task / Reminder</label>
            <input 
              type="text" 
              placeholder="What needs to be done?" 
              value={task} 
              onChange={(e) => setTask(e.target.value)} 
              required 
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Date</label>
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
              min={todayStr}
              required 
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>Time (HH:MM:SS + AM/PM)</label>
            <div style={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <input 
                type="number" 
                min="1" 
                max="12" 
                value={hour} 
                onChange={(e) => setHour(e.target.value)} 
                placeholder="HH" 
                required 
                style={{ ...inputStyle, textAlign: 'center' }} 
              />
              <span>:</span>
              <input 
                type="number" 
                min="0" 
                max="59" 
                value={minute} 
                onChange={(e) => setMinute(e.target.value)} 
                placeholder="MM" 
                required 
                style={{ ...inputStyle, textAlign: 'center' }} 
              />
              <span>:</span>
              <input 
                type="number" 
                min="0" 
                max="59" 
                value={second} 
                onChange={(e) => setSecond(e.target.value)} 
                placeholder="SS" 
                required 
                style={{ ...inputStyle, textAlign: 'center' }} 
              />
              <select 
                value={ampm} 
                onChange={(e) => setAmpm(e.target.value)} 
                style={{ ...inputStyle, padding: '10px 5px', textAlign: 'center', fontWeight: 'bold' }}
              >
                <option value="AM">AM</option>
                <option value="PM">PM</option>
              </select>
            </div>
          </div>
          
          <div>
            <label style={labelStyle}>Notification Email</label>
            <input 
              type="email" 
              placeholder="email@example.com" 
              value={emailTo} 
              onChange={(e) => setEmailTo(e.target.value)} 
              required 
              style={inputStyle}
            />
          </div>

          <button type="submit" style={{ padding: '12px', backgroundColor: '#007BFF', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold', marginTop: '10px' }}>
            Schedule Reminder
          </button>
        </form>

        {status && (
          <div style={{ 
            marginTop: '20px', 
            padding: '10px', 
            borderRadius: '5px', 
            textAlign: 'center',
            backgroundColor: status.includes('Error') ? 'rgba(255, 77, 77, 0.2)' : 'rgba(76, 175, 80, 0.2)',
            color: status.includes('Error') ? '#ff4d4d' : '#4CAF50',
            fontSize: '14px',
            fontWeight: 'bold'
          }}>
            {status}
          </div>
        )}
      </div>

      {/* --- HISTORY LOG PANEL --- */}
      <div style={{ width: '100%', maxWidth: '420px', padding: '25px', backgroundColor: '#2a2a2a', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.6)', display: 'flex', flexDirection: 'column', maxHeight: '550px' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '15px', color: '#fff' }}>History Log</h2>

        <div style={{ marginBottom: '15px' }}>
          <label style={labelStyle}>Filter Log</label>
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)}
            style={inputStyle}
          >
            <option value="All">All Reminders</option>
            <option value="Past">Past</option>
            <option value="Today">Today</option>
            <option value="Tomorrow">Tomorrow</option>
            <option value="Before Day After Tomorrow">Before / On Day After Tomorrow</option>
            <option value="After Day After Tomorrow">After Day After Tomorrow</option>
          </select>
        </div>

        <div style={{ overflowY: 'auto', flex: 1, display: 'flex', flexDirection: 'column', gap: '10px', paddingRight: '5px' }}>
          {filteredHistory.length === 0 ? (
            <p style={{ color: '#777', textAlign: 'center', marginTop: '40px' }}>No reminders found in this filter.</p>
          ) : (
            filteredHistory.map(item => {
              const isDone = item.status === 'Done';
              return (
                <div key={item.id} style={{ padding: '12px', backgroundColor: '#333', borderRadius: '8px', borderLeft: `4px solid ${isDone ? '#4CAF50' : '#007BFF'}` }}>
                  <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '4px' }}>{item.task}</div>
                  <div style={{ fontSize: '12px', color: '#bbb', marginBottom: '2px' }}>To: {item.emailTo}</div>
                  <div style={{ fontSize: '11px', color: '#888' }}>Scheduled for: {item.dateTime}</div>
                  <div style={{ 
                    marginTop: '6px', 
                    display: 'inline-block', 
                    padding: '2px 8px', 
                    borderRadius: '4px', 
                    fontSize: '10px', 
                    fontWeight: 'bold', 
                    backgroundColor: isDone ? 'rgba(76, 175, 80, 0.2)' : 'rgba(0, 123, 255, 0.2)', 
                    color: isDone ? '#4CAF50' : '#3399ff' 
                  }}>
                    {item.status}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}

export default App;
