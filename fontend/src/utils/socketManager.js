import io from 'socket.io-client';

class SocketManager {
    constructor() {
        this.socket = null;
    }

    connect(userId) {
        if (!this.socket) {
            this.socket = io(`${import.meta.env.BASE_URL}`, {
                query: { userId }
            });
        }
        return this.socket;
    }

    disconnect() {
        if (this.socket) {
            this.socket.close();
            this.socket = null;
        }
    }

    getSocket() {
        return this.socket;
    }
}

export const socketManager = new SocketManager(); 