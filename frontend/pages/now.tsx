// now.tsx
import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import loadingGif from "../public/loading.gif";
import useStore from "../src/store";
import styles from "../styles/pages/now.module.css";

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

    return (
        <div className={styles.container}>
            {" "}
            {/* container 스타일 적용 */}
            {address.city && (
                <div className={styles.addressWrap}>
                    <p className={styles.adresstxt}>저는 현재</p>
                    <p className={styles.address}>
                        {address.city} {address.district} {address.road}
                    </p>
                    <p className={styles.adresstxt}>여행중이에요</p>
                </div>
            )}
            <Link href="/recommendation">
                <a className={styles.linkButton}>다음은 어디로 가볼까요?</a>{" "}
            </Link>
        </div>
    );
}
