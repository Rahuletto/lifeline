import { Contact } from '@/types/Contact';
import { getCookie } from '@/utils/cookie';
import React, { useEffect, useRef, useState } from 'react'
import { FaPhone, FaPlus, FaPen, FaTrash } from 'react-icons/fa6';

export default function Emergency({
  emergencyContacts,
}: {
  emergencyContacts: Contact[];
}) {
  const [em, setEm] = useState<Contact[]>(emergencyContacts);
  const [timer, setTimer] = useState<number | null>(null);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);

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
          window.open(`tel:911`, '_blank');

        }
      }, 1000);
      setIntervalId(newIntervalId);
    }
  };

  const openDialog = () => {
    const dialog = document.getElementById('newEmergencyContact') as HTMLDialogElement;
    dialog.showModal();
  }

  const addContact = (name: string, phone: number) => {
    const setData = async () => {
      const sessionCookie = getCookie('session');
      const r = await fetch('/api/emergency', {
        method: 'POST',
        body: JSON.stringify({
          contacts: [{
            name,
            phone,
            relationship: "Other"
          }]
        }),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${sessionCookie}` || '',
        },
      });

      const data = await r.json();
      setEm(data.contacts);

    }

    setData();
  }

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const [editingContact, setEditingContact] = useState<Contact | null>(null);
  const [editName, setEditName] = useState('');
  const [editPhone, setEditPhone] = useState('');

  const editContact = async (contactId: string, phone: string) => {
    const sessionCookie = getCookie('session');
    const r = await fetch('/api/emergency', {
      method: 'PUT',
      body: JSON.stringify({
        contactId,
        phone
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionCookie}` || '',
      },
    });
    const data = await r.json();

    setEm(data.contacts);
  }

  const deleteContact = async (contactId: string) => {
    const sessionCookie = getCookie('session');
    const r = await fetch('/api/emergency', {
      method: 'DELETE',
      body: JSON.stringify({
        contactId
      }),
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${sessionCookie}` || '',
      },
    });
    const data = await r.json();
    setEm(data.contacts);
  }

  const openEditDialog = (contact: Contact) => {
    setEditingContact(contact);
    setEditName(contact.name);
    setEditPhone(contact.phone.toString());
    const dialog = document.getElementById('editEmergencyContact') as HTMLDialogElement;
    dialog.showModal();
  }

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

      <div className='grid grid-cols-1 w-full sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-4 mt-12'>
        {
          em.map((contact) => (
            <div className='flex flex-col gap-1 p-4 px-6 bg-white/5 rounded-xl'>
            <div key={contact.id} className='flex text-left gap-4 cursor-pointer items-center justify-between'>
              <div>
                <h2 className='text-2xl font-semibold'>{contact.name}</h2>
                <p className="text-white/50">{contact.phone}</p>
              </div>
              <div className='flex gap-2'>
                <button
                  className='bg-red rounded-full text-background p-4 flex items-center justify-center'
                  onClick={() => window.open(`tel:${contact.phone}`, '_blank')}
                >
                  <FaPhone />
                </button>
              </div>
            </div>
            <div className='w-full flex justify-around pt-3 mt-3 border-t border-t-white/10'>
            <button
                  className='rounded-full text-foreground px-4 flex text-base items-center justify-center'
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditDialog(contact);
                  }}
                >
                  <FaPen />
                </button>
                <button
                  className='rounded-full text-red px-4 flex text-base items-center justify-center'
                  onClick={(e) => {
                    e.stopPropagation();
                    if (confirm('Are you sure you want to delete this contact?')) {
                      deleteContact(contact.id ?? "");
                    }
                  }}
                >
                  <FaTrash />
                </button>
            </div>
            </div>
          ))}
        <button
          className='bg-transparent rounded-2xl border-2 border-dashed border-red text-red w-fit aspect-square p-2 flex items-center justify-center'
          onClick={openDialog}
        >
          <FaPlus className='text-2xl' />
        </button>
      </div>

      <dialog id="newEmergencyContact" className="backdrop:bg-black/50 backdrop:backdrop-blur-sm bg-background p-8 rounded-2xl max-w-lg w-full">
        <form method="dialog" className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold heading text-foreground">Add Emergency Contact</h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="bg-white/5 p-3 text-white px-5 rounded-xl"
          />
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone"
            maxLength={10}
            className="bg-white/5 p-3 text-white px-5 rounded-xl"
          />
          <div className="flex gap-4 justify-end">
            <button
              className="bg-white/80 text-background px-6 py-2 rounded-xl heading font-semibold"
              type="button"
              onClick={() => {
                addContact(name, parseInt(phone));
                setName('');
                setPhone('');
                (document.getElementById('newEmergencyContact') as HTMLDialogElement).close();
              }}
            >
              Add
            </button>
            <button
              className=" bg-red px-6 py-2 rounded-xl text-background heading font-semibold"
              type="button"
              onClick={() => (document.getElementById('newEmergencyContact') as HTMLDialogElement).close()}
            >
              Cancel
            </button>
          </div>
        </form>
      </dialog>

      <dialog id="editEmergencyContact" className="backdrop:bg-black/50 backdrop:backdrop-blur-sm bg-background p-8 rounded-2xl max-w-lg w-full">
        <form method="dialog" className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold heading text-foreground">Edit Emergency Contact</h2>
          <input
            type="text"
            value={editName}
            onChange={(e) => setEditName(e.target.value)}
            placeholder="Name"
            className="bg-white/5 p-3 text-white px-5 rounded-xl"
            disabled
          />
          <input
            type="tel"
            value={editPhone}
            onChange={(e) => setEditPhone(e.target.value)}
            placeholder="Phone"
            maxLength={10}
            className="bg-white/5 p-3 text-white px-5 rounded-xl"
          />
          <div className="flex gap-4 justify-end">
            <button
              className="bg-white/80 text-background px-6 py-2 rounded-xl heading font-semibold"
              type="button"
              onClick={() => {
                if (editingContact) {
                  editContact(editingContact.id ?? "", editPhone);
                  setEditingContact(null);
                  setEditName('');
                  setEditPhone('');
                }
                (document.getElementById('editEmergencyContact') as HTMLDialogElement).close();
              }}
            >
              Save
            </button>
            <button
              className="bg-red px-6 py-2 rounded-xl text-background heading font-semibold"
              type="button"
              onClick={() => {
                setEditingContact(null);
                setEditName('');
                setEditPhone('');
                (document.getElementById('editEmergencyContact') as HTMLDialogElement).close();
              }}
            >
              Cancel
            </button>
          </div>
        </form>
      </dialog>

    </section>
  )
}
