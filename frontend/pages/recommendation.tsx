import React, { useState } from "react";
import { useRouter } from "next/router";
import styles from "../styles/pages/recommendation.module.css";
import useStore from "../src/store";

// 정규 표현식 및 교통 수단 옵션 상수 선언
const REGEX_INPUT_VALIDATION = /^[a-zA-Z가-힣0-9\s]*$/;
const TRANSPORTATION_OPTIONS = [
    { value: "car", label: "자동차" },
    { value: "publicTransport", label: "대중교통" },
];

// 입력 필드 컴포넌트의 props 타입 정의
interface InputFieldProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onCompositionStart: () => void;
    onCompositionEnd: () => void;
}

// 입력 필드 컴포넌트: 사용자 입력을 처리하는 컴포넌트
const InputField = ({
    value,
    onChange,
    onKeyDown,
    onCompositionStart,
    onCompositionEnd,
}: InputFieldProps) => (
    <input
        type="text"
        placeholder="여행지를 입력하세요"
        className={`${styles.inputField} focus:ring-2 focus:ring-blue-300`}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        onCompositionStart={onCompositionStart}
        onCompositionEnd={onCompositionEnd}
    />
);

// 목적지 객체 타입 정의
interface Destination {
    label: string;
    name: string;
}

// 목적지 목록 컴포넌트의 props 타입 정의
interface DestinationListProps {
    destinations: Destination[];
    onDelete: (index: number) => void;
}

// 목적지 목록 컴포넌트: 추가된 여행지를 나열하고 삭제 기능을 제공
const DestinationList = ({ destinations, onDelete }: DestinationListProps) => (
    <ul className={styles.destinationList}>
        {destinations.map((destination, index) => (
            <li key={index} className={styles.listItem}>
                <div className={styles.destinationInfo}>
                    <span className={styles.destinationLabel}>
                        {destination.label}
                    </span>
                    <span className={styles.destinationName}>
                        {destination.name}
                    </span>
                </div>
                <button
                    className={styles.deleteButton}
                    onClick={() => onDelete(index)}
                >
                    삭제
                </button>
            </li>
        ))}
    </ul>
);

export default function Recommendation() {
    // 컴포넌트 상태 선언
    const [inputValue, setInputValue] = useState("");
    const [travelDestinations, setTravelDestinations] = useState<Destination[]>(
        []
    );
    const [transportation, setTransportation] = useState("");
    const [isComposing, setIsComposing] = useState(false);
    const [apiResponse, setApiResponse] = useState("");
    const lastLocation = useStore((state) => state.lastLocation);
    const router = useRouter();

    // 입력값 변경 이벤트 핸들러
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) =>
        setInputValue(e.target.value);

    // 입력 구성 시작 및 종료 이벤트 핸들러 (한글 입력 처리용)
    const handleCompositionStart = () => setIsComposing(true);
    const handleCompositionEnd = () => setIsComposing(false);

    // 여행지 추가 이벤트 핸들러
    const handleAddDestination = () => {
        if (!inputValue.trim() || !REGEX_INPUT_VALIDATION.test(inputValue)) {
            alert("올바른 내용을 입력해주세요 (한글, 영문, 숫자만 가능)");
            return;
        }
        const label = String.fromCharCode(
            "A".charCodeAt(0) + travelDestinations.length
        );
        setTravelDestinations((prev) => [...prev, { label, name: inputValue }]);
        setInputValue(""); // 입력 필드 초기화
    };

    // 키보드 이벤트 핸들러 (Enter 키로 여행지 추가)
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (isComposing || e.key !== "Enter") return;
        e.preventDefault();
        handleAddDestination();
    };

    // 여행지 삭제 이벤트 핸들러
    const handleDeleteDestination = (index: number) => {
        setTravelDestinations((prev) => prev.filter((_, idx) => idx !== index));
    };

    // 교통 수단 변경 이벤트 핸들러
    const handleTransportationChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ) => setTransportation(e.target.value);

    // 추천 페이지로 이동 처리 이벤트 핸들러
    const handleGoToRecommendation = async () => {
        if (!travelDestinations.length) {
            alert("다녀온 여행지를 추가해주세요.");
            return;
        }
        if (!transportation) {
            alert("교통 수단을 선택해주세요.");
            return;
        }

        const requestBody = {
            destinations: travelDestinations,
            transportation,
            lastLocation,
        };

        console.log("Sending request with body:", requestBody);

        try {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/recommendations`,
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(requestBody),
                }
            );

            console.log("Received response status:", response.status);

            if (!response.ok) throw new Error("Server response not OK");

            const data = await response.json();
            console.log("Received response data:", data);

            setApiResponse(data.message);
        } catch (error) {
            console.error("Request failed:", error);
        }
    };

    return (
        <main className="flex flex-col h-screen bg-gray-100">
            {/* 입력 및 선택 구역 */}
            <div className={`${styles.inputContainer} flexcenter`}>
                <h1 className={styles.title}>
                    이번여행에서 다녀온 여행지를 추가해주세요
                </h1>
                <div className={styles.inputGroup}>
                    <InputField
                        value={inputValue}
                        onChange={handleInputChange}
                        onKeyDown={handleKeyDown}
                        onCompositionStart={handleCompositionStart}
                        onCompositionEnd={handleCompositionEnd}
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
                        {TRANSPORTATION_OPTIONS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* 여행지 목록 구역 */}
            <div className={styles.listContainer}>
                {travelDestinations.length > 0 ? (
                    <DestinationList
                        destinations={travelDestinations}
                        onDelete={handleDeleteDestination}
                    />
                ) : (
                    <div className={styles.placeholderText}>
                        여기에 다녀온 여행지가 추가됩니다.
                    </div>
                )}
            </div>

            {/* 추천 받기 버튼 */}
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
