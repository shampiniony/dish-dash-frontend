import { useEffect, useState, useCallback } from "react";
import io from "socket.io-client";

const SOCKET_URL = "https://dishdash.ru"; // Замените на ваш URL

type EventCallback = (data: any) => void;

const useSocket = () => {
  const [socket, setSocket] = useState<SocketIOClient.Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(SOCKET_URL, {
      transports: ['websocket'],
      reconnectionAttempts: 5,
      timeout: 20000,
    });

    socketInstance.on("connect_error", (err: any) => {
      console.error("Connection error:", err);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  const subscribeToEvent = useCallback(
    (event: string, callback: EventCallback) => {
      if (socket) {
        socket.on(event, callback);
      
        // Cleanup function to unsubscribe from the event
        return () => {
          socket.off(event, callback);
        };
      }
    },
    [socket]
  );

  return { socket, subscribeToEvent };
};

export default useSocket;
