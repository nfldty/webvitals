function makeid(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
      counter += 1;
    }
    return result;
}

async function createWebSocket(url, onMessage, onOpen, onClose, onError) {
    if (!this.io){
        this.io = (await import("https://cdn.socket.io/4.7.2/socket.io.esm.min.js")).io;
    }
    if (this.socket && this.socket.connected) {
        return this.socket;
    }

    if(!sessionStorage['webvitals-session-id']){
        sessionStorage['webvitals-session-id'] = makeid(32);
    }

    
    this.socket = io(url, {auth:{
            "session-id": sessionStorage['webvitals-session-id'],
            "user-id": this.userId
    }});
    

    if (onOpen) this.socket.on("connect", () => onOpen(socket));
    if (onMessage) this.socket.on("message", (message) => onMessage(message));
    if (onClose) this.socket.on("disconnect", onClose);
    if (onError) this.socket.on("connect_error", onError);

    return socket;
}

export default async function sendData(eventId, data){
    let socket = await createWebSocket("http://localhost:3000", null, null, null, null);
    if (eventId && data) {
        socket.emit(eventId, data);
    }
}