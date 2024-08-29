import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import { FaRegBell } from "react-icons/fa6";

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<string[]>([]);

  useEffect(() => {
    const socket = new SockJS("http://localhost:8787/ws");
    const stompClient = Stomp.over(socket);

    stompClient.connect({}, () => {
      stompClient.subscribe("/topic/products", (message) => {
        setNotifications((prevNotifications) => [
          ...prevNotifications,
          message.body,
        ]);
      });
    });

    return () => {
      stompClient.disconnect(() => {
        console.log("Disconnected");
      });
    };
  }, []);

  return (
    <div className="relative">
      <FaRegBell className="cursor-pointer text-2xl" />
      {notifications.length > 0 && (
        <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 rounded-full"></span>
      )}
      <div className="absolute mt-2 w-64 bg-white shadow-lg rounded-lg overflow-hidden z-10">
        <ul>
          {notifications.map((notification, index) => (
            <li key={index} className="p-2 border-b border-gray-200">
              {notification}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Notifications;
