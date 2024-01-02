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

  function meetingFailedToast() {
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "Please try again.",
    });
  }

  const startBODZoomMeeting = async () => {
    setIsLoading(true);
    const meetingStarted = await window.electronAPI?.startBODZoomMeeting();
    if (meetingStarted) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
      meetingFailedToast();
    }
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
