import { useState } from "react";
import { MoreOptions } from "./components/more-options";
import { ThemeProvider } from "./components/theme-provider";
import { Button } from "./components/ui/button";
import { Loader2 } from "lucide-react";
import "./main.css";
import { Toaster } from "./components/ui/toaster";
import { useToast } from "./components/ui/use-toast";

function App() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { toast } = useToast();

  function meetingFailedToast() {
    setIsLoading(false);
    toast({
      variant: "destructive",
      title: "Uh oh! Something went wrong.",
      description: "Please try again.",
    });
  }

  const startMeeting = async () => {
    setIsLoading(true);
    const meetingStarted = await window.electronAPI?.startZoomMeeting();
    if (meetingStarted) {
      setIsLoading(false);
    } else {
      setIsLoading(false);
      meetingFailedToast();
    }
  };

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-them">
      <main className="flex flex-col justify-center items-center h-[100dvh] bg-background">
        <MoreOptions className="absolute top-10 right-10" />
        <div className="flex flex-col items-center justify-center select-none">
          <p className="text-3xl tracking-tight lg:text-6xl">Welcome to the</p>
          <h1 className="text-6xl font-medium tracking-tight lg:text-9xl">
            Serenity House
          </h1>
        </div>
        <div className="pt-16 lg:pt-32">
          <Button
            disabled={isLoading}
            variant="meeting"
            size="xl"
            onClick={startMeeting}
          >
            {isLoading ? <Loader2 className="animate-spin"/> : "Start Hybrid Meeting"}
          </Button>
        </div>
      </main>
      <Toaster />
    </ThemeProvider>
  );
}

export default App;
