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

function getWebvitalsObj(){
    if (!globalThis.webvitals) globalThis.webvitals = {};
    return globalThis.webvitals
}

async function createWebSocket(url, onMessage, onOpen, onClose, onError) {
    if (!getWebvitalsObj().io){
        getWebvitalsObj().io = (await import("https://cdn.socket.io/4.7.2/socket.io.esm.min.js")).io;
    }
    if (getWebvitalsObj().socket && getWebvitalsObj().socket.connected) {
        return getWebvitalsObj().socket;
    }

    if(!sessionStorage['webvitals-session-id']){
        sessionStorage['webvitals-session-id'] = makeid(32);
    }

    
    getWebvitalsObj().socket = getWebvitalsObj().io(url, {auth:{
            "session-id": sessionStorage['webvitals-session-id'],
            "user-id": getWebvitalsObj().userId
    }});
    

    if (onOpen) getWebvitalsObj().socket.on("connect", () => onOpen(socket));
    if (onMessage) getWebvitalsObj().socket.on("message", (message) => onMessage(message));
    if (onClose) getWebvitalsObj().socket.on("disconnect", onClose);
    if (onError) getWebvitalsObj().socket.on("connect_error", onError);

    return getWebvitalsObj().socket;
}

export async function sendData(eventId, data){
    let socket = await createWebSocket("http://localhost:3000", null, null, null, null);
    if (eventId && data) {
        socket.emit(eventId, data);
    }
}