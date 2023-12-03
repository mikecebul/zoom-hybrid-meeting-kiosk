import { ThemeProvider } from "./components/theme-provider";
import { Button } from "./components/ui/button";
import "./main.css";

function App() {
  const startMeeting = () => {
    window.electronAPI?.startZoomMeeting();
  };

  fetch("http://localhost:3001/test")
    .then((response) => response.json())
    .then((data) => {
      console.log(data.message);
    });
  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-them">
      <main className="flex flex-col justify-center items-center h-[100dvh] bg-background">
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
          {/* <button className="px-12 py-4 text-3xl font-semibold tracking-wide text-center text-black transition duration-200 ease-in-out bg-orange-500 rounded-lg shadow-lg lg:py-8 lg:text-6xl lg:px-24 hover:shadow-xl hover:bg-orange-400 hover:scale-105 focus:outline-none focus:border-orange-400 focus:ring focus:ring-orange-200 focus:ring-opacity-50">
            Start Hybrid Meeting
          </button> */}
        </div>
      </main>
    </ThemeProvider>
  );
}

export default App;
