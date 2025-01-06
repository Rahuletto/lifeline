"use client";
import React, { useState } from "react";
import { ClientAuth } from "@/sdk/auth";
import { useEffect } from "react";
import Header from "@/components/Header";
import { Models } from "node-appwrite";
import { FaCartPlus, FaHospital, FaUser } from "react-icons/fa6";
import { MdEmergency, MdMedication } from "react-icons/md";
import Hospitals from "./sections/Hospitals";
import Emergency from "./sections/Emergency";
import { getCookie } from "@/utils/cookie";
import { ResponseUser, UserData } from "@/types/User";
import About from "./sections/About";
import MedicationSection from "./sections/Medications";

const navbar = [
  {
    name: "About",
    id: "about",
    icon: <FaUser />,
  },
  {
    name: "Hospitals",
    id: "map",
    icon: <FaHospital />,
  },
  {
    name: "Emergency",
    id: "emergency",
    icon: <MdEmergency className="text-red" />,
  },

  {
    name: "Medications",
    id: "medications",
    icon: <MdMedication />,
  },
  {
    name: "Order Medicines",
    id: "order",
    icon: <FaCartPlus />,
  },
];

export default function Dashboard() {
  const [user, setUser] = useState<Models.User<Models.Preferences> | null>(
    null,
  );

  const [section, setSection] = useState<
    "about" | "map" | "emergency" | "medications" | "order" | string
  >(
    "about",
  );

  const [data, setData] = useState<UserData | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const auth = new ClientAuth();
      const user = await auth.getCurrentUser();
      setUser(user);
    };

    const fetchData = async () => {
      const sessionCookie = getCookie('session');
      const r = await fetch('/api/user', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionCookie}` || '',
        },
      });
      const data: ResponseUser = await r.json();
      setData(data.user);
    }

    fetchData();
    getUser();
  }, [])


  return (
    <section className="flex items-center justify-center">
      <Header />

      {user && data
        ? (
          <div className="flex w-full h-screen mt-12 gap-6 p-6">
            <div className="hidden w-[300px] rounded-2xl h-full lg:flex p-4 flex-col gap-2">
              {navbar.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={`${section === item.id
                    ? "bg-white/20 text-white"
                    : "hover:bg-white/5 bg-transparent text-white/40"
                    } p-2 text-left flex items-center gap-3 justify-start transition-all duration-150 text-lg px-5 rounded-2xl font-semibold`}
                >
                  {item.icon} {item.name}
                </button>
              ))}
            </div>
            <div className="w-full lg:pl-8 h-full lg:border-l border-l-white/10">
              {
                section === "about" ? <About user={data} /> : section === "emergency" ? <Emergency emergencyContacts={data.emergencyContact ?? []} /> : section === "map" ? <Hospitals /> : section === "medications" && <MedicationSection data={data.medications ?? []} />
              }

            </div>
            <div className="fixed bottom-0 left-0 right-0 border-t bg-background border-t-white/10 mx-4 p-4 flex justify-around lg:hidden">
              {navbar.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={`${section === item.id
                    ? "text-white"
                    : "text-white/40"
                    } flex flex-col gap-1 items-center`}
                >
                  {item.icon}
                  <span className="text-xs">{item.name.split(' ')[0]}</span>
                </button>
              ))}
            </div>

          </div>
        )
        : (
          <div className="flex w-full h-screen mt-12 animate-pulse gap-6 p-6">
            <div className="sticky bg-gray-300/20 w-[400px] rounded-2xl h-full">
            </div>
            <div className="sticky bg-gray-300/20 w-full rounded-2xl h-full">
            </div>
          </div>
        )}
    </section>
  );
}
