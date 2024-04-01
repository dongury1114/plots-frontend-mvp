// recommendation.tsx 파일은 여행지 입력, 삭제, 이동 수단 선택 등의 기능을 제공하는 페이지입니다.

import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import styles from "../styles/pages/recommendation.module.css";
import useStore from "../src/store";

// 정규 표현식 및 교통 수단 옵션 상수 선언
const REGEX_INPUT_VALIDATION = /^[a-zA-Z가-힣0-9\s]*$/;
const TRANSPORTATION_OPTIONS = [
    { value: "car", label: "자동차" },
    { value: "publicTransport", label: "대중교통" },
];

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

interface SearchResultItem {
    name: string;
    address: string;
}

// 입력 필드 컴포넌트의 props 타입 정의
interface InputFieldProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    onCompositionStart: () => void;
    onCompositionEnd: () => void;
}

// 목적지 객체 타입 정의
interface Destination {
    label: string;
    name: string;
}

// 목적지 목록 컴포넌트의 props 타입 정의
interface DestinationListProps {
    destinations: Destination[];
    onDelete: (index: number) => void;
    setTravelDestinations: (destinations: Destination[]) => void; // 여행지 목록 상태를 업데이트하는 함수
}

// 이동 수단 선택 모달 컴포넌트의 props 타입 정의
interface TransportationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (transportation: string) => void;
}

interface TransportationSaveRequest {
    transportation: string;
    location: {
        latitude: number;
        longitude: number;
    };
}

// 목적지 목록 컴포넌트: 추가된 여행지를 나열하고 삭제 기능을 제공
// const DestinationList = ({ destinations, onDelete }: DestinationListProps) => (
//     <ul className={styles.destinationList}>
//         {destinations.map((destination, index) => (
//             <li key={index} className={styles.listItem}>
//                 <div className={styles.destinationInfo}>
//                     <span className={styles.destinationLabel}>
//                         {destination.label}
//                     </span>
//                     <span className={styles.destinationName}>
//                         {destination.name}
//                     </span>
//                 </div>
//                 <button
//                     className={styles.deleteButton}
//                     onClick={() => onDelete(index)}
//                 >
//                     삭제
//                 </button>
//             </li>
//         ))}
//     </ul>
// );

