import React, { createContext, useContext, useState, useEffect } from 'react';

const NotificationContext = createContext();

export const useNotifications = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState(() => {
        const saved = localStorage.getItem('prepx_notifications');
        return saved ? JSON.parse(saved) : [];
    });

    useEffect(() => {
        localStorage.setItem('prepx_notifications', JSON.stringify(notifications));
    }, [notifications]);

    // Initial triggers for empty state
    useEffect(() => {
        if (notifications.length === 0) {
            const initialNotes = [
                {
                    id: 'init-1',
                    type: 'AI_SUGGESTION',
                    title: 'Strategic Insights',
                    message: 'AI suggests reviewing "Graph Algorithms" based on current market trends.',
                    date: new Date().toISOString(),
                    read: false
                },
                {
                    id: 'init-2',
                    type: 'DAILY_REMINDER',
                    title: 'Daily Protocol',
                    message: "You haven't completed your daily challenge yet. Consistency is key to mastery.",
                    date: new Date().toISOString(),
                    read: false
                }
            ];
            setNotifications(initialNotes);
        }
    }, []);

    const addNotification = (type, title, message) => {
        const newNote = {
            id: Date.now().toString(),
            type,
            title,
            message,
            date: new Date().toISOString(),
            read: false
        };
        setNotifications(prev => [newNote, ...prev]);
    };

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
    };

    const markAllAsRead = () => {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    };

    const clearAll = () => {
        setNotifications([]);
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <NotificationContext.Provider value={{
            notifications,
            unreadCount,
            addNotification,
            markAsRead,
            markAllAsRead,
            clearAll
        }}>
            {children}
        </NotificationContext.Provider>
    );
};
