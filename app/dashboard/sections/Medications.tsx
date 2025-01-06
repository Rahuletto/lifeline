import React, { useState, useEffect } from 'react'
import type { Frequency, Medications } from '@/types/Medications'
import DrugAutocomplete from './DrugSearch'
import { getCookie } from '@/utils/cookie';
import { FaPen, FaTrash } from 'react-icons/fa6';

export default function MedicationSection({ data }: {
    data: Medications[]
}) {
    const [medications, setMedications] = useState<Medications[]>(data);
    const [showPopup, setShowPopup] = useState(false);
    const [missedMedications, setMissedMedications] = useState<{ id: string, time: keyof Frequency }[]>([]);
    const [takenMedications, setTakenMedications] = useState<{ id: string, time: keyof Frequency }[]>([]);
    const [editingMedication, setEditingMedication] = useState<Medications | null>(null);

    useEffect(() => {
        const storedMedications = JSON.parse(localStorage.getItem('medications') || '[]');
        const storedMissedMedications = JSON.parse(localStorage.getItem('missedMedications') || '[]');
        const storedTakenMedications = JSON.parse(localStorage.getItem('takenMedications') || '[]');
        if (storedMedications.length > 0) {
            setMedications(storedMedications);
        }
        if (storedMissedMedications.length > 0) {
            setMissedMedications(storedMissedMedications);
        }
        if (storedTakenMedications.length > 0) {
            setTakenMedications(storedTakenMedications);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('medications', JSON.stringify(medications));
    }, [medications]);

    useEffect(() => {
        localStorage.setItem('missedMedications', JSON.stringify(missedMedications));
    }, [missedMedications]);

    useEffect(() => {
        localStorage.setItem('takenMedications', JSON.stringify(takenMedications));
    }, [takenMedications]);

    const handleAddMedication = (medication: Medications) => {
        const setData = async () => {
            const sessionCookie = getCookie('session');
            const r = await fetch('/api/medications', {
                method: 'POST',
                body: JSON.stringify({ medications: [medication] }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionCookie}` || '',
                },
            });
            const data = await r.json();
            setMedications(data.medications);
        }

        setData();
        setShowPopup(false);
    };

    const handleEditMedication = (updatedMedication: Medications) => {
        const setData = async () => {
            if (!editingMedication) return;

            const changes: { [key: string]: any } = {
                medicationId: editingMedication.id
            };

            if (updatedMedication.name !== editingMedication.name) {
                changes.name = updatedMedication.name;
            }
            if (updatedMedication.dosage !== editingMedication.dosage) {
                changes.dosage = updatedMedication.dosage;
            }
            if (JSON.stringify(updatedMedication.frequency) !== JSON.stringify(editingMedication.frequency)) {
                changes.frequency = updatedMedication.frequency;
            }
            if (updatedMedication.notes !== editingMedication.notes) {
                changes.notes = updatedMedication.notes;
            }

            const sessionCookie = getCookie('session');
            const r = await fetch('/api/medications', {
                method: 'PUT',
                body: JSON.stringify(changes),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionCookie}` || '',
                },
            });
            const data = await r.json();
            setMedications(data.medications);
            setEditingMedication(null);
        }

        setData();
    };

    const handleDeleteMedication = (id: string) => {
        const setData = async () => {
            const sessionCookie = getCookie('session');
            const r = await fetch('/api/medications', {
                method: 'DELETE',
                body: JSON.stringify({ medicationId: id }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${sessionCookie}` || '',
                },
            });
            const data = await r.json();
            setMedications(data.medications);
        }

        setData();
    };

    const handleTakeMedication = (id: string, time: keyof Frequency) => {
        setTakenMedications([...takenMedications, { id, time }]);
        setMissedMedications(missedMedications.filter(med => !(med.id === id && med.time === time)));
    };

    const handleMissed = (id: string, time: keyof Frequency) => {
        setMissedMedications([...missedMedications, { id, time }]);
    };

    const checkIfMissed = (time: keyof Frequency) => {
        const now = new Date();
        const currentHour = now.getHours();
        const timeMap = {
            morning: 12,
            afternoon: 17,
            evening: 21,
            night: 24
        };

        return currentHour >= timeMap[time];
    };

    const resetDaily = () => {
        setMissedMedications([]);
    };

    useEffect(() => {
        const now = new Date();
        const lastReset = localStorage.getItem('lastReset');
        if (!lastReset || new Date(lastReset).getDate() !== now.getDate()) {
            resetDaily();
            localStorage.setItem('lastReset', now.toString());
        }
    }, []);

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


    const renderMedications = (time: keyof Frequency) => {
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
            const medicationsForTime = medications.filter(med => med.frequency[time]);
            const uniqueMeds = [...new Set(medicationsForTime.map(med => med.name))];
            uniqueMeds.forEach(name => {
                const med = medicationsForTime.find(m => m.name === name);
                if (med) loadImage(med);
            });
        }, [medications])

        return (<div className='grid grid-cols-1 md:grid-cols-2 mt-4 lg:grid-cols-4 gap-4'>
            {medications.filter(med => med.frequency[time]).map(med => (
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
                        {missedMedications.some(med => med.id === med.id && med.time === time) ? (
                            <span className="text-red font-semibold heading">Missed</span>
                        ) : takenMedications.some(med => med.id === med.id && med.time === time) ? (
                            <span className="text-green font-semibold heading">Taken</span>
                        ) : checkIfMissed(time) ? (
                            <button className='px-4 py-1 bg-red -ml-2 text-background font-semibold heading rounded-xl' onClick={() => handleMissed(med.id!, time)}>Missed</button>
                        ) : (
                            <button className='px-4 py-1 bg-white/70 -ml-2 text-background font-semibold heading rounded-xl' onClick={() => handleTakeMedication(med.id!, time)}>Take</button>
                        )}
                    </div>
                    <div className='w-full flex justify-around pt-3 mt-3 border-t border-t-white/10'>
                        <button
                            className='rounded-full text-foreground px-4 flex text-base items-center justify-center'
                            onClick={() => setEditingMedication(med)}
                        >
                            <FaPen />
                        </button>
                        <button
                            className='rounded-full text-red px-4 flex text-base items-center justify-center'
                            onClick={() => {
                                if(confirm('Are you sure you want to delete this medication?')) {
                                    handleDeleteMedication(med.id!);
                                }
                            }}
                        >
                            <FaTrash />
                        </button>
                    </div>
                </div>
            ))}
        </div>)
    };

    return (
        <section className='p-6 text-center flex gap-2 flex-col items-start justify-start'>
            <h1 className='text-3xl heading font-semibold'>Medications</h1>
            <button onClick={() => setShowPopup(true)} className="mb-4 font-medium opacity-50">Add Medication</button>
            {showPopup && (
                <div className="fixed inset-0 bg-black/60 z-10 backdrop-blur-sm flex justify-center items-center">
                    <div className="bg-background p-4 px-8 rounded-3xl">
                        <h1 className='heading text-xl mb-5 font-semibold'>Add a drug</h1>
                        <DrugAutocomplete onSelect={handleAddMedication} />
                    </div>
                </div>
            )}
            <div className="flex gap-12 flex-col items-start justify-start">
                <div>
                    <h2 className="text-xl text-left w-fit mb-2 opacity-80 underline text-black dark:text-white heading font-bold">Morning</h2>
                    {renderMedications('morning')}
                </div>
                <div>
                    <h2 className="text-xl text-left w-fit mb-2 opacity-80 underline text-black dark:text-white heading font-bold">Afternoon</h2>
                    {renderMedications('afternoon')}
                </div>
                <div>
                    <h2 className="text-xl text-left w-fit mb-2 opacity-80 underline text-black dark:text-white heading font-bold">Evening</h2>
                    {renderMedications('evening')}
                </div>
                <div>
                    <h2 className="text-xl text-left w-fit mb-2 opacity-80 underline text-black dark:text-white heading font-bold">Night</h2>
                    {renderMedications('night')}
                </div>
            </div>
            {editingMedication && (
                <div className="fixed inset-0 bg-black/60 z-10 backdrop-blur-sm flex justify-center items-center">
                    <div className="bg-background p-4 px-8 rounded-3xl">
                        <h1 className='heading text-xl mb-5 font-semibold'>Edit Medication</h1>
                        <DrugAutocomplete 
                            initialValue={editingMedication}
                            onSelect={handleEditMedication}
                            onCancel={() => setEditingMedication(null)}
                        />
                    </div>
                </div>
            )}
        </section>
    )
}