// 목적지 목록 컴포넌트
const DestinationList = ({
    destinations,
    onDelete,
    setTravelDestinations,
}: DestinationListProps) => {
    const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

    const handleDragStart =
        (index: number) => (event: React.DragEvent<HTMLLIElement>) => {
            setDraggedIndex(index); // 드래그 시작 시 해당 아이템의 인덱스 저장
        };

    const handleDragOver = (event: React.DragEvent<HTMLLIElement>) => {
        event.preventDefault(); // 드래그 오버 시 기본 이벤트 방지
    };

    const handleDrop =
        (index: number) => (event: React.DragEvent<HTMLLIElement>) => {
            event.preventDefault();
            if (draggedIndex === null) return;

            // 여행지 목록을 복사하고 드래그된 항목을 새 위치로 이동
            const newList = [...destinations];
            const [reorderedItem] = newList.splice(draggedIndex, 1);
            newList.splice(index, 0, reorderedItem);

            // 각 여행지의 라벨을 업데이트
            const updatedList = newList.map((destination, idx) => ({
                ...destination,
                label: String.fromCharCode("A".charCodeAt(0) + idx), // ASCII 코드를 사용하여 라벨 할당
            }));

            setTravelDestinations(updatedList); // 업데이트된 목록으로 상태 업데이트
            setDraggedIndex(null); // 드래그 상태 초기화
        };

    return (
        <ul className={styles.destinationList}>
            {destinations.map((destination, index) => (
                <li
                    key={index}
                    className={styles.listItem}
                    draggable
                    onDragStart={handleDragStart(index)}
                    onDragOver={handleDragOver}
                    onDrop={handleDrop(index)}
                >
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
};

// 이동 수단 선택 모달 컴포넌트
const TransportationModal = ({
    isOpen,
    onClose,
    onSave,
}: TransportationModalProps) => {
    const [selectedTransportation, setSelectedTransportation] = useState("");

    const handleSave = () => {
        if (selectedTransportation) {
            onSave(selectedTransportation);
            onClose();
        } else {
            alert("이동 수단을 선택해주세요.");
        }
    };

    return isOpen ? (
        <div className={styles.modalOverlay}>
            <div className={styles.modal}>
                <h2>이동 수단을 선택해주세요</h2>
                <select
                    value={selectedTransportation}
                    onChange={(e) => setSelectedTransportation(e.target.value)}
                    className={styles.selectMenu}
                >
                    <option value="">선택하세요</option>
                    {TRANSPORTATION_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                <div className={styles.buttonGroup}>
                    <button onClick={handleSave} className={styles.saveButton}>
                        확인
                    </button>
                    <button onClick={onClose} className={styles.closeButton}>
                        취소
                    </button>
                </div>
            </div>
        </div>
    ) : null;
};

export default function Recommendation() {
    const [inputValue, setInputValue] = useState("");
    const [searchResults, setSearchResults] = useState<SearchResultItem[]>([]);

    const [travelDestinations, setTravelDestinations] = useState<Destination[]>(
        []
    );
    const transportation = useStore((state) => state.transportation);
    const setTransportation = useStore((state) => state.setTransportation);
    const [isComposing, setIsComposing] = useState(false);
    const [isTransportationModalOpen, setIsTransportationModalOpen] =
        useState(false);
    const [apiResponse, setApiResponse] = useState("");
    const lastLocation = useStore((state) => state.lastLocation);
    const router = useRouter();

    const searchResultsRef = useRef(null); // 검색 결과 목록의 ref

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

        // 중복 체크 로직
        const isDuplicate = travelDestinations.some(
            (destination) => destination.name === inputValue.trim()
        );

        if (isDuplicate) {
            alert("이미 추가된 여행지입니다. 다른 여행지를 입력해주세요.");
            return;
        }

        const label = String.fromCharCode(
            "A".charCodeAt(0) + travelDestinations.length
        );
        setTravelDestinations((prev) => [
            ...prev,
            { label, name: inputValue.trim() },
        ]);
        setInputValue(""); // 입력 필드 초기화
    };

    // 이동 수단을 Zustand 스토어에 저장하는 예시
    const handleSaveTransportation = (selectedTransportation: string) => {
        setTransportation(selectedTransportation);
        setIsTransportationModalOpen(false);
        router.push("/result");
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

    const handleGoToRecommendation = () => {
        // 교통수단이 선택되지 않았다면 사용자에게 알립니다.
        if (!transportation) {
            // alert("교통수단을 선택해주세요.");
            setIsTransportationModalOpen(true);
            return;
        }

        // 교통수단이 선택되었다면 result 페이지로 넘어갑니다.
        console.log("교통수단 선택 완료:", transportation);
        router.push("/result");
    };

    // const handleGoToRecommendation = () => {
    //     if (travelDestinations.length === 0) {
    //         alert("다녀온 여행지를 추가해주세요.");
    //         return;
    //     }

    //     if (!transportation) {
    //         alert("교통수단을 선택해주세요.");
    //         return;
    //     }

    //     if (navigator.geolocation) {
    //         navigator.geolocation.getCurrentPosition(
    //             (position) => {
    //                 const { latitude, longitude } = position.coords;
    //                 handleTransportationSave(
    //                     transportation,
    //                     latitude,
    //                     longitude
    //                 );
    //             },
    //             (error) => {
    //                 console.error("Error getting current location:", error);
    //                 alert("위치 정보를 가져오는데 실패했습니다.");
    //             }
    //         );
    //     } else {
    //         alert("Geolocation이 지원되지 않는 브라우저입니다.");
    //     }
    // };

    // 이동 수단 저장 이벤트 핸들러
    const handleTransportationSave = async (
        selectedTransportation: string,
        latitude: number,
        longitude: number
    ) => {
        const requestBody = {
            destinations: travelDestinations.map((destination) => ({
                label: destination.label,
                name: destination.name,
            })),
            transportation: selectedTransportation,
            currentLocation: {
                latitude: latitude,
                longitude: longitude,
            },
        };

        // router.push({
        //     pathname: "/result",
        // });
    };

    // 원래 추천요청 코드
    // const handleTransportationSave = async (selectedTransportation: string) => {
    //     const requestBody = {
    //         destinations: travelDestinations.map((destination) => ({
    //             label: destination.label,
    //             name: destination.name,
    //         })),
    //         transportation: selectedTransportation,
    //         currentLocation: lastLocation,
    //     };

    //     // 서버로 POST 요청을 보냅니다.
    //     try {
    //         const response = await fetch(
    //             `${process.env.NEXT_PUBLIC_API_URL}/api/recommendation`,
    //             {
    //                 method: "POST",
    //                 headers: { "Content-Type": "application/json" },
    //                 body: JSON.stringify(requestBody),
    //             }
    //         );

    //         if (!response.ok) throw new Error("추천 요청에 실패했습니다.");
    //         const data = await response.json();
    //         console.log("Received response data:", data);
    //         router.push({
    //             pathname: "/result",
    //             query: { recommendations: JSON.stringify(data) },
    //         });

    //         setApiResponse(data);
    //     } catch (error) {
    //         console.error("추천 요청에 실패했습니다:", error);
    //     }
    // };

    useEffect(() => {
        const fetchUserLocation = () => {
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        const { latitude, longitude } = position.coords;
                        handleTransportationSave(
                            transportation,
                            latitude,
                            longitude
                        );
                    },
                    (error) => {
                        console.error("Error getting current location:", error);
                    }
                );
            } else {
                console.log("Geolocation을 지원하지 않는 브라우저입니다.");
            }
        };

        fetchUserLocation();
    }, [transportation]); // 의존성 배열에 'transportation'을 추가하여 'transportation' 값이 변경될 때마다 useEffect가 재실행되도록 합니다.

    useEffect(() => {
        const debounceId = setTimeout(() => {
            if (inputValue.trim() !== "") {
                fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/api/search?query=${encodeURIComponent(inputValue)}`,
                    {
                        method: "GET",
                    }
                )
                    .then((response) => {
                        if (!response.ok) {
                            throw new Error("Network response was not ok");
                        }
                        return response.json();
                    })
                    .then((data) => {
                        // 응답 데이터에서 'items' 배열을 추출하여 'searchResults' 상태를 업데이트합니다.
                        // 'title'과 'address' 정보를 활용하여 결과를 표시합니다.
                        const formattedResults = data.results.map((item) => ({
                            name: item.title.replace(/<[^>]+>/g, ""), // HTML 태그 제거
                            address: item.address,
                        }));
                        setSearchResults(formattedResults);
                    })
                    .catch((error) => {
                        console.error(
                            "There was a problem with the fetch operation:",
                            error
                        );
                    });
            } else {
                setSearchResults([]);
            }
        }, 300); // 300ms 디바운스

        return () => clearTimeout(debounceId);
    }, [inputValue]); // inputValue 변경 시에만 실행

    useEffect(() => {
        // 외부 클릭을 감지하는 함수
        const handleClickOutside = (event) => {
            // searchResultsRef.current가 null이 아니고, event.target이 searchResultsRef.current의 자식이 아닌 경우
            if (
                searchResultsRef.current &&
                !searchResultsRef.current.contains(event.target)
            ) {
                setSearchResults([]); // 외부 클릭 시 검색 결과 목록 숨김
            }
        };

        // 'mousedown' 이벤트 리스너 추가
        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            // 컴포넌트 언마운트 시 이벤트 리스너 제거
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [searchResultsRef]); // searchResultsRef가 변경될 때마다 이 useEffect를 재실행

    const createNewLabel = () => {
        const lastLabelCharCode =
            travelDestinations.length > 0
                ? travelDestinations[
                      travelDestinations.length - 1
                  ].label.charCodeAt(0)
                : "A".charCodeAt(0) - 1; // 'A'의 char code 전 값
        return String.fromCharCode(lastLabelCharCode + 1);
    };

    return (
        <>
            <h1 className={styles.title}>다녀온 여행지를 알려주세요</h1>
            <main className={`${styles.recommendationWrap} flex flex-col`}>
                {/* 입력 및 검색 결과 표시 영역 */}
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

                    {/* 검색 결과 목록을 표시하는 부분 */}
                    {searchResults.length > 0 && (
                        <ul className={styles.searchResults}>
                            {searchResults.map((result, index) => (
                                <li
                                    key={index}
                                    onClick={() => {
                                        // 다녀온 여행지 목록에 항목 추가
                                        const newDestination = {
                                            label: createNewLabel(),
                                            name: result.name,
                                        };
                                        setTravelDestinations([
                                            ...travelDestinations,
                                            newDestination,
                                        ]);
                                        setSearchResults([]); // 검색 결과 목록 숨김
                                        setInputValue(""); // 입력 필드 내용 초기화
                                    }}
                                >
                                    <strong>{result.name}</strong>

                                    {result.address}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                {/* 여행지 목록 구역 */}
                <div className={styles.listContainer}>
                    {travelDestinations.length > 0 ? (
                        <DestinationList
                            destinations={travelDestinations}
                            onDelete={handleDeleteDestination}
                            setTravelDestinations={setTravelDestinations}
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
                        추천받기
                    </button>
                </div>
            </main>
            <TransportationModal
                isOpen={isTransportationModalOpen}
                onClose={() => setIsTransportationModalOpen(false)}
                onSave={handleSaveTransportation}
            />
        </>
    );
}
