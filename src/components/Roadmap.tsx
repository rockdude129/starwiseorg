import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Check, Star, Lock } from 'lucide-react';

export interface RoadmapLesson {
  id: number;
  title: string;
  completed: boolean;
  current: boolean;
  locked: boolean;
}

interface RoadmapProps {
  units: { name: string; lessons: RoadmapLesson[] }[];
  activeUnit: number;
  onUnitChange: (unitIdx: number) => void;
  onLessonClick: (lessonId: number) => void;
}

const Roadmap: React.FC<RoadmapProps> = ({ units, activeUnit, onUnitChange, onLessonClick }) => {
  const currentLessons = units[activeUnit]?.lessons || [];

  return (
    <Card className="bg-white/5 backdrop-blur-xl border-white/10 shadow-xl p-4 w-full max-w-2xl mx-auto">
      {/* Unit Tabs */}
      <Tabs value={`unit-${activeUnit}`} onValueChange={val => onUnitChange(Number(val.replace('unit-', '')))}>
        <TabsList className="flex mb-4">
          {units.map((unit, idx) => (
            <TabsTrigger key={unit.name} value={`unit-${idx}`}>{unit.name}</TabsTrigger>
          ))}
        </TabsList>
        {units.map((unit, idx) => (
          <TabsContent key={unit.name} value={`unit-${idx}`}> {/* Roadmap Path */}
            <div className="overflow-x-auto max-h-72 pr-2 w-full">
              <div className="flex flex-col items-center relative min-h-[300px] w-full">
                {unit.lessons.map((lesson, i) => (
                  <React.Fragment key={lesson.id}>
                    {/* Connector line */}
                    {i > 0 && (
                      <div className="w-1 h-8 bg-gradient-to-b from-blue-400 to-purple-400 opacity-40" />
                    )}
                    {/* Node */}
                    <button
                      className={`relative z-10 w-20 h-20 rounded-full flex items-center justify-center mb-2 border-4 transition-all duration-200
                        ${lesson.completed ? 'bg-green-500/80 border-green-400 shadow-lg' :
                          lesson.current ? 'bg-blue-500/80 border-blue-400 shadow-lg' :
                          lesson.locked ? 'bg-gray-400/40 border-gray-300' :
                          'bg-white/10 border-white/20'}
                        hover:scale-105
                      `}
                      disabled={lesson.locked}
                      onClick={() => onLessonClick(lesson.id)}
                      title={lesson.title}
                    >
                      {lesson.completed ? (
                        <Check className="w-10 h-10 text-white" />
                      ) : lesson.current ? (
                        <Star className="w-10 h-10 text-yellow-300" />
                      ) : lesson.locked ? (
                        <Lock className="w-10 h-10 text-gray-200" />
                      ) : (
                        <Star className="w-10 h-10 text-blue-200" />
                      )}
                      <span className="absolute left-full ml-4 w-40 text-left text-white text-base font-medium whitespace-nowrap">
                        {lesson.title}
                      </span>
                    </button>
                  </React.Fragment>
                ))}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </Card>
  );
};

export default Roadmap; 