import "./main.css";

function App() {
  return (
    <main className="flex flex-col justify-center items-center h-[100dvh] bg-slate-900 text-slate-100">
      <p>Welcome to the</p>
      <h1 className="text-5xl">Serenity House</h1>
      <div className="pt-32">
        <button
          id="startZoom"
          className="px-6 py-2 text-xl font-semibold tracking-wide text-center text-black transition duration-200 ease-in-out bg-orange-600 rounded-lg shadow-lg hover:shadow-xl hover:bg-orange-500 focus:outline-none focus:border-orange-700 focus:ring focus:ring-orange-200 focus:ring-opacity-50"
        >
          Start Hybrid Meeting
        </button>
      </div>
    </main>
  );
}

export default App;
