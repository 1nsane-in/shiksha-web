"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@repo/ui";
import { ClipboardList, Clock } from "lucide-react";
import { stageNames } from "../student-constants";

interface Props {
  currentStage: number;
}

export function StudentTimeline({ currentStage }: Props) {
  return (
    <Card className="border-[#ECEAE6] bg-[#FAFAF8]">
      <CardHeader>
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <ClipboardList className="h-4 w-4" />
          Admission Stage Progress
        </CardTitle>
        <CardDescription>Visual tracker of student workflow steps.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative border-l-2 border-[#ECEAE6] ml-4 pl-6 space-y-6">
          {[1, 2, 3, 4, 5].map((step) => {
            const isCurrent = currentStage === step;
            const isPassed = currentStage > step;
            return (
              <div key={step} className="relative">
                <span
                  className={`absolute -left-[31px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full border transition-all ${
                    isPassed
                      ? "bg-green-600 border-green-600 text-white"
                      : isCurrent
                      ? "bg-[#3730A3] border-[#3730A3] text-white animate-pulse"
                      : "bg-white border-gray-300 text-gray-400"
                  }`}
                  style={{ fontSize: 9, fontWeight: 700 }}
                >
                  {isPassed ? "✓" : step}
                </span>
                <div>
                  <h4 className={`text-sm font-semibold ${isCurrent ? "text-[#3730A3]" : isPassed ? "text-green-700" : "text-gray-500"}`}>
                    Stage {step}: {stageNames[step]}
                  </h4>
                  {isCurrent && (
                    <p className="text-xs text-gray-400 mt-1 font-medium flex items-center gap-1">
                      <Clock className="h-3 w-3 text-[#3730A3]" /> Current active state of student.
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
