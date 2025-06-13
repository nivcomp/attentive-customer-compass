
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Plus, 
  Users, 
  Share2, 
  Search, 
  Calendar, 
  Activity, 
  Eye, 
  Edit, 
  Crown,
  Building2,
  FileText,
  Filter,
  MoreVertical
} from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useBoards } from "@/hooks/useBoards";
import { useDynamicBoards } from "@/hooks/useDynamicBoards";
import { useOrganizations } from "@/hooks/useOrganizations";
import { useBoardPermissions } from "@/hooks/useBoardPermissions";
import { BOARD_TYPES } from "@/api/boardTypes";
import BoardTypeSelector from "./BoardTypeSelector";
import EmptyStates from "./EmptyStates";

interface BoardPreview {
  id: string;
  name: string;
  description?: string;
  type: string;
  owner?: string;
  itemCount?: number;
  lastActivity?: string;
  permission: 'owner' | 'admin' | 'edit' | 'view';
  category: 'my' | 'organization' | 'shared';
  previewData?: any[];
}

const OrgDashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [permissionFilter, setPermissionFilter] = useState<string>('all');
  const [activityFilter, setActivityFilter] = useState<string>('all');
  const [showBoardCreator, setShowBoardCreator] = useState(false);
  const [activeTab, setActiveTab] = useState('my');

  const { boards: regularBoards, loading: regularLoading } = useBoards();
  const { boards: dynamicBoards, loading: dynamicLoading } = useDynamicBoards();
  const { data: organizations } = useOrganizations();

  // Mock data for demonstration - in real app, this would come from APIs
  const boardPreviews: BoardPreview[] = useMemo(() => {
    const allBoards: BoardPreview[] = [];
    
    // Add regular boards
    regularBoards.forEach(board => {
      allBoards.push({
        id: board.id,
        name: board.name,
        description: board.description,
        type: 'regular',
        owner: board.owner_id,
        itemCount: Math.floor(Math.random() * 50) + 1,
        lastActivity: new Date(board.updated_at).toLocaleDateString('he-IL'),
        permission: 'owner', // This would come from actual permissions
        category: board.visibility === 'organization' ? 'organization' : 'my',
        previewData: []
      });
    });

    // Add dynamic boards
    dynamicBoards.forEach(board => {
      allBoards.push({
        id: board.id,
        name: board.name,
        description: board.description,
        type: board.board_type || 'custom',
        itemCount: Math.floor(Math.random() * 30) + 1,
        lastActivity: new Date(board.updated_at).toLocaleDateString('he-IL'),
        permission: 'owner',
        category: 'my',
        previewData: []
      });
    });

    return allBoards;
  }, [regularBoards, dynamicBoards]);

  const filteredBoards = useMemo(() => {
    return boardPreviews.filter(board => {
      const matchesSearch = board.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           board.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesType = typeFilter === 'all' || board.type === typeFilter;
      const matchesPermission = permissionFilter === 'all' || board.permission === permissionFilter;
      const matchesCategory = activeTab === 'all' || board.category === activeTab;
      
      return matchesSearch && matchesType && matchesPermission && matchesCategory;
    });
  }, [boardPreviews, searchQuery, typeFilter, permissionFilter, activeTab]);

  const stats = useMemo(() => {
    const myBoards = boardPreviews.filter(b => b.category === 'my').length;
    const orgBoards = boardPreviews.filter(b => b.category === 'organization').length;
    const sharedBoards = boardPreviews.filter(b => b.category === 'shared').length;
    const totalItems = boardPreviews.reduce((sum, board) => sum + (board.itemCount || 0), 0);
    
    return {
      myBoards,
      orgBoards,
      sharedBoards,
      totalBoards: myBoards + orgBoards + sharedBoards,
      totalItems,
      activeMembers: organizations?.length || 0,
      weeklyActivity: Math.floor(Math.random() * 100) + 50
    };
  }, [boardPreviews, organizations]);

  const getPermissionIcon = (permission: string) => {
    switch (permission) {
      case 'owner': return <Crown className="h-4 w-4" />;
      case 'admin': return <Users className="h-4 w-4" />;
      case 'edit': return <Edit className="h-4 w-4" />;
      default: return <Eye className="h-4 w-4" />;
    }
  };

  const getPermissionLabel = (permission: string) => {
    const labels = {
      owner: 'בעלים',
      admin: 'מנהל',
      edit: 'עורך',
      view: 'צופה'
    };
    return labels[permission as keyof typeof labels] || permission;
  };

  const getBoardTypeInfo = (type: string) => {
    return BOARD_TYPES[type] || { label: type, icon: '📋' };
  };

  if (regularLoading || dynamicLoading) {
    return <EmptyStates type="loading" />;
  }

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard ארגוני</h1>
          <p className="text-gray-600 mt-1">נהל את הבורדים והפרויקטים של הארגון</p>
        </div>
        
        {/* Quick Actions */}
        <div className="flex gap-2">
          <Button variant="outline" className="bg-white">
            <Share2 className="h-4 w-4 mr-2" />
            שתף בורד
          </Button>
          <Button variant="outline" className="bg-white">
            <Users className="h-4 w-4 mr-2" />
            הזמן משתמש
          </Button>
          <Button 
            onClick={() => setShowBoardCreator(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            בורד חדש
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">בורדים פעילים</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalBoards}</div>
            <p className="text-xs text-muted-foreground">
              {stats.myBoards} שלי • {stats.orgBoards} ארגוניים
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">רשומות כולל</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
            <p className="text-xs text-muted-foreground">
              בכל הבורדים
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">חברי ארגון</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeMembers}</div>
            <p className="text-xs text-muted-foreground">
              פעילים
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">פעילות השבוע</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.weeklyActivity}</div>
            <p className="text-xs text-muted-foreground">
              פעולות
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="חפש בורדים..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex flex-wrap gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="סוג בורד" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל הסוגים</SelectItem>
                  {Object.entries(BOARD_TYPES).map(([type, config]) => (
                    <SelectItem key={type} value={type}>
                      {config.icon} {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={permissionFilter} onValueChange={setPermissionFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="הרשאה" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל ההרשאות</SelectItem>
                  <SelectItem value="owner">בעלים</SelectItem>
                  <SelectItem value="admin">מנהל</SelectItem>
                  <SelectItem value="edit">עורך</SelectItem>
                  <SelectItem value="view">צופה</SelectItem>
                </SelectContent>
              </Select>

              <Select value={activityFilter} onValueChange={setActivityFilter}>
                <SelectTrigger className="w-32">
                  <SelectValue placeholder="פעילות" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">כל התקופות</SelectItem>
                  <SelectItem value="today">היום</SelectItem>
                  <SelectItem value="week">השבוע</SelectItem>
                  <SelectItem value="month">החודש</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Board Categories */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="my">הבורדים שלי ({stats.myBoards})</TabsTrigger>
          <TabsTrigger value="organization">בורדים ארגוניים ({stats.orgBoards})</TabsTrigger>
          <TabsTrigger value="shared">שותף איתי ({stats.sharedBoards})</TabsTrigger>
          <TabsTrigger value="all">הכל ({stats.totalBoards})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredBoards.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-500">
                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>לא נמצאו בורדים המתאימים לסינון</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredBoards.map((board) => {
                const typeInfo = getBoardTypeInfo(board.type);
                return (
                  <Card key={board.id} className="hover:shadow-md transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-lg line-clamp-1 flex items-center gap-2">
                            <span className="text-lg">{typeInfo.icon}</span>
                            {board.name}
                          </CardTitle>
                          {board.description && (
                            <p className="text-sm text-gray-500 mt-1 line-clamp-2">
                              {board.description}
                            </p>
                          )}
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Eye className="h-4 w-4 mr-2" />
                              פתח
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Share2 className="h-4 w-4 mr-2" />
                              שתף
                            </DropdownMenuItem>
                            <DropdownMenuItem>
                              <Edit className="h-4 w-4 mr-2" />
                              ערוך
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </CardHeader>
                    
                    <CardContent className="pt-0 space-y-3">
                      {/* Board Preview */}
                      <div className="bg-gray-50 rounded p-3 text-sm">
                        <div className="font-medium text-gray-700 mb-2">תצוגה מקדימה:</div>
                        <div className="space-y-1 text-gray-600">
                          <div>• רשומה דוגמה 1</div>
                          <div>• רשומה דוגמה 2</div>
                          <div>• רשומה דוגמה 3</div>
                        </div>
                      </div>

                      {/* Board Stats */}
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-4">
                          <Badge variant="outline" className="flex items-center gap-1">
                            {getPermissionIcon(board.permission)}
                            {getPermissionLabel(board.permission)}
                          </Badge>
                          <span className="text-gray-500">
                            {board.itemCount} רשומות
                          </span>
                        </div>
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {board.lastActivity}
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </TabsContent>
      </Tabs>

      {/* Board Creator Modal */}
      <BoardTypeSelector 
        isOpen={showBoardCreator}
        onClose={() => setShowBoardCreator(false)}
      />
    </div>
  );
};

export default OrgDashboard;
