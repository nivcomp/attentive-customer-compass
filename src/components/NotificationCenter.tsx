
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Bell, BellRing, Check, X, Settings, Filter } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success';
  boardId?: string;
  boardName?: string;
  isRead: boolean;
  createdAt: string;
}

interface NotificationCenterProps {
  isOpen: boolean;
  onClose: () => void;
}

const NotificationCenter = ({ isOpen, onClose }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  // טעינת התראות מ-localStorage (במקום אמיתי יהיה מהשרת)
  useEffect(() => {
    const savedNotifications = localStorage.getItem('boardNotifications');
    if (savedNotifications) {
      try {
        setNotifications(JSON.parse(savedNotifications));
      } catch (error) {
        console.error('Error loading notifications:', error);
      }
    } else {
      // הוספת התראות דמו
      const demoNotifications: Notification[] = [
        {
          id: '1',
          title: 'בורד חדש נוצר',
          message: 'הבורד "ניהול לקוחות" נוצר בהצלחה',
          type: 'success',
          boardId: 'board1',
          boardName: 'ניהול לקוחות',
          isRead: false,
          createdAt: new Date().toISOString()
        },
        {
          id: '2',
          title: 'הרשאה חדשה התקבלה',
          message: 'קיבלת הרשאת עריכה לבורד "פרויקטים"',
          type: 'info',
          boardId: 'board2',
          boardName: 'פרויקטים',
          isRead: false,
          createdAt: new Date(Date.now() - 60000).toISOString()
        },
        {
          id: '3',
          title: 'שגיאה בייבוא נתונים',
          message: 'ייבוא הנתונים לבורד "מכירות" נכשל',
          type: 'error',
          boardId: 'board3',
          boardName: 'מכירות',
          isRead: true,
          createdAt: new Date(Date.now() - 120000).toISOString()
        }
      ];
      setNotifications(demoNotifications);
      localStorage.setItem('boardNotifications', JSON.stringify(demoNotifications));
    }
  }, []);

  const markAsRead = (notificationId: string) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId 
        ? { ...notification, isRead: true }
        : notification
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('boardNotifications', JSON.stringify(updatedNotifications));
  };

  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => 
      ({ ...notification, isRead: true })
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('boardNotifications', JSON.stringify(updatedNotifications));
  };

  const deleteNotification = (notificationId: string) => {
    const updatedNotifications = notifications.filter(notification => 
      notification.id !== notificationId
    );
    setNotifications(updatedNotifications);
    localStorage.setItem('boardNotifications', JSON.stringify(updatedNotifications));
  };

  const getTypeColor = (type: string) => {
    const colors = {
      info: 'bg-blue-100 text-blue-800',
      warning: 'bg-yellow-100 text-yellow-800',
      error: 'bg-red-100 text-red-800',
      success: 'bg-green-100 text-green-800'
    };
    return colors[type as keyof typeof colors] || colors.info;
  };

  const filteredNotifications = filter === 'unread' 
    ? notifications.filter(n => !n.isRead)
    : notifications;

  const unreadCount = notifications.filter(n => !n.isRead).length;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <Card className="w-full max-w-2xl max-h-[80vh] mx-4">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <Bell className="h-6 w-6" />
                {unreadCount > 0 && (
                  <Badge 
                    variant="destructive" 
                    className="absolute -top-2 -right-2 h-5 w-5 p-0 flex items-center justify-center text-xs"
                  >
                    {unreadCount}
                  </Badge>
                )}
              </div>
              <CardTitle className="text-xl">מركز התראות</CardTitle>
            </div>
            <div className="flex gap-2">
              {unreadCount > 0 && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                >
                  <Check className="h-4 w-4 ml-1" />
                  סמן הכל כנקרא
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={onClose}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="flex gap-2 mt-4">
            <Button
              variant={filter === 'all' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('all')}
            >
              הכל ({notifications.length})
            </Button>
            <Button
              variant={filter === 'unread' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setFilter('unread')}
            >
              לא נקראו ({unreadCount})
            </Button>
          </div>
        </CardHeader>

        <Separator />

        <CardContent className="p-0">
          <ScrollArea className="h-96">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <Bell className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>אין התראות להצגה</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredNotifications.map((notification) => (
                  <div 
                    key={notification.id} 
                    className={`p-4 hover:bg-gray-50 transition-colors ${
                      !notification.isRead ? 'bg-blue-50 border-r-4 border-blue-500' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900">
                            {notification.title}
                          </h4>
                          <Badge 
                            variant="outline" 
                            className={getTypeColor(notification.type)}
                          >
                            {notification.type === 'info' ? 'מידע' :
                             notification.type === 'warning' ? 'אזהרה' :
                             notification.type === 'error' ? 'שגיאה' : 'הצלחה'}
                          </Badge>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        {notification.boardName && (
                          <p className="text-xs text-gray-500">
                            בורד: {notification.boardName}
                          </p>
                        )}
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(notification.createdAt).toLocaleString('he-IL')}
                        </p>
                      </div>
                      <div className="flex gap-1 ml-4">
                        {!notification.isRead && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => markAsRead(notification.id)}
                            className="h-8 w-8 p-0"
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteNotification(notification.id)}
                          className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotificationCenter;
