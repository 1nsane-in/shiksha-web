"use client";

import { useEffect, useState } from "react";
import { Label } from "@repo/ui";
// ponytail: native checkbox + range input over missing shadcn Switch/Slider
import { 
  Video, 
  Mic, 
  Monitor, 
  Eye, 
  MousePointer, 
  AlertTriangle,
  Shield,
  Wifi
} from "lucide-react";
import { useProctoringConfig, useUpdateProctoringConfig } from "@/domains/exams/exams.queries";
import type { ProctoringConfig } from "@/domains/exams/exams.types";

interface Props {
  examId: string;
  data?: Partial<ProctoringConfig>;
  onChange: (data: Partial<ProctoringConfig>) => void;
}

const DEFAULT_CONFIG: ProctoringConfig = {
  aiProctoringEnabled: true,
  webcamRequired: true,
  microphoneRequired: true,
  screenRecordingEnabled: true,
  faceDetectionEnabled: true,
  gazeTrackingEnabled: true,
  tabSwitchWarnings: 3,
  autoSubmitOnViolation: false,
  connectivityGraceMinutes: 2,
};

export function ProctoringStep({ examId, data, onChange }: Props) {
  const [config, setConfig] = useState<ProctoringConfig>({
    ...DEFAULT_CONFIG,
    ...data,
  });

  const { data: savedConfig } = useProctoringConfig(examId);
  const updateConfig = useUpdateProctoringConfig(examId);

  // Load saved config
  useEffect(() => {
    if (savedConfig) {
      setConfig(savedConfig);
      onChange(savedConfig);
    }
  }, [savedConfig]);

  // Auto-save on change
  useEffect(() => {
    const timeout = setTimeout(() => {
      updateConfig.mutate(config);
      onChange(config);
    }, 500);
    return () => clearTimeout(timeout);
  }, [config]);

  const handleToggle = (field: keyof ProctoringConfig) => {
    setConfig((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSliderChange = (field: keyof ProctoringConfig, value: number) => {
    setConfig((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const features = [
    {
      id: "aiProctoringEnabled",
      label: "AI Proctoring",
      description: "Enable AI-powered proctoring to detect suspicious behavior",
      icon: Shield,
    },
    {
      id: "webcamRequired",
      label: "Require Webcam",
      description: "Student must have camera enabled throughout the exam",
      icon: Video,
    },
    {
      id: "microphoneRequired",
      label: "Require Microphone",
      description: "Audio monitoring to detect suspicious sounds",
      icon: Mic,
    },
    {
      id: "screenRecordingEnabled",
      label: "Screen Recording",
      description: "Record student's screen during the exam",
      icon: Monitor,
    },
    {
      id: "faceDetectionEnabled",
      label: "Face Detection",
      description: "Verify student identity and detect multiple faces",
      icon: Eye,
    },
    {
      id: "gazeTrackingEnabled",
      label: "Gaze Tracking",
      description: "Detect if student is looking away from screen",
      icon: MousePointer,
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-medium text-[#111111]">Proctoring Settings</h2>
        <p className="text-sm text-[#626260]">
          Configure security measures to prevent cheating during online exams.
        </p>
      </div>

      {/* AI Proctoring Master Toggle */}
      <div className="bg-[#f5f1ec] rounded-lg p-4 border border-[#d3cec6]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-[#111111] flex items-center justify-center">
              <Shield className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="font-medium text-[#111111]">AI Proctoring</h3>
              <p className="text-sm text-[#626260]">Master control for all proctoring features</p>
            </div>
          </div>
          <label className="relative inline-flex h-5 w-9 cursor-pointer items-center">
            <input type="checkbox" checked={config.aiProctoringEnabled} onChange={() => handleToggle("aiProctoringEnabled")} className="peer sr-only" />
            <span className="peer h-5 w-9 rounded-full bg-[#ebe7e1] after:absolute after:start-[3px] after:top-[3px] after:h-[14px] after:w-[14px] after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:bg-[#111111] peer-checked:after:translate-x-4" />
          </label>
        </div>
      </div>

      {/* Feature Toggles */}
      <div className={`space-y-4 ${!config.aiProctoringEnabled ? "opacity-50 pointer-events-none" : ""}`}>
        <h3 className="text-sm font-medium text-[#111111] uppercase tracking-wide">
          Security Features
        </h3>
        
        <div className="grid gap-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            const isEnabled = config[feature.id as keyof ProctoringConfig] as boolean;
            
            return (
              <div
                key={feature.id}
                className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#ebe7e1] hover:border-[#d3cec6] transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                    isEnabled ? "bg-[#111111]" : "bg-[#ebe7e1]"
                  }`}>
                    <Icon className={`h-5 w-5 ${isEnabled ? "text-white" : "text-[#626260]"}`} />
                  </div>
                  <div>
                    <h4 className="font-medium text-[#111111]">{feature.label}</h4>
                    <p className="text-sm text-[#626260]">{feature.description}</p>
                  </div>
                </div>
                <label className="relative inline-flex h-5 w-9 cursor-pointer items-center">
                  <input type="checkbox" checked={isEnabled} onChange={() => handleToggle(feature.id as keyof ProctoringConfig)} disabled={!config.aiProctoringEnabled} className="peer sr-only" />
                  <span className="peer h-5 w-9 rounded-full bg-[#ebe7e1] after:absolute after:start-[3px] after:top-[3px] after:h-[14px] after:w-[14px] after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:bg-[#111111] peer-checked:after:translate-x-4 peer-disabled:opacity-50" />
                </label>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Settings */}
      <div className={`space-y-6 ${!config.aiProctoringEnabled ? "opacity-50 pointer-events-none" : ""}`}>
        <h3 className="text-sm font-medium text-[#111111] uppercase tracking-wide">
          Security Settings
        </h3>

        {/* Tab Switch Warnings */}
        <div className="bg-white rounded-lg border border-[#ebe7e1] p-4">
          <div className="flex items-center gap-3 mb-3">
            <AlertTriangle className="h-5 w-5 text-amber-500" />
            <div>
              <h4 className="font-medium text-[#111111]">Tab Switch Warnings</h4>
              <p className="text-sm text-[#626260]">
                Number of warnings before action is taken
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="range"
              value={config.tabSwitchWarnings}
              onChange={(e) => handleSliderChange("tabSwitchWarnings", Number(e.target.value))}
              min={0}
              max={10}
              step={1}
              className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-[#ebe7e1] accent-[#111111]"
            />
            <span className="w-12 text-center font-medium text-[#111111]">
              {config.tabSwitchWarnings}
            </span>
          </div>
          <p className="text-xs text-[#9c9fa5] mt-2">
            Set to 0 to disable warnings and take immediate action
          </p>
        </div>

        {/* Connectivity Grace Period */}
        <div className="bg-white rounded-lg border border-[#ebe7e1] p-4">
          <div className="flex items-center gap-3 mb-3">
            <Wifi className="h-5 w-5 text-blue-500" />
            <div>
              <h4 className="font-medium text-[#111111]">Connectivity Grace Period</h4>
              <p className="text-sm text-[#626260]">
                Time allowed to reconnect after connection loss
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="range"
              value={config.connectivityGraceMinutes}
              onChange={(e) => handleSliderChange("connectivityGraceMinutes", Number(e.target.value))}
              min={1}
              max={10}
              step={1}
              className="flex-1 h-2 rounded-lg appearance-none cursor-pointer bg-[#ebe7e1] accent-[#111111]"
            />
            <span className="w-16 text-center font-medium text-[#111111]">
              {config.connectivityGraceMinutes} min
            </span>
          </div>
        </div>

        {/* Auto Submit on Violation */}
        <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-[#ebe7e1]">
          <div className="flex items-center gap-3">
            <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
              config.autoSubmitOnViolation ? "bg-red-100" : "bg-[#ebe7e1]"
            }`}>
              <AlertTriangle className={`h-5 w-5 ${
                config.autoSubmitOnViolation ? "text-red-600" : "text-[#626260]"
              }`} />
            </div>
            <div>
              <h4 className="font-medium text-[#111111]">Auto-submit on Critical Violation</h4>
              <p className="text-sm text-[#626260]">
                Automatically submit exam if critical violation detected
              </p>
            </div>
          </div>
          <label className="relative inline-flex h-5 w-9 cursor-pointer items-center">
            <input type="checkbox" checked={config.autoSubmitOnViolation} onChange={() => handleToggle("autoSubmitOnViolation")} className="peer sr-only" />
            <span className="peer h-5 w-9 rounded-full bg-[#ebe7e1] after:absolute after:start-[3px] after:top-[3px] after:h-[14px] after:w-[14px] after:rounded-full after:bg-white after:shadow-sm after:transition-all peer-checked:bg-red-600 peer-checked:after:translate-x-4" />
          </label>
        </div>
      </div>

      {/* Info Banner */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <h4 className="text-sm font-medium text-blue-900 mb-1">
          Student Requirements
        </h4>
        <p className="text-sm text-blue-700">
          Students will need: Desktop/Laptop with webcam, microphone, stable internet 
          (2+ Mbps), and a modern browser (Chrome/Firefox/Edge). Mobile devices are not supported.
        </p>
      </div>
    </div>
  );
}
