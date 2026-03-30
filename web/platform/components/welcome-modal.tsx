import * as React from 'react';

import { useAuth } from '~/platform/lib/auth';
import { Button } from '~/shared/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from '~/shared/components/ui/dialog';

const SESSION_KEY = 'tw_welcome_seen';

export function WelcomeModal() {
  const { isLoggedIn } = useAuth();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    if (isLoggedIn) {
      setOpen(false);
      return;
    }
    if (!sessionStorage.getItem(SESSION_KEY)) {
      setOpen(true);
    }
  }, [isLoggedIn]);

  function handleDismiss() {
    sessionStorage.setItem(SESSION_KEY, '1');
    setOpen(false);
    window.dispatchEvent(new CustomEvent('welcome-dismissed'));
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(o) => {
        if (!o) handleDismiss();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="max-w-xs gap-0 overflow-hidden bg-white p-0"
      >
        <div className="flex flex-col items-start gap-4 p-6">
          <div className="flex w-full justify-center">
            <div className="w-[256px] shrink-0 overflow-hidden rounded-2xl bg-slate-1">
              <video
                src="/video-onboarding.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="h-full w-full object-cover"
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <DialogTitle className="text-base leading-snug font-semibold">
                Welcome to Teacher Workspace
              </DialogTitle>
              <span className="shrink-0 rounded-full bg-twblue-3 px-1.5 py-0.5 text-xs font-medium text-twblue-9">
                Beta
              </span>
            </div>
            <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
              One place for all your tools built for teachers, designed to save time and keep
              everything within reach.
            </DialogDescription>
            <DialogDescription className="text-sm leading-relaxed text-muted-foreground">
              Early access for selected teachers. Share your thoughts via the{' '}
              <strong className="font-medium text-foreground">Help</strong> icon in the sidebar.
            </DialogDescription>
          </div>

          <div className="flex w-full items-start justify-end">
            <Button className="w-fit" onClick={handleDismiss}>
              Get started
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
