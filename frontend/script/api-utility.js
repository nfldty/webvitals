let socket = null;

function createWebSocket(url, onMessage, onOpen, onClose, onError) {
    if (socket && socket.readyState !== WebSocket.CLOSED) {
        return socket;
    }

    socket = new WebSocket(url);

    if (onOpen) socket.onopen = () => onOpen(socket);
    if (onMessage) socket.onmessage = (event) => onMessage(event.data);
    if (onClose) socket.onclose = (event) => {
        socket = null;
        if (onClose) onClose(event);
    };
    if (onError) socket.onerror = onError;

    return socket;
}

createWebSocket("URL", null, null, null, null);

function sendData(eventId, data){
    if (eventId && data) {
        socket.emit(eventId, data);
    }
}