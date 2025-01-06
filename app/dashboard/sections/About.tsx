import { UserData } from '@/types/User'
import { getCookie } from '@/utils/cookie';
import React, { useEffect, useState } from 'react'
import { FaSave } from 'react-icons/fa';
import { FaPencil } from 'react-icons/fa6';
import { MdCancel } from 'react-icons/md';

export default function About({
    user
}: {
    user: UserData
}) {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState<any>({});

    useEffect(() => {
        setFormData({
            name: user.name || "",
            email: user.email || "",
            dateOfBirth: user.dateOfBirth || "",
            bloodGroup: user.bloodGroup || "",
            height: user.height || "",
            weight: user.weight || "",
            allergies: user.allergies?.join(" ") || "",
            chronicConditions: user.chronicConditions?.join(" ") || "",
            lastCheckup: user.lastCheckup || "",
        })
    }, [user]);

    const handleEdit = async () => {
        const updatedFormData = {
            ...formData,
            allergies: typeof formData.allergies === 'string' ? formData.allergies.split(',').map((item: string) => item.trim()) : formData.allergies,
            chronicConditions: typeof formData.chronicConditions === 'string' ? formData.chronicConditions.split(',').map((item: string) => item.trim()) : formData.chronicConditions,
        };

        const sessionCookie = getCookie('session');

        const response = await fetch('/api/user', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${sessionCookie}` || '',

            },
            body: JSON.stringify(updatedFormData),
        });

        if (!response.ok) {
            console.error('Failed to update user data');
        } else {
            setIsEditing(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    return (
        <section className='p-6 text-center flex gap-2 flex-col items-start justify-start'>
            {isEditing ? (
                <>
                    <div className='flex justify-between items-start max-w-screen-md w-full mb-6'>
                        <div className='flex flex-col gap-2 items-start justify-start'>
                            <input
                                type='text'
                                name='name'
                                value={formData.name}
                                onChange={handleChange}
                                className='text-3xl heading font-semibold border-b-2 bg-transparent border-gray-300 outline-none'
                            />
                            <p className='text-base text-gray-400/60'>{user.email}</p>

                        </div>

                        <div className='flex items-center absolute lg:static lg:w-fit bottom-24 w-full left-0 justify-center gap-4'>
                            <button
                                onClick={handleEdit}
                                className='mt-4 px-4 py-4 bg-white/5 text-white aspect-square rounded-full'
                            >
                                <FaSave />
                            </button>
                            <button
                                onClick={() => setIsEditing(false)}
                                className='mt-4 px-3 py-3 text-2xl bg-red text-background aspect-square rounded-full'
                            >
                                <MdCancel />
                            </button>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 text-left max-w-screen-lg w-full mt-4'>
                        <div className='flex flex-col gap-1'>
                            <p className='text-sm heading text-gray-400/40'><strong>Date of Birth:</strong></p>
                            <input
                                type='text'
                                name='dateOfBirth'
                                value={formData.dateOfBirth}
                                onChange={handleChange}
                                className='border-b-2 font-semibold border-gray-300 text-2xl bg-transparent outline-none'
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p className='text-sm heading text-gray-400/40'><strong>Blood Group:</strong></p>
                            <input
                                type='text'
                                name='bloodGroup'
                                value={formData.bloodGroup}
                                onChange={handleChange}
                                className='border-b-2 font-semibold border-gray-300 text-2xl bg-transparent outline-none'
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p className='text-sm heading text-gray-400/40'><strong>Height:</strong></p>
                            <p className='text-2xl font-semibold'><input
                                type='number'
                                name='height'
                                value={formData.height}
                                onChange={handleChange}
                                className='border-b-2 font-semibold border-gray-300 text-2xl bg-transparent outline-none'
                            /> cm</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p className='text-sm heading text-gray-400/40'><strong>Weight:</strong></p>
                            <p className='text-2xl font-semibold'><input
                                type='number'
                                name='weight'
                                value={formData.weight}
                                onChange={handleChange}
                                className='border-b-2 font-semibold border-gray-300 bg-transparent text-2xl outline-none'
                            /> kg</p>
                        </div>
                        <div className='flex flex-col gap-1 relative'>
                            <p className='text-sm heading text-gray-400/40'><strong>Allergies:</strong></p>
                            <div className='flex flex-wrap gap-2'>
                                {formData.allergies.split(',').filter((a: string) => a.trim() !== "").map((allergy: string, index: number) => (
                                    <span onClick={() => {
                                        const updatedAllergies = formData.allergies.split(',').filter((_: any, i: number) => i !== index).join(',');
                                        setFormData({
                                            ...formData,
                                            allergies: updatedAllergies,
                                        });
                                    }} key={index} className='bg-black/5 cursor-pointer z-10 dark:bg-white/5 dark:text-white font-semibold text-base text-black px-3 py-1 rounded-full flex items-center'>
                                        {allergy}
                                    </span>
                                ))}
                            </div>
                            <input
                                type='text'
                                name='allergies'
                                value={formData.allergies}
                                onChange={handleChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ',') {
                                        e.preventDefault();
                                        setFormData({
                                            ...formData,
                                            allergies: formData.allergies + ','
                                        });
                                    }
                                }}
                                className='border-b-2 absolute bottom-0 text-transparent -mb-2 w-full font-semibold border-gray-300 text-lg bg-transparent outline-none'
                            />
                        </div>
                        <div className='flex flex-col gap-1 relative'>
                            <p className='text-sm heading text-gray-400/40'><strong>Chronic Conditions:</strong></p>

                            <div className='flex flex-wrap gap-2'>
                                {formData.chronicConditions.split(',').filter((a: string) => a.trim() !== "").map((allergy: string, index: number) => (
                                    <span onClick={() => {
                                        const updatedAllergies = formData.chronicConditions.split(',').filter((_: any, i: number) => i !== index).join(',');
                                        setFormData({
                                            ...formData,
                                            chronicConditions: updatedAllergies,
                                        });
                                    }} key={index} className='bg-black/5 cursor-pointer z-10 dark:bg-white/5 dark:text-white font-semibold text-base text-black px-3 py-1 rounded-full flex items-center'>
                                        {allergy}
                                    </span>
                                ))}
                            </div>
                            <input
                                type='text'
                                name='chronicConditions'
                                value={formData.chronicConditions}
                                onChange={handleChange}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter' || e.key === ',') {
                                        e.preventDefault();
                                        setFormData({
                                            ...formData,
                                            chronicConditions: formData.chronicConditions + ','
                                        });
                                    }
                                }}
                                className='border-b-2 absolute bottom-0 text-transparent -mb-2 w-full font-semibold border-gray-300 text-lg bg-transparent outline-none'
                            />
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p className='text-sm heading text-gray-400/40'><strong>Last Checkup:</strong></p>
                            <input
                                type='text'
                                name='lastCheckup'
                                value={formData.lastCheckup}
                                onChange={handleChange}
                                className='border-b-2 font-semibold border-gray-300 text-lg bg-transparent outline-none'
                            />
                        </div>
                    </div>
                </>
            ) : (
                <>
                    <div className='flex justify-between items-start max-w-screen-md w-full mb-6'>
                        <div className='flex flex-col gap-2 items-start justify-start'>
                            <h1 className='text-3xl heading font-semibold'>{user.name}</h1>
                            <p className='text-base text-gray-400/60'>{user.email}</p>
                        </div>
                        <div className='flex items-center absolute lg:static bottom-24 w-full lg:w-fit left-0 justify-center gap-4'>
                            <button
                                onClick={() => setIsEditing(true)}
                                className='mt-4 px-4 py-4 bg-white/5 text-white aspect-square rounded-full'
                            >
                                <FaPencil />
                            </button>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 lg:grid-cols-2 gap-4 text-left max-w-screen-lg w-full mt-4'>
                        <div className='flex flex-col gap-1'>
                            <p className='text-sm heading text-gray-400/40'><strong>Date of Birth:</strong></p>
                            <p className='text-2xl font-semibold'>{user.dateOfBirth}</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p className='text-sm heading text-gray-400/40'><strong>Blood Group:</strong></p>
                            <p className='text-2xl font-semibold'>{user.bloodGroup}</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p className='text-sm heading text-gray-400/40'><strong>Height:</strong></p>
                            <p className='text-2xl font-semibold'>{user.height} cm</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p className='text-sm heading text-gray-400/40'><strong>Weight:</strong></p>
                            <p className='text-2xl font-semibold'>{user.weight} kg</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p className='text-sm heading text-gray-400/40'><strong>Allergies:</strong></p>
                            <p className='text-lg font-semibold'>{user.allergies?.join(', ') || 'None'}</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p className='text-sm heading text-gray-400/40'><strong>Chronic Conditions:</strong></p>
                            <p className='text-lg font-semibold'>{user.chronicConditions?.join(', ') || 'None'}</p>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <p className='text-sm heading text-gray-400/40'><strong>Last Checkup:</strong></p>
                            <p className='text-lg font-semibold'>{user.lastCheckup}</p>
                        </div>
                    </div>
                </>
            )}
        </section>
    );
}
