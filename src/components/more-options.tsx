import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Loader2, MoreVertical } from "lucide-react";
import { Tv2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "./ui/use-toast";

export function MoreOptions({ className }: { className: string }) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  // const startBODZoomMeeting = () => {
  //   setIsLoading(true);
  //   window.electronAPI?.startBODZoomMeeting();
  //   window.electronAPI?.onBODZoomMeetingStarted(() => {
  //     setIsLoading(false);
  //   });

    // window.electronAPI?.onZoomMeetingFailed(() => {
    //   setIsLoading(false);
    //   toast({
    //     variant: "destructive",
    //     title: "Uh oh! Something went wrong.",
    //     description: "Please try again.",
    //   });
    // });
  // };
  const handleMeetingStart = () => {
    setIsLoading(false);
    // Remove both listeners
    window.electronAPI?.removeBODZoomMeetingStartedListener(handleMeetingStart);
    window.electronAPI?.removeBODZoomMeetingFailedListener(handleMeetingFailed);
  };

  const handleMeetingFailed = () => {
    setIsLoading(false);
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "Please try again.",
    });
    // Remove both listeners
    window.electronAPI?.removeZoomMeetingStartedListener(handleMeetingStart);
    window.electronAPI?.removeZoomMeetingFailedListener(handleMeetingFailed);
  };

  const startBODZoomMeeting = () => {
    setIsLoading(true);
    window.electronAPI?.startBODZoomMeeting();
    window.electronAPI?.onBODZoomMeetingStarted(handleMeetingStart);
    window.electronAPI?.onZoomMeetingFailed(handleMeetingFailed);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className={className}>
        <Button variant="outline" size="icon">
          <MoreVertical />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>More Options</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={startBODZoomMeeting}>
          <Tv2 className="w-4 h-4 mr-2" />
          <span>
            {isLoading ? <Loader2 className="w-4 h-4" /> : "Start BOD Meeting"}
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
