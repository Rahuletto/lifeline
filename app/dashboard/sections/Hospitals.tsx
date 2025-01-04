import React, { useEffect, useState } from 'react';

const Hospitals: React.FC = () => {

    const [iframeSrc, setIframeSrc] = useState('');

    useEffect(() => {
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;

                const src = `https://www.google.com/maps?q=hospitals+near+${latitude},${longitude}&z=18&output=embed&ll=${latitude},${longitude}&spn=0.005,0.005&markers=color:blue|${latitude},${longitude}`;
                setIframeSrc(src);
            },
            (error) => {
                console.error("Error getting geolocation: ", error);
                // Handle error accordingly
            }
        );
    }, []);

    return (
        <div  className="w-full h-full overflow-hidden bg-gray-200/30 rounded-2xl">
            {iframeSrc && (
            <iframe
                width="100%"
                height="100%"
                frameBorder="0"
                style={{ border: 0 }}
                src={iframeSrc}
                allowFullScreen
            ></iframe>
            )}
        </div>
    );
};

export default Hospitals;
