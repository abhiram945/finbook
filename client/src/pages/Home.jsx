import React, { useEffect, useState } from "react";

const Home = () => {

  const [apkUrl, setApkUrl] = useState("universal");
  const universalApkUrl = "https://drive.google.com/uc?id=1qCPSPKE3n6xe4Y9r0rBXATWgDIydzZG6&export=download"
  function getAndroidCpuArchitecture() {
    const platform = navigator.platform.toLowerCase();
    if (!platform.includes("linux")) {
      return "universal";
    }
    if (platform.includes("armv8") || platform.includes("aarch64") || platform.includes("arm64")) {
      return "arm64-v8a";
    } else if (platform.includes("arm")) {
      return "armeabi-v7a";
    } else if (platform.includes("x86_64")) {
      return "x86_64";
    } else if (platform.includes("x86")) {
      return "x86";
    }
    return "universal";
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
            entry.target.style.transitionDuration = `400ms`;
            entry.target.style.transitionDelay = `${Number(entry.target.dataset.delay) || 150}ms`;
          }
        });
      },
      { threshold: 0.1 }
    );
    const elements = document.querySelectorAll(".animate");
    elements.forEach((element) => {
      observer.observe(element);
    });
    const apkType = getAndroidCpuArchitecture();
    let url = ""
    if(apkType==="universal"){
      url = universalApkUrl
    }else{
      url = `/assets/app/finbook-${apkType}.apk`
    }
    setApkUrl(url)
    return () => observer.disconnect();
  }, []);

  const webv1Descriptions = [
    "Sign-in/sign-up authentication",
    "Adding new person",
    "User workspace",
    "User dashboard",
    "Admin dashboard (sensitive info masked)",
  ];
  const webv2Descriptions = [
    "Sign-in/sign-up authentication",
    "User workspace",
    "User dashboard",
    "Admin dashboard",
  ];

  return (
    <>
      <div id="app" className="p-2 md:p-4">
        <h2 data-delay={75} className="animate text-4xl md:text-6xl font-bold">Do more with <span className="text-[var(--primary)] text-5xl md:text-6xl">Finbook App</span></h2>
        <p data-delay={150} className="animate mt-4 text-[var(--gray)] max-w-2xl mx-auto">Track, manage and optimize your finances with ease</p>
        <p data-delay={225} className="animate text-2xl font-semibold mt-2 md:mt-4">No internet needed, and no more worries about data loss</p>
        <div data-delay={300} className="animate mt-6 flex justify-center gap-4">
          <a href={apkUrl} download={"finbook.apk"} className="bg-[var(--primary)] px-4 md:px-6 py-3 rounded-lg text-white cursor-pointer">Download App</a>
          <a className="border border-[var(--primary)] text-[var(--primary)] px-2 md:px-6 py-3 rounded-lg cursor-pointer hover:bg-[var(--primary)] hover:text-white" href="#web">
            Check previous work
          </a>
        </div>
        <div data-delay={350} className="animate my-2 flex gap-2 justify-center mb-4"><p className="">App not working?</p><a href={universalApkUrl} target="_blank" className="text-[var(--primary)]">Click here</a></div>
        <div className="flex flex-wrap justify-center items-center gap-8 px-2 md:px-0">
          {[2, 3, 4].map((number, index) => (
            <div key={number} data-delay={350 + ((index + 1) * 75)}
              className={`animate md:w-48 lg:w-64 h-max p-1 bg-[var(--primaryLight)] shadow-[0_0_1rem_0.25rem_var(--primaryDark)] rounded-xl overflow-hidden ${number === 3 ? "md:w-52 lg:w-80" : ""}`}>
              <img className="rounded-xl" src={`/assets/app/finbook${number}.jpg`} alt={`finbook${number}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Data Management Section */}
      <div className="p-2 pt-4 md:p-4">
        <h2 className="animate text-2xl md:text-4xl font-medium text-center">Manage everything at one place</h2>
        <h2 className="animate text-3xl md:text-5xl mt-2 font-medium text-[var(--green)] text-center">Dates, Totals, Paid, Balance etc...</h2>
        <div className="flex flex-wrap justify-center items-center gap-8 px-2 pt-6 md:pt-10 md:px-0">
          {[6, 7, 8].map((number, index) => (
            <div key={number} data-delay={index * 100} className="animate md:w-48 lg:w-64 h-max p-1 bg-[var(--primaryLight)] shadow-[0_0_1rem_0.25rem_var(--primaryDark)] rounded-xl overflow-hidden">
              <img className="w-full h-full rounded-xl" src={`/assets/app/finbook${number}.jpg`} alt={`finbook${number}`} />
            </div>
          ))}
        </div>
      </div>

      {/* Security Section */}
      <div className="p-2 md:p-4">
        <h2 className="animate text-2xl md:text-4xl font-medium text-center">Secured with Google Sign-in</h2>
        <h2 className="animate text-3xl  md:text-5xl font-medium text-center"><span className="text-[var(--green)]">Data is safe</span> in your Mobile & Google Drive</h2>
        <div className="flex flex-wrap justify-center items-center gap-8 px-2 pt-6 md:pt-10 md:px-0">
          {[1, 5].map((number, index) => (
            <div key={number} data-delay={index * 100} className="animate md:w-48 lg:w-64 h-max p-1 bg-[var(--primaryLight)] shadow-[0_0_1rem_0.25rem_var(--primaryDark)] rounded-xl overflow-hidden">
              {number === 5 && (
                <div className="mb-4 mt-2 px-4 text-center">
                  <p className="text-2xl font-semibold mb-4">Backup & Recover with Google Drive</p>
                  <p className="text-[var(--gray)]">✔ Secured On-Device Storage</p>
                  <p className="text-[var(--gray)]">✔ One-Click G-Drive Backup & Restore</p>
                </div>
              )}
              <img className="w-full h-full rounded-xl" src={`/assets/app/finbook${number}.jpg`} alt={`finbook${number}`} />
            </div>
          ))}
        </div>
      </div>

      {[webv2Descriptions, webv1Descriptions].map((descriptions, descriptionsIndex) =>
        <div className="p-2 md:pb-4 px-4 pt-16" id="web" key={descriptionsIndex}>
          <h2 className="animate text-4xl md:text-6xl font-bold text-center">
            <span className="text-[var(--primary)]">Finbook</span> website v{descriptionsIndex === 0 ? "2" : "1"}{" "}
            <span className="font-normal text-sm text-[var(--red)] bg-[var(--redLight)] shadow px-2 py-1 align-middle rounded-3xl tracking-wider">
              discontinued
            </span>
          </h2>
          {descriptionsIndex === 0 && <p className="animate my-4 font-semibold text-xl text-center">
            A successful step towards transitioning to an enhanced version of the app with more powerful features.
          </p>}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 px-2 pt-6 md:pt-10">
            {descriptions.map((description, index) => (
              <div key={index} data-delay={index * 100} className="animate bg-[var(--primaryLight)] shadow-[0_0_1rem_0rem_var(--primaryDark)] rounded-lg overflow-hidden p-2">
                <p className="text-lg mb-2 font-semibold text-gray-200">{description}</p>
                <img className="rounded-lg" src={`/assets/web/finbookv${descriptionsIndex === 0 ? "2" : "1"}-${index + 1}.png`} alt={`finbookv2-${index + 1}.png`} />
              </div>
            ))}
          </div>
          {descriptionsIndex === 0 && <div className="animate flex justify-center items-center gap-4 text-lg mt-8"><p>Want to give it a try?</p><a href="#app" className="bg-[var(--primary)] px-4 py-2 rounded-3xl">Download App</a></div>}
        </div>)}

      {/* Footer */}
      <div className="p-4 container mx-auto">
        <p className="text-gray-400 text-center">
          &copy; {new Date().getFullYear()} Finbook. All rights reserved.
        </p>
      </div>
    </>
  );
};

export default Home;
