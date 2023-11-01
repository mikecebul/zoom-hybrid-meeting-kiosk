import "./main.css";

function App() {
  const startMeeting = () => {
    window.electronAPI?.startZoomMeeting();
  };

  fetch('http://localhost:3001/test')
    .then(response => response.json())
    .then(data => {
      console.log(data.message)
    })
  return (
    <main className="flex flex-col justify-center items-center h-[100dvh] bg-slate-900 text-slate-100">
      <div className="flex flex-col items-center justify-center select-none">

      <p className="text-xl">Welcome to the</p>
      <h1 className="text-7xl">Serenity House</h1>
      </div>
      <div className="pt-32">
        <button
          onClick={startMeeting}
          className="px-12 py-4 text-3xl font-semibold tracking-wide text-center text-black transition duration-200 ease-in-out bg-orange-500 rounded-lg shadow-lg hover:shadow-xl hover:bg-orange-400 hover:scale-105 focus:outline-none focus:border-orange-400 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
        >
          Start Hybrid Meeting
        </button>
      </div>
    </main>
  );
}

export default App;
