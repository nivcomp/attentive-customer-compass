
import React, { Suspense } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import BoardManagerStats from "./BoardManagerStats";
import RegularBoardsList from "./RegularBoardsList";
import { useOptimizedPermissions } from "@/hooks/useOptimizedPermissions";

interface ProgressiveBoardSectionProps {
  isStatsReady: boolean;
  isRegularBoardsReady: boolean;
  isDynamicBoardsReady: boolean;
  isCustomBoardsReady: boolean;
  boardStats: {
    totalBoards: number;
    regularBoardsCount: number;
    dynamicBoardsCount: number;
    customBoardsCount: number;
  };
  regularBoards: any[];
  dynamicBoards: any[];
  groupBoardsByType: Record<string, any[]>;
  deleteBoardSettings: (boardId: string) => void;
  getBoardTypeLabel: (type: string) => string;
}

const ProgressiveBoardSection = React.memo<ProgressiveBoardSectionProps>(({
  isStatsReady,
  isRegularBoardsReady,
  isDynamicBoardsReady,
  isCustomBoardsReady,
  boardStats,
  regularBoards,
  dynamicBoards,
  groupBoardsByType,
  deleteBoardSettings,
  getBoardTypeLabel,
}) => {
  const {
    selectedBoardForPermissions,
    handleTogglePermissions,
  } = useOptimizedPermissions();

  return (
    <div className="space-y-6">
      {/* Stats Section - Shows immediately when ready */}
      {isStatsReady ? (
        <BoardManagerStats
          totalBoards={boardStats.totalBoards}
          regularBoardsCount={boardStats.regularBoardsCount}
          dynamicBoardsCount={boardStats.dynamicBoardsCount}
          customBoardsCount={boardStats.customBoardsCount}
        />
      ) : (
        <StatsLoadingSkeleton />
      )}

      {/* Regular Boards Section */}
      {isRegularBoardsReady ? (
        <RegularBoardsList
          boards={regularBoards}
          selectedBoardForPermissions={selectedBoardForPermissions}
          onTogglePermissions={handleTogglePermissions}
        />
      ) : (
        <SectionLoadingSkeleton title="בורדים רגילים" />
      )}

      {/* Board Permissions Manager - Only show if there's a selected board */}
      {selectedBoardForPermissions && (
        <Suspense fallback={<div className="animate-pulse h-32 bg-gray-100 rounded"></div>}>
          <Card>
            <CardHeader>
              <CardTitle>מנהל הרשאות</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4 text-gray-500">
                טוען מנהל הרשאות...
              </div>
            </CardContent>
          </Card>
        </Suspense>
      )}

      {/* Custom Boards Section - Virtualized */}
      {isCustomBoardsReady ? (
        <Suspense fallback={<div className="animate-pulse h-32 bg-gray-100 rounded"></div>}>
          <div className="space-y-6">
            {Object.keys(groupBoardsByType).length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>בורדים מותאמים</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-4 text-gray-500">
                    טוען בורדים מותאמים...
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </Suspense>
      ) : (
        <SectionLoadingSkeleton title="בורדים מותאמים" />
      )}
    </div>
  );
});

// Loading skeleton components
const StatsLoadingSkeleton = React.memo(() => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
    {[1, 2, 3, 4].map(i => (
      <Card key={i}>
        <CardHeader className="pb-2">
          <Skeleton className="h-4 w-24" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-8 w-16 mb-2" />
          <Skeleton className="h-3 w-20" />
        </CardContent>
      </Card>
    ))}
  </div>
));

const SectionLoadingSkeleton = React.memo<{ title: string }>(({ title }) => (
  <Card>
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="space-y-3">
        {[1, 2, 3].map(i => (
          <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-32" />
              <div className="flex gap-2">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-5 w-20" />
              </div>
            </div>
            <div className="flex gap-2">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-8" />
            </div>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
));

StatsLoadingSkeleton.displayName = 'StatsLoadingSkeleton';
SectionLoadingSkeleton.displayName = 'SectionLoadingSkeleton';
ProgressiveBoardSection.displayName = 'ProgressiveBoardSection';

export default ProgressiveBoardSection;
