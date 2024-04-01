//result.tsx

import React, { useState, useEffect } from "react";
import Image from "next/image";
import loadingGif from "../public/loading.gif"; // 로딩 애니메이션 GIF
import styles from "../styles/pages/result.module.css"; // CSS 모듈
import useStore from "../src/store"; // Zustand 스토어 import

// 추천 여행지에 대한 TypeScript 인터페이스
interface Recommendation {
    이름: string;
    한줄설명: string;
    상세설명: string;
    이미지_url: string;
    주소: string;
    이동시간: string;
    태그: string;
    총리뷰수: number;
    x?: number; // 옵셔널 필드
    y?: number; // 옵셔널 필드
    _id?: string; // 옵셔널 필드
}

export default function ResultPage() {
    const { travelDestinations, transportation, lastLocation } = useStore(
        (state) => ({
            travelDestinations: state.travelDestinations,
            transportation: state.transportation,
            lastLocation: state.lastLocation,
        })
    );
    const [recommendations, setRecommendations] = useState<Recommendation[]>(
        []
    );
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchRecommendations();
    }, []);

    function fetchRecommendations() {
        const requestBody = {
            destinations: travelDestinations,
            transportation: "car",
            currentLocation: { latitude: 37.5576879, longitude: 126.9254523 },
        };

        // const requestBody = {
        //     destinations: travelDestinations,
        //     transportation: transportation,
        //     currentLocation: lastLocation,
        // };

        console.log("Request body:", requestBody);
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/recommendation`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(requestBody),
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error("Failed to fetch recommendation");
                }
                console.log("Successfully fetched recommendation", response);

                return response.json();
            })
            .then((data) => {
                setRecommendations(data);
                setIsLoading(false);
                console.log("Recommendations:", data);
            })
            .catch((error) => {
                console.error("Failed to fetch recommendation:", error);
            });
    }

    if (isLoading) {
        return (
            <div className={styles.loadingContainer + " flexcenter"}>
                <Image
                    src={loadingGif}
                    alt="Loading..."
                    width={200}
                    height={200}
                />
            </div>
        );
    }

    // 로딩이 완료된 후 추천 여행지 목록 표시
    return (
        <div className={styles.container}>
            <h1>추천결과</h1>
            {recommendations.length > 0 ? (
                <ul>
                    {recommendations.map((recommendation, index) => (
                        <li key={index}>
                            <div className={styles.imageContainer}>
                                <Image
                                    src={
                                        recommendation.이미지_url ||
                                        "/default-image.png"
                                    }
                                    alt={recommendation.이름 || "Default Image"}
                                    width={500}
                                    height={300}
                                    layout="responsive"
                                />
                            </div>
                            <div className={styles.info}>
                                <h2>{recommendation.이름}</h2>
                                <p className={styles.oneLineDescription}>
                                    {recommendation.한줄설명}
                                </p>
                                <p className={styles.detailedDescription}>
                                    {recommendation.상세설명}
                                </p>
                                <p className={styles.address}>
                                    {recommendation.주소}
                                </p>
                                <p className={styles.travelTime}>
                                    이동 시간: {recommendation.이동시간}
                                </p>
                                <p className={styles.tags}>
                                    태그: {recommendation.태그}
                                </p>
                                <p className={styles.reviewCount}>
                                    리뷰 수: {recommendation.총리뷰수}
                                </p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No recommendations found.</p>
            )}
        </div>
    );
}
