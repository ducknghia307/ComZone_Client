import Navbar from "./components/navbar/Navbar";
import AppRouter from "./components/appRouter/AppRouter";
import Footer from "./components/footer/Footer";

function App() {
  return (
    <div className="w-full min-h-screen flex flex-col justify-between ">
      <Navbar />
      <div className="grow">
        <AppRouter />
      </div>
      <Footer />
    </div>
  );
}

export default App;
