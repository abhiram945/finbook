import React from "react";

const Home = () => {
  return (
    <div className="h-auto p-4 bg-gradient-to-b from-black to-gray-900 text-white">
      <section className="text-center px-4">
        <h2 className="text-4xl md:text-6xl font-bold">Do more with <span className="text-blue-600">Finbook</span> App</h2>
        <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
          Track, manage and optimize your finances with ease
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button className="bg-blue-600 px-6 py-3 rounded-lg text-white cursor-pointer hover:bg-blue-700">Download App</button>
        </div>
        <div className="flex justify-center items-center gap-8 mt-16">
          {[2, 3, 4].map((number, index) => <div key={index} className={`w-70 h-max p-1 bg-gray-800 rounded-xl overflow-hidden ${number === 3 && "w-75"}`}>
            <img className="rounded-xl" src={`/assets/hero/finbook${number}.jpg`} alt={`finbook${number}`} />
          </div>)}
        </div>
        <div className="py-24">
          <h2 className="text-4xl font-medium">Secured with Google-Sign-in</h2>
          <h2 className="text-5xl mt-2 font-medium">Your Data is safe in your G-Drive</h2>
          <div className="flex justify-center items-center gap-8 mt-16">
            {[1, 5].map((number, index) =><div key={index}>
              {number===5 && <p className="mb-2 text-xl font-semibold text-wrap">Backup and Recover your data</p>}
              <div className={`w-[20vw] ${number === 5 ? "h-[35vh]" : "h-auto"} p-1 bg-gray-800 rounded-xl overflow-hidden`}>
                <img className={`w-full h-full rounded-xl ${number === 5 ? "object-cover object-bottom" : ""}`}
                  src={`/assets/hero/finbook${number}.jpg`}
                  alt={`finbook${number}`}
                />
              </div></div>
            )}
          </div>
        </div>

      </section>
    </div>
  );
};

export default Home;