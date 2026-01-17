
export default function Sarpras(){
    return(
        <>
        <section className=" relative w-full h-screen bg-Background1 flex justify-center items-center py-10 lg:px-20 2xl:px-32 md:px-10 px-6 ">

            {/* mesh bg */}
            <div className="absolute bg-BgMesh lg:w-[900px] lg:h-[400px] w-[500px] h-[200px] rounded-full lg:-top-[20%] -top-[5%] blur-3xl opacity-65 z-10 "> </div>

        <div className="flex flex-col items-center gap-6 ">
            <div className="py-2 px-4 w-fit  rounded-2xl bg-linear-to-b from-BgMesh to-Background1 border-2 border-[#202065] font-quicksand" >
                <p className=" bg-linear-to-r from-blue-300 to-cyan-500 font-semibold md:text-base text-xs bg-clip-text text-transparent  " >SMK Taruna Bhakti Depok</p>
            </div>

            <div className="lg:max-w-[1000px] text-center flex flex-col gap-2">
                <h1 className="text-White text-6xl font-figtree font-semibold">Sarana dan Prasarana Sekolah  </h1>
                <h1 className="text-White text-6xl font-figtree font-semibold">consectetur adipisicing elitdjajdadja  </h1>
            </div>  
        </div>
        </section>
        </>
    )
}