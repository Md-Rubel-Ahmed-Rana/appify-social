"use client";

import { Loader2, ServerCrash } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

type Props = {
  open: boolean;
  onClose: () => void;
  onRetry?: () => void;
};

export default function RenderColdStartDialog({
  open,
  onClose,
  onRetry,
}: Props) {
  return (
    <Dialog open={open}>
      <DialogContent
        showCloseButton={false}
        className="max-w-md overflow-hidden rounded-2xl border-0 bg-linear-to-br from-slate-900 via-slate-800 to-slate-900 p-0 text-white"
      >
        <div className="relative p-8">
          <div className="absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-blue-500/20 blur-3xl" />

          <div className="relative flex flex-col items-center">
            <div className="mb-5 rounded-full bg-blue-500/15 p-5">
              <ServerCrash className="size-8 text-blue-400" />
            </div>

            <h2 className="text-2xl font-bold">Waking up the server</h2>

            <p className="mt-3 text-center text-sm leading-6 text-slate-300">
              This project is deployed on
              <span className="font-semibold text-white">
                {" "}
                Render Free Plan
              </span>
              .
              <br />
              <span>After inactivity the server sleeps and needs around</span>
              <span className="font-semibold text-blue-400 px-1">
                30–60 seconds
              </span>
              <span>to start again.</span>
            </p>

            <div className="mt-8 flex items-center gap-3 rounded-full bg-slate-700/60 px-5 py-3">
              <Loader2 className="size-5 animate-spin text-blue-400" />
              <span className="font-medium">Starting backend...</span>
            </div>

            <div className="mt-8 h-2 w-full overflow-hidden rounded-full bg-slate-700">
              <div className="h-full w-1/3 animate-loading rounded-full bg-blue-500" />
            </div>

            <div className="mt-8 flex w-full gap-3">
              <Button variant="secondary" className="flex-1" onClick={onRetry}>
                Retry
              </Button>

              <Button className="flex-1" onClick={onClose}>
                Continue
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
