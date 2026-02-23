import Link from "next/link";

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#F4F6F8]er flex flex-col items-center justify-center text-center px-6">
            <h1 className="text-[14rem] font-['Bebas_Neue'] text-saffron/20 leading-none select-none">
                404
            </h1>
            <h2 className="text-4xl md:text-6xl font-['Bebas_Neue'] text-slate-900 tracking-widest -mt-10 mb-4">
                Page Not Found
            </h2>
            <p className="text-slate-600 font-['DM_Sans'] max-w-md mb-8 text-lg">
                The page you are looking for does not exist or has been moved.
            </p>
            <Link
                href="/"
                className="bg-saffron hover:bg-saffron/80 text-white px-8 py-3 rounded-full font-bold transition-all shadow-lg shadow-saffron/20"
            >
                Return Home
            </Link>
        </div>
    );
}
