import { Contact } from '@/types/Contact';
import { getCookie } from '@/utils/cookie';
import React, { useEffect, useRef, useState } from 'react'
import { FaPhone } from 'react-icons/fa6';

export default function Emergency() {

  const [data, setData] = useState<Contact[]>([]);
  const [timer, setTimer] = useState<number | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const fetchData = async () => {

      const sessionCookie = getCookie('session');

      const r = await fetch('/api/emergency', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionCookie}` || '',
        },
      });
      const data = await r.json();
      console.log(data)
      setData(data.contacts);
    }

    fetchData();
  }, [])

  const handleButtonClick = () => {
    if (intervalId) {
      clearInterval(intervalId);
      if (audioRef.current) {
        audioRef.current?.pause();
        audioRef.current.currentTime = 0;
      }
      setIntervalId(null);
      setTimer(null);
      console.log('Timer reset');
    } else {
      audioRef.current = new Audio('/emergency.mp3');
      audioRef.current.play();
      let countdown = 10;
      setTimer(countdown);
      const newIntervalId = setInterval(() => {
        if (countdown > 0) {
          console.log(countdown);
          countdown--;
          setTimer(countdown);
        } else {
          clearInterval(newIntervalId);
          setIntervalId(null);
          setTimer(null);
          console.log('Calling 911');
          window.open(`tel:919`, '_blank');

        }
      }, 1000);
      setIntervalId(newIntervalId);
    }
  };

  return (
    <section className='p-6 text-center flex gap-2 flex-col items-center justify-start'>
      <h1 className='text-3xl heading font-semibold'>Emergency</h1>
      <p className='text-lg text-gray-600'>
        In case of an emergency, please call the contacts.
      </p>

      <button
        className={`bg-red text-background my-16 heading rounded-full w-52 h-52 after:w-52 after:h-52 after:absolute relative after:bg-red after:rounded-full ${timer == null ? "after:hidden" : "after:animate-ping"} after:top-0 after:left-0 p-10 aspect-square text-4xl font-bold`}
        onClick={handleButtonClick}
      >
        {timer !== null ? timer : 'SOS'}
      </button>

      <div className='grid grid-cols-1 w-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-12'>
        {
          data.map((contact) => (
            <div onClick={() => window.open(`tel:${contact.phone}`, '_blank')} key={contact.id} className='flex text-left cursor-pointer items-center justify-between gap-4 p-4 px-6 bg-white/5 rounded-xl'>

              <div>
                <h2 className='text-2xl font-bold'>{contact.name}</h2>
                <p className="text-white/50">{contact.phone}</p>
              </div>
              <button
                className='bg-red rounded-full aspect-square text-background p-4 flex items-center justify-center'
                onClick={() => window.open(`tel:${contact.phone}`, '_blank')}
              >
                <FaPhone />
              </button>
            </div>
          ))}
      </div>

    </section>
  )
}
