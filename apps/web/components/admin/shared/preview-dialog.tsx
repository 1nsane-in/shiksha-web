"use client";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  fileUrl: string | null;
  fileName?: string | null;
}

export function PreviewDialog({ isOpen, onClose, fileUrl, fileName }: Props) {
  if (!isOpen || !fileUrl) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
      <div className="relative bg-white rounded-xl border border-border w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4 bg-zinc-50">
          <div>
            <h3 className="text-sm font-semibold text-navy tracking-tight">
              Document Preview
            </h3>
            {fileName && (
              <p className="text-xs text-slate-600 mt-0.5 truncate max-w-[500px]">
                {fileName}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="rounded-lg border border-border bg-white px-3 py-1.5 text-xs font-semibold text-navy hover:bg-zinc-50 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

        <div className="flex-1 p-4 bg-zinc-100 min-h-[500px] flex items-center justify-center">
          <iframe
            src={fileUrl}
            title="Document Preview"
            className="w-full h-[65vh] border border-border rounded-lg bg-white shadow-inner"
          />
        </div>
      </div>
    </div>
  );
}
