"use client";

import { Card, CardContent, CardHeader, CardTitle, Badge } from "@/ui";

interface Props {
  applications: Array<{ id: string; university?: { name: string; shortName?: string }; status: string }> | undefined;
}

export function StudentUniversitiesCard({ applications }: Props) {
  const count = applications?.length ?? 0;

  return (
    <Card className="border-slate-200 bg-white">
      <CardHeader>
        <CardTitle className="text-sm font-bold uppercase tracking-wider text-slate-500">
          Applied Universities ({count})
        </CardTitle>
      </CardHeader>
      <CardContent>
        {count > 0 ? (
          <div className="space-y-3">
            {applications!.map((app) => (
              <div key={app.id} className="p-3 bg-white border border-slate-200 rounded-xl flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-bold text-navy">{app.university?.name}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">{app.university?.shortName || "Matched university"}</p>
                </div>
                <Badge className="text-[9px] uppercase font-bold bg-blue-50 text-blue-700 border border-blue-100">
                  {app.status}
                </Badge>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 text-center py-4">No universities assigned yet.</p>
        )}
      </CardContent>
    </Card>
  );
}
