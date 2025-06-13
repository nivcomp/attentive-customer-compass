
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Download, Upload, FileText, AlertCircle, CheckCircle } from "lucide-react";
import { toast } from "sonner";

interface DataExportImportProps {
  boardId: string;
  boardName: string;
  isOpen: boolean;
  onClose: () => void;
}

const DataExportImport = ({ boardId, boardName, isOpen, onClose }: DataExportImportProps) => {
  const [exportFormat, setExportFormat] = useState<'csv' | 'json' | 'excel'>('csv');
  const [importFile, setImportFile] = useState<File | null>(null);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = async () => {
    setIsExporting(true);
    try {
      // במימוש אמיתי - נשלח בקשה לשרת
      await new Promise(resolve => setTimeout(resolve, 2000)); // סימולציה
      
      // יצירת קובץ דמה
      let content = '';
      let filename = '';
      let mimeType = '';

      switch (exportFormat) {
        case 'csv':
          content = 'שם,אימייל,טלפון,תאריך יצירה\nישראל ישראלי,israel@example.com,050-1234567,2024-01-01\nשרה לוי,sara@example.com,050-7654321,2024-01-02';
          filename = `${boardName}_export.csv`;
          mimeType = 'text/csv';
          break;
        case 'json':
          content = JSON.stringify([
            { name: 'ישראל ישראלי', email: 'israel@example.com', phone: '050-1234567', created: '2024-01-01' },
            { name: 'שרה לוי', email: 'sara@example.com', phone: '050-7654321', created: '2024-01-02' }
          ], null, 2);
          filename = `${boardName}_export.json`;
          mimeType = 'application/json';
          break;
        case 'excel':
          content = 'שם,אימייל,טלפון,תאריך יצירה\nישראל ישראלי,israel@example.com,050-1234567,2024-01-01\nשרה לוי,sara@example.com,050-7654321,2024-01-02';
          filename = `${boardName}_export.xlsx`;
          mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
          break;
      }

      // הורדת הקובץ
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      toast.success(`הקובץ ${filename} יוצא בהצלחה`);
    } catch (error) {
      console.error('Export error:', error);
      toast.error('שגיאה בייצוא הנתונים');
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    if (!importFile) {
      toast.error('אנא בחר קובץ לייבוא');
      return;
    }

    setIsImporting(true);
    try {
      const content = await importFile.text();
      console.log('File content:', content);
      
      // במימוש אמיתי - נפרס את הנתונים ונשלח לשרת
      await new Promise(resolve => setTimeout(resolve, 2000)); // סימולציה
      
      // הוספת התראה על הייבוא המוצלח
      const notifications = JSON.parse(localStorage.getItem('boardNotifications') || '[]');
      const newNotification = {
        id: Date.now().toString(),
        title: 'ייבוא נתונים הושלם',
        message: `הנתונים מהקובץ "${importFile.name}" יובאו בהצלחה לבורד "${boardName}"`,
        type: 'success',
        boardId,
        boardName,
        isRead: false,
        createdAt: new Date().toISOString()
      };
      notifications.unshift(newNotification);
      localStorage.setItem('boardNotifications', JSON.stringify(notifications));

      toast.success('הנתונים יובאו בהצלחה');
      setImportFile(null);
    } catch (error) {
      console.error('Import error:', error);
      toast.error('שגיאה בייבוא הנתונים');
    } finally {
      setIsImporting(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const allowedTypes = ['text/csv', 'application/json', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (allowedTypes.includes(file.type) || file.name.endsWith('.csv') || file.name.endsWith('.json')) {
        setImportFile(file);
      } else {
        toast.error('סוג קובץ לא נתמך. אנא בחר קובץ CSV, JSON או Excel');
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <Card className="w-full max-w-2xl mx-4">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            ייצוא ויבוא נתונים - {boardName}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* ייצוא נתונים */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Download className="h-5 w-5" />
              ייצוא נתונים
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="export-format">פורמט ייצוא</Label>
                <Select value={exportFormat} onValueChange={(value: 'csv' | 'json' | 'excel') => setExportFormat(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="csv">CSV (קובץ טקסט מופרד בפסיקים)</SelectItem>
                    <SelectItem value="json">JSON (נתונים מובנים)</SelectItem>
                    <SelectItem value="excel">Excel (גיליון אלקטרוני)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button 
                onClick={handleExport} 
                disabled={isExporting}
                className="w-full"
              >
                {isExporting ? (
                  <>מייצא נתונים...</>
                ) : (
                  <>
                    <Download className="h-4 w-4 ml-2" />
                    ייצא נתונים
                  </>
                )}
              </Button>
            </div>
          </div>

          <Separator />

          {/* יבוא נתונים */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Upload className="h-5 w-5" />
              יבוא נתונים
            </h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="import-file">בחר קובץ לייבוא</Label>
                <Input
                  id="import-file"
                  type="file"
                  accept=".csv,.json,.xlsx,.xls"
                  onChange={handleFileSelect}
                  className="mt-1"
                />
                {importFile && (
                  <div className="mt-2 flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    נבחר: {importFile.name} ({(importFile.size / 1024).toFixed(1)} KB)
                  </div>
                )}
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex gap-2">
                  <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">הערות חשובות לייבוא:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>הקובץ צריך להכיל כותרות עמודות בשורה הראשונה</li>
                      <li>נתונים קיימים לא יימחקו - רק ייתוספו חדשים</li>
                      <li>פורמטים נתמכים: CSV, JSON, Excel</li>
                    </ul>
                  </div>
                </div>
              </div>

              <Button 
                onClick={handleImport} 
                disabled={!importFile || isImporting}
                className="w-full"
              >
                {isImporting ? (
                  <>מייבא נתונים...</>
                ) : (
                  <>
                    <Upload className="h-4 w-4 ml-2" />
                    יבא נתונים
                  </>
                )}
              </Button>
            </div>
          </div>

          <Separator />

          <div className="flex justify-end">
            <Button variant="outline" onClick={onClose}>
              סגור
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DataExportImport;
