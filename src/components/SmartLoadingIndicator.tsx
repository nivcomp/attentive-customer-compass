
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Loader2, BarChart3, Users, Building2, Layers } from "lucide-react";

interface LoadingStage {
  stage: 'stats' | 'regular' | 'dynamic' | 'custom' | 'complete';
  progress: number;
  message: string;
}

interface SmartLoadingIndicatorProps {
  loadingStage: LoadingStage;
}

const SmartLoadingIndicator = React.memo<SmartLoadingIndicatorProps>(({ loadingStage }) => {
  const getStageIcon = (stage: string) => {
    switch (stage) {
      case 'stats':
        return <BarChart3 className="h-5 w-5 text-blue-600" />;
      case 'regular':
        return <Users className="h-5 w-5 text-green-600" />;
      case 'dynamic':
        return <Building2 className="h-5 w-5 text-purple-600" />;
      case 'custom':
        return <Layers className="h-5 w-5 text-orange-600" />;
      default:
        return <Loader2 className="h-5 w-5 text-gray-600 animate-spin" />;
    }
  };

  const getStageSteps = () => {
    const steps = [
      { key: 'stats', label: 'סטטיסטיקות', completed: loadingStage.progress >= 25 },
      { key: 'regular', label: 'בורדים רגילים', completed: loadingStage.progress >= 50 },
      { key: 'dynamic', label: 'בורדים דינמיים', completed: loadingStage.progress >= 75 },
      { key: 'custom', label: 'בורדים מותאמים', completed: loadingStage.progress >= 100 },
    ];
    return steps;
  };

  if (loadingStage.stage === 'complete') {
    return null;
  }

  return (
    <Card className="w-full">
      <CardContent className="p-6">
        <div className="space-y-4">
          {/* Progress Header */}
          <div className="flex items-center gap-3">
            {getStageIcon(loadingStage.stage)}
            <div className="flex-1">
              <h3 className="font-medium text-gray-900">טוען נתוני בורדים</h3>
              <p className="text-sm text-gray-600">{loadingStage.message}</p>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={loadingStage.progress} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>{loadingStage.progress}% הושלם</span>
              <span>טוען...</span>
            </div>
          </div>

          {/* Stage Steps */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {getStageSteps().map((step) => (
              <div
                key={step.key}
                className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                  step.completed
                    ? 'bg-green-50 text-green-700'
                    : loadingStage.stage === step.key
                    ? 'bg-blue-50 text-blue-700'
                    : 'bg-gray-50 text-gray-500'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    step.completed
                      ? 'bg-green-500'
                      : loadingStage.stage === step.key
                      ? 'bg-blue-500 animate-pulse'
                      : 'bg-gray-300'
                  }`}
                />
                <span className="text-xs font-medium">{step.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

SmartLoadingIndicator.displayName = 'SmartLoadingIndicator';

export default SmartLoadingIndicator;
