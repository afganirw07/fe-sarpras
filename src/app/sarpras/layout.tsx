import Navbar from "@/components/navbar/Navbar/navbar";
import Footer from "@/components/footer";


export default function LandingLayout({
  children,

  
}: {
  children: React.ReactNode;

}) {
  return (
    <>
    <div className="min-h-screen flex flex-col w-full z-20 relative ">
      {/* Navbar */}
      <Navbar/>
      {/* Main Content */}
      <main className="flex-1 w-full flex flex-col">
        {children}
        <Footer/>
      </main>
    </div>
        
    </>
  );
}
