// Socket.IO service for multiplayer functionality
import { io } from 'socket.io-client';

let socket = null;

export const initSocket = (serverUrl) => {
  if (!socket) {
    socket = io(serverUrl);
    
    socket.on('connect', () => {
      console.log('Connected to server');
    });
    
    socket.on('disconnect', () => {
      console.log('Disconnected from server');
    });
  }
  
  return socket;
};

export const getSocket = () => socket;

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}; 