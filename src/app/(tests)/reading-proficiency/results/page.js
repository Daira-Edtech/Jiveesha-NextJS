"use client";
import { Suspense } from "react";
import TestResults from "../../../../components/tests/reading-proficiency/TestResults";

export default function ReadingProficiencyResults() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TestResults />
    </Suspense>
  );
}
