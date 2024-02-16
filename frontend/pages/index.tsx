import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from 'next/image'; // Image 컴포넌트 임포트
import loadingGif from "../public/loading.gif"; // 로딩 이미지 임포트 (정적 파일 경로 설정)

export default function HomePage() {
    const [address, setAddress] = useState("");
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(async (position) => {
                const { latitude, longitude } = position.coords;
                try {
                    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/geolocation`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ latitude, longitude }),
                    });

                    const data = await response.json();
                    setAddress(data.address);
                    setIsLoading(false); // 주소 정보를 받아온 후 로딩 상태 변경
                } catch (error) {
                    console.error("주소 정보를 가져오는데 실패했습니다.", error);
                    setIsLoading(false); // 에러 발생 시에도 로딩 상태 변경
                }
            });
        } else {
            console.log("Geolocation을 지원하지 않는 브라우저입니다.");
            setIsLoading(false); // Geolocation을 지원하지 않는 경우 로딩 상태 변경
        }
    }, []);

    if (isLoading) {
        return (
            <Image src={loadingGif} alt="Loading..." fill style={{ objectFit: 'contain' }} />
        );
    }

    return (
        <div className="flex h-screen justify-center items-center flex-col bg-gray-100 p-5">
            {address && (
                <div className="text-left mb-12">
                    <p className="text-4xl font-bold text-black mb-2">저는 현재</p>
                    <p className="text-5xl font-extrabold text-indigo-600 mb-2">{address}</p>
                    <p className="text-4xl font-bold text-black">여행중이에요</p>
                </div>
            )}
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6">어디갈지 추천받아 보세요</h1>
            <Link href="/recommendation" className="px-6 py-3 bg-blue-500 text-white rounded-full text-xl font-bold hover:bg-blue-700 transition-colors">
                확인
            </Link>
        </div>
    );
}