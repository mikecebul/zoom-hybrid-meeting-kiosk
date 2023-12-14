import { MoreOptions } from "./components/more-options";
import { ThemeProvider } from "./components/theme-provider";
import { Button } from "./components/ui/button";
import "./main.css";

function App() {
  const startMeeting = () => {
    window.electronAPI?.startZoomMeeting();
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
          <Button variant="meeting" size="xl" onClick={startMeeting}>
            Start Hybrid Meeting
          </Button>
        </div>
      </main>
    </ThemeProvider>
  );
}

export default App;
