import React, { useState, useEffect } from "react";
import { useRouter } from "next/router"; // Next.js 라우터 사용
import styles from "../styles/pages/recommendation.module.css"

export default function Recommendation() {
    const [inputValue, setInputValue] = useState("");
    const [travelDestinations, setTravelDestinations] = useState<{ label: string, name: string }[]>([]);
    // const [travelDestinations, setTravelDestinations] = useState<string[]>([]);
    const [transportation, setTransportation] = useState("");
    const [isComposing, setIsComposing] = useState(false);
    const [apiResponse, setApiResponse] = useState(""); 
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        setInputValue(newValue);
    };

    const handleCompositionStart = () => {
        setIsComposing(true);
    };
    
    const handleCompositionEnd = () => {
        setIsComposing(false);
    };

    const handleAddDestination = () => {
        console.log("handleAddDestination 호출됨", inputValue);
        // 정규 표현식을 수정하여 숫자도 허용
        if (!inputValue.trim() || !/^[a-zA-Z가-힣0-9\s]*$/.test(inputValue)) {
            alert("올바른 내용을 입력해주세요 (한글, 영문, 숫자만 가능)");
            return;
        }
        const label = String.fromCharCode('A'.charCodeAt(0) + travelDestinations.length);
        setTravelDestinations(prevDestinations => [
            ...prevDestinations,
            { label, name: inputValue }
        ]);
        setInputValue("");
        console.log("입력값 초기화됨");
    };
    

    // const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    //     console.log("handleKeyDown 호출됨", e.key);
    //     if (e.key === 'Enter') {
    //         e.preventDefault(); // 엔터 키의 기본 동작 방지
    //         handleAddDestination();
    //     }
    // };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        console.log("handleKeyDown 호출됨", e.key);
        if (isComposing) return; // 한글 입력 중에는 이벤트 처리를 중단
        if (e.key === 'Enter') {
            e.preventDefault(); // 엔터 키의 기본 동작 방지
            handleAddDestination();
        }
    };
    
    const handleDeleteDestination = (index: number) => {
        console.log("handleDeleteDestination 호출됨", index);
        setTravelDestinations(travelDestinations.filter((_, idx) => idx !== index));
    };

    const handleTransportationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setTransportation(e.target.value);
    };

    const handleGoToRecommendation = async () => {
        if (travelDestinations.length === 0) {
            alert("다녀온 여행지를 추가해주세요.");
            return; // 함수 실행 중단
        }
    
        if (transportation === "") {
            alert("교통 수단을 선택해주세요.");
            return; // 함수 실행 중단
        }
        // 서버로 여행지 목록과 교통 수단 정보 전송
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/recommendations`, {
                method: 'POST', // POST 요청
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    destinations: travelDestinations,
                    transportation: transportation,
                }),
            });
    
            if (response.ok) {
                const data = await response.json();
                setApiResponse(data.message); // 서버 응답을 상태에 저장
                console.log("추천결과입니다"); // 콘솔에 메시지 출력
                // router.push('/recommendation-page'); // 추천 페이지로 이동
            } else {
                console.error('서버로부터 응답을 받는 데 실패했습니다.');
            }
        } catch (error) {
            console.error('요청 중 오류가 발생했습니다:', error);
        }
    };
    

    return (
        <main className="flex flex-col h-screen bg-gray-100">
            <div className={`${styles.inputContainer} flexcenter`}>
                <h1 className={styles.title}>이번여행에서 다녀온 여행지를 추가해주세요</h1>
                <div className={styles.inputGroup}>
                <input
                    type="text"
                    placeholder="여행지를 입력하세요"
                    className={`${styles.inputField} focus:ring-2 focus:ring-blue-300`}
                    value={inputValue}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    onCompositionStart={() => setIsComposing(true)}
                    onCompositionEnd={() => setIsComposing(false)}
                />
                    <button
                        className={styles.addButton}
                        onClick={handleAddDestination}
                    >
                        추가
                    </button>
                </div>
                <div className={styles.selectMenuContainer}>
                    <select
                        className={`${styles.selectMenu} focus:ring-2 focus:ring-blue-300`}
                        value={transportation}
                        onChange={handleTransportationChange}
                    >
                        <option value="">교통 수단 선택</option>
                        <option value="car">자동차</option>
                        <option value="publicTransport">대중교통</option>
                    </select>
                </div>
            </div>
            <div className={styles.listContainer}>
    {travelDestinations.length > 0 ? (
        <ul className={styles.destinationList}>
            {travelDestinations.map((destination, index) => (
                <li key={index} className={styles.listItem}>
                    <div className={styles.destinationInfo}>
                        <span className={styles.destinationLabel}>{destination.label}</span>
                        <span className={styles.destinationName}>{destination.name}</span>
                    </div>
                    <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteDestination(index)}
                    >
                        삭제
                    </button>
                </li>
            ))}
        </ul>
    ) : (
        <div className={styles.placeholderText}>여기에 다녀온 여행지가 추가됩니다.</div>
    )}
            </div>
            <div className={styles.recommendationButtonContainer}>
                <button
                    className={styles.recommendationButton}
                    onClick={handleGoToRecommendation}
                >
                    추천 받으러 가기
                </button>
            </div>
        </main>
    );
}
