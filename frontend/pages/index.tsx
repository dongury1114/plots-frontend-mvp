import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import loadingGif from "../public/loading.gif";
import useStore from "../src/store";

export default function HomePage() {
    const [address, setAddress] = useState({
        city: "",
        district: "",
        road: "",
    });
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태
    const setLastLocation = useStore((state) => state.setLastLocation);
    // 위치 상태 관리를 위한 Zustand 스토어 사용

    // 사용자의 위도와 경도를 기반으로 주소 정보를 가져오는 함수
    const fetchLocation = async (latitude: number, longitude: number) => {
        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/geolocation`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ latitude, longitude }),
                }
            );
            if (!response.ok) throw new Error("Failed to fetch location");
            const data = await response.json();
            setAddress(data.address);
        } catch (error) {
            console.error("주소 정보를 가져오는데 실패했습니다.", error);
        } finally {
            setIsLoading(false);
        }
    };

    // 컴포넌트 마운트 시 사용자의 위치를 가져오는 useEffect 훅
    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                const { latitude, longitude } = position.coords;
                setLastLocation(latitude, longitude);
                console.log("Updated lastLocation:", { latitude, longitude });
                fetchLocation(latitude, longitude);
            });
        } else {
            console.log("Geolocation을 지원하지 않는 브라우저입니다.");
            setIsLoading(false);
        }
    }, []);

    // 로딩 중일 때 로딩 GIF 표시
    if (isLoading) {
        return (
            <Image
                src={loadingGif}
                alt="Loading..."
                fill
                style={{ objectFit: "contain" }}
            />
        );
    }

    // 주소 정보가 있을 경우 주소와 추천받기 링크를 표시
    return (
        <div className="flex h-screen justify-center items-center flex-col bg-gray-100 p-5">
            {address.city && (
                <div className="text-left mb-12">
                    <p className="text-4xl font-bold text-black mb-2">
                        저는 현재
                    </p>
                    <p className="text-5xl font-extrabold text-indigo-600">
                        {address.city}
                    </p>{" "}
                    <p className="text-5xl font-extrabold text-indigo-600 mb-2">
                        {address.district} {address.road}
                    </p>
                    <p className="text-4xl font-bold text-black">
                        여행중이에요
                    </p>
                </div>
            )}
            <h1 className="text-3xl font-extrabold text-gray-800 mb-6">
                어디갈지 추천받아 보세요
            </h1>
            <Link
                href="/recommendation"
                className="px-6 py-3 bg-blue-500 text-white rounded-full text-xl font-bold hover:bg-blue-700 transition-colors"
            >
                확인
            </Link>
        </div>
    );
}
