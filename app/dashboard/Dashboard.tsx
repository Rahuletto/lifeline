"use client";
import React, { useState } from "react";
import { ClientAuth } from "@/sdk/auth";
import { useEffect } from "react";
import Header from "@/components/Header";
import { Models } from "node-appwrite";
import { FaCartPlus, FaHospital, FaUser } from "react-icons/fa6";
import { MdEmergency, MdMedication } from "react-icons/md";
import Hospitals from "./sections/Hospitals";

const navbar = [
  {
    name: "About",
    id: "about",
    icon: <FaUser />,
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
  {
    name: "Emergency",
    id: "emergency",
    icon: <MdEmergency className="text-red" />,
  },
  {
    name: "Hospitals",
    id: "map",
    icon: <FaHospital />,
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

  useEffect(() => {
    const getUser = async () => {
      const auth = new ClientAuth();
      const user = await auth.getCurrentUser();
      setUser(user);
    };
    getUser();
  }, []);

  return (
    <section className="flex items-center justify-center">
      <Header />

      {user
        ? (
          <div className="flex w-full h-screen mt-12 gap-6 p-6">
            <div className="w-[300px] rounded-2xl h-full flex p-4 flex-col gap-2">
              {navbar.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setSection(item.id)}
                  className={`${
                    section === item.id
                      ? "bg-white/20 text-white"
                      : "hover:bg-white/5 bg-transparent text-white/40"
                  } p-2 text-left flex items-center gap-3 justify-start transition-all duration-150 text-lg px-5 rounded-2xl font-semibold`}
                >
                  {item.icon} {item.name}
                </button>
              ))}
            </div>
            <div className="w-full rounded-2xl h-full">
              {
                section === "map" && <Hospitals />
              }

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
