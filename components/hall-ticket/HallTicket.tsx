"use client";

import Image from "next/image";
import type { HallTicketData } from "@/types/hall-ticket";
import styles from "./HallTicket.module.css";

type HallTicketProps = {
  data: HallTicketData;
};

export default function HallTicket({ data }: HallTicketProps) {
  const { candidate, exam, instructions, negativeMarking, collegeName, centerAddress } = data;

  return (
    <div className={styles.page} id="hall-ticket">
      {/* ── Header ── */}
      <header className={styles.header}>
        <h1 className={styles.collegeName}>{collegeName}</h1>
        <p className='font-bold text-lg '>BARH, PATNA</p>
        <h2 className={styles.hallTicketTitle}>Hall Ticket / Admit Card</h2>
        <p className={styles.examTitle}>
          {exam.name} - {exam.date.split("-").pop()}
        </p>
      </header>

      {/* ── Examination Details ── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Examination Details</div>
        <div className={styles.examGrid}>
          <div className={`${styles.fieldLabel} ${styles.examNameLabel}`}>Exam Name</div>
          <div className={`${styles.fieldValue} ${styles.examNameValue}`}>{exam.name}</div>

          <div className={styles.fieldLabel}>Roll No</div>
          <div className={styles.fieldValue}>{candidate.roll || "-"}</div>
          <div className={styles.fieldLabel}>Exam Post</div>
          <div className={styles.fieldValue}>{exam.post}</div>

          <div className={styles.fieldLabel}>Exam Date</div>
          <div className={styles.fieldValue}>{exam.date}</div>
          <div className={styles.fieldLabel}>Exam Timing</div>
          <div className={styles.fieldValue}>{exam.time}</div>
        </div>
      </div>

      {/* ── Candidate Info ── */}
      <div className={styles.section}>
        <div className={styles.candidateSection}>
          <div className={styles.candidateFields}>
            <div className={styles.fieldLabel}>Candidate Name</div>
            <div className={styles.fieldValue}>{candidate.name}</div>

            <div className={styles.fieldLabel}>Father / Guardian</div>
            <div className={styles.fieldValue}>
            {candidate.fathers_name}
            </div>

            <div className={styles.fieldLabel}>Category</div>
            <div className={styles.fieldValue}>{candidate.category}</div>

            <div className={styles.fieldLabel}>Gender</div>
            <div className={styles.fieldValue}>{candidate.gender}</div>

            <div className={styles.fieldLabel}>Date of Birth</div>
            <div className={styles.fieldValue}>{candidate.dob}</div>
          </div>

          {/* Photo + Candidate Signature */}
          <div className={styles.photoSignatureCell}>
            <div className={styles.photoCell}>
              {candidate.profile ? (
                <Image
                  src={candidate.profile}
                  alt={`Photo of ${candidate.name}`}
                  width={100}
                  height={120}
                  className={styles.photo}
                  unoptimized
                />
              ) : (
                <div className={styles.photoPlaceholder}>
                  Candidate<br />Photo
                </div>
              )}
            </div>
            <div className={styles.candidateSignature}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={candidate.signature || ""}
                alt="Candidate Signature"
                className={styles.candidateSignatureImg}
                onError={(e) => {
                  e.currentTarget.src = "";
                }}
              />
              <span className={styles.candidateSignatureLabel}>Candidate Signature</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Examination Centre ── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>Examination Centre</div>
        <table className={styles.centreTable}>
          <thead>
            <tr>
              <th>Reporting Time</th>
              <th>Exam Timing</th>
              <th>Name and Address of Examination Centre</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{exam.reporting}</td>
              <td><strong>{exam.time}</strong></td>
              <td>
                <div className={styles.centreName}>{exam.center}</div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* ── Negative Marking Banner ── */}
      <div className={styles.negativeBanner}>
        {negativeMarking
          ? "There will be negative marking for this examination."
          : "There will be no negative marking for this examination."}
      </div>

      {/* ── Instructions ── */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          Important Instructions for Candidates
        </div>
        <ol className={styles.instructionsList}>
          {instructions.map((instruction, i) => (
            <li key={i}>{instruction}</li>
          ))}
        </ol>
      </div>

      {/* ── Signatures ── */}
      <div className={styles.signatureArea}>
        <div className={styles.signatureBlock}>
          <div className={styles.signatureLine} />
          <span className={styles.signatureLabel}>Invegilator&apos;s Signature</span>
        </div>
        <div className={styles.signatureBlock}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/authorisedSignature.png"
            alt="Authorised Signature"
            className={styles.signatureImage}
          />
          <span className={styles.signatureLabel}>Authorised Signature</span>
        </div>
      </div>

      {/* ── Footer ── */}
      <div className={styles.footer}>
        {exam.center} is located in {centerAddress}, easily accessible by public transportation.
      </div>
    </div>
  );
}
