import React, { useState, useEffect } from 'react'
import type { Frequency, Medications } from '@/types/Medications'
import DrugAutocomplete from './DrugSearch'
import { getCookie } from '@/utils/cookie';
import { FaPen, FaTrash } from 'react-icons/fa6';
import Link from 'next/link';

export default function OrderMed({ data }: {
    data: Medications[]
}) {
    const [medications, setMedications] = useState<Medications[]>(data);

    useEffect(() => {
        localStorage.setItem('medications', JSON.stringify(medications));
    }, [medications]);


    const fetchMedicationImage = async (medicationName: string) => {
        const cacheKey = `med-img-${medicationName}`;
        const cachedImage = localStorage.getItem(cacheKey);

        if (cachedImage) {
            return cachedImage;
        }

        const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
        const SEARCH_ENGINE_ID = process.env.NEXT_PUBLIC_SEARCH_ENGINE_ID;
        const url = `https://www.googleapis.com/customsearch/v1?key=${API_KEY}&cx=${SEARCH_ENGINE_ID}&q=${encodeURIComponent(medicationName + " tablets")}&searchType=image&num=2`;

        try {
            const response = await fetch(url);
            const data = await response.json();
            const imageUrl = data.items?.[1]?.link || null;
            if (imageUrl) {
                localStorage.setItem(cacheKey, imageUrl);
            }
            return imageUrl;
        } catch (error) {
            console.error('Error fetching medication image:', error);
            return null;
        }
    };


    const renderMedications = () => {
        useEffect(() => {
            const loadImage = async (med: Medications) => {
                const imageUrl = await fetchMedicationImage(med.name);
                if (imageUrl) {
                    const imgs = document.querySelectorAll(`#med-img-${med.name}`) as NodeListOf<HTMLImageElement>;
                    imgs.forEach(img => {
                        if (img) img.src = imageUrl;
                    });
                }
            };

            const uniqueMeds = [...new Set(medications.map(med => med.name))];
            uniqueMeds.forEach(name => {
                const med = medications.find(m => m.name === name);
                if (med) loadImage(med);
            });
        }, [medications])

        return (<div className='grid grid-cols-1 md:grid-cols-2 mt-4 lg:grid-cols-4 gap-4'>
            {medications.map(med => (
                <div key={med.id} className="rounded-2xl min-w-[240px] p-6 flex-col flex bg-black/5 dark:bg-white/5 justify-between items-start">
                    <img
                        id={`med-img-${med.name}`}
                        alt={med.name}
                        className="w-full h-48 object-cover rounded-xl mb-4"
                        onError={(e) => {
                            e.currentTarget.onerror = null;
                        }}
                    />

                    <div className='text-left'>
                        <h2 className="font-bold">{med.name}</h2>
                        <p className='opacity-40'>{med.dosage}</p>
                    </div>
                    <div className='mt-5'>
                        <Link target='_blank' className='px-4 py-1 bg-white/70 -ml-2 text-background font-semibold heading rounded-xl' href={`https://pharmeasy.in/search/all?name=${med.name}`}>Order</Link>
                    </div>
                </div>
            ))}
        </div>)
    };

    return (
        <section className='p-6 text-center flex gap-2 flex-col items-start justify-start'>
            <h1 className='text-3xl heading font-semibold'>Order Medications</h1>
            <div className="flex gap-12 flex-col items-start justify-start">
                {renderMedications()}
            </div>
        </section>
    )
}
