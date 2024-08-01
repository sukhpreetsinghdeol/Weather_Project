import Link from "next/link";
import WeatherComponent from "./components/WeatherComponent";


export default function Home() {
  return (

    <main className= "h-screen"> 
       <WeatherComponent />
    </main>
  );
}
