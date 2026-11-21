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
});
