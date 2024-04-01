import React, { useState, useEffect } from "react";
import Link from "next/link";
import useStore from "../src/store";
import styles from "../styles/pages/index.module.css";

export default function HomePage() {
    return (
        <div>
            <div className={styles.headerSection}>
                <h1>PLOTS와 함께</h1>
            </div>
            <div className={styles.contentSection_1}>
                <p>고민하지말고</p>
            </div>
            <div className={styles.contentSection_2}>
                <p>다음 여행지를 찾아보세요.</p>
            </div>
            <div className={styles.moveSection}>
                <Link href="/now" className={styles.moveSectionLink}>
                    다음여행지는 어디?
                </Link>
            </div>
        </div>
    );
}
