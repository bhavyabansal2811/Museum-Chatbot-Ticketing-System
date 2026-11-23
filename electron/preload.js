const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  ping: () => ipcRenderer.invoke('ping'),

  // Send ticket booking data to FastAPI backend
  bookTicket: async (ticketData) => {
    try {
      const response = await fetch('http://127.0.0.1:8000/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticketData),
      });
      if (!response.ok) throw new Error('Server error: ' + response.status);
      return await response.json();
    } catch (err) {
      return { error: err.message };
    }
  },

  // Fetch all tickets for Admin Dashboard
  getTickets: async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/tickets');
      if (!response.ok) throw new Error('Server error: ' + response.status);
      return await response.json();
    } catch (err) {
      return { error: err.message };
    }
  },

  // Delete a single ticket by ID
  deleteTicket: async (ticketId) => {
    try {
      const response = await fetch(`http://127.0.0.1:8000/tickets/${ticketId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Server error: ' + response.status);
      return await response.json();
    } catch (err) {
      return { error: err.message };
    }
  },

  // Clear all tickets (database reset)
  clearAllTickets: async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/tickets', {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Server error: ' + response.status);
      return await response.json();
    } catch (err) {
      return { error: err.message };
    }
  },
});
