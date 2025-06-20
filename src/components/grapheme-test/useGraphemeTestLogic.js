// components/grapheme-test/useGraphemeTestLogic.js
"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

export const useGraphemeTestLogic = ({
  letters,
  LETTER_TIMER_DURATION,
  childId,
  language,
  inputRef,
  onTestComplete,
  isTestUIVisible,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(LETTER_TIMER_DURATION);
  const [userInputs, setUserInputs] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const [inputStatus, setInputStatus] = useState({});

  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const isRecordingRef = useRef(isRecording);

  useEffect(() => {
    if (letters && letters.length > 0) {
      setUserInputs(Array(letters.length).fill(""));
      setInputStatus({});
      setCurrentIndex(0);
    } else {
      setUserInputs([]);
      setInputStatus({});
      setCurrentIndex(0);
    }
  }, [letters]);

  useEffect(() => {
    isRecordingRef.current = isRecording;
  }, [isRecording]);

  const stopListening = useCallback((indexToUpdate) => {
    const wasRecording = isRecordingRef.current;
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        console.error("Error stopping MediaRecorder:", e);
      }
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
    if (wasRecording) setIsRecording(false);
  }, []);

  const uploadAudio = useCallback(
    async (audioBlob, indexToUpdate) => {
      if (!childId) {
        toast.error("Child ID not found for audio upload.");
        setInputStatus((prev) => ({ ...prev, [indexToUpdate]: "error" }));
        setIsRecording(false);
        return;
      }
      if (!audioBlob || audioBlob.size === 0) {
        setInputStatus((prev) => ({
          ...prev,
          [indexToUpdate]:
            prev[indexToUpdate] === "done_typed" ? "done_typed" : "error",
        }));
        return;
      }
      const formData = new FormData();
      formData.append(
        "file",
        new File(
          [audioBlob],
          `grapheme_test_child_${childId}_index_${indexToUpdate}_${Date.now()}.wav`,
          { type: "audio/wav" }
        )
      );
      formData.append("language", language);
      setInputStatus((prev) => ({ ...prev, [indexToUpdate]: "pending" }));

      try {
        const response = await fetch("/api/speech-to-text", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        if (response.ok && result.transcription != null) {
          const transcribedText = result.transcription.trim().toLowerCase();
          setUserInputs((prevInputs) => {
            const newInputs = [...prevInputs];
            if ((inputStatus[indexToUpdate] || "pending") !== "done_typed") {
              newInputs[indexToUpdate] = transcribedText;
              setInputStatus((prev) => ({
                ...prev,
                [indexToUpdate]: transcribedText ? "done_voice" : "error",
              }));
              if (!transcribedText && letters[indexToUpdate])
                toast.error(
                  `Heard nothing clearly for "${letters[indexToUpdate]}". Try typing.`
                );
            }
            return newInputs;
          });
        } else {
          if (letters[indexToUpdate])
            toast.error(
              `Transcription failed for "${letters[indexToUpdate]}". Try typing.`
            );
          setInputStatus((prev) => ({
            ...prev,
            [indexToUpdate]:
              (inputStatus[indexToUpdate] || "pending") !== "done_typed"
                ? "error"
                : "done_typed",
          }));
        }
      } catch (error) {
        console.error("Audio Upload Error:", error);
        if (letters[indexToUpdate])
          toast.error(
            `Error processing audio for "${letters[indexToUpdate]}". Try typing.`
          );
        setInputStatus((prev) => ({
          ...prev,
          [indexToUpdate]:
            (inputStatus[indexToUpdate] || "pending") !== "done_typed"
              ? "error"
              : "done_typed",
        }));
      } finally {
        if (
          currentIndex === indexToUpdate &&
          !(
            inputStatus[currentIndex] === "done_voice" ||
            isRecordingRef.current ||
            inputStatus[currentIndex] === "done_typed"
          )
        ) {
          inputRef.current?.focus();
        }
      }
    },
    [childId, language, letters, currentIndex, inputStatus, inputRef]
  );

  const startListening = useCallback(() => {
    if (isRecordingRef.current || !letters || currentIndex >= letters.length)
      return;
    const currentStatus = inputStatus[currentIndex] || "idle";
    if (["done_voice", "pending", "done_typed"].includes(currentStatus)) {
      toast.info("Input already processed or pending for this letter.");
      return;
    }
    setUserInputs((prev) => {
      const ni = [...prev];
      ni[currentIndex] = "";
      return ni;
    });
    setInputStatus((prev) => ({ ...prev, [currentIndex]: "recording" }));
    setIsRecording(true);
    audioChunksRef.current = [];

    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        streamRef.current = stream;
        if (stream.getAudioTracks().length > 0) {
          stream.getAudioTracks()[0].onended = () => {
            if (isRecordingRef.current) stopListening(currentIndex);
          };
        }
        const recorder = new MediaRecorder(stream);
        mediaRecorderRef.current = recorder;
        recorder.ondataavailable = (e) => {
          if (e.data && e.data.size > 0) audioChunksRef.current.push(e.data);
        };
        recorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, {
            type: "audio/wav",
          });
          if (
            inputStatus[currentIndex] === "recording" ||
            inputStatus[currentIndex] === "pending"
          ) {
            uploadAudio(audioBlob, currentIndex);
          }
          audioChunksRef.current = [];
        };
        recorder.onerror = (e) => {
          console.error("MediaRecorder error:", e);
          toast.error("Recording error encountered.");
          setInputStatus((prev) => ({ ...prev, [currentIndex]: "error" }));
          stopListening(currentIndex);
        };
        recorder.start();
      })
      .catch((err) => {
        console.error("getUserMedia error:", err);
        toast.error("Microphone access denied or unavailable.");
        setInputStatus((prev) => ({ ...prev, [currentIndex]: "error" }));
        setIsRecording(false);
      });
  }, [currentIndex, letters, stopListening, uploadAudio, inputStatus]);

  const handleNextInternal = useCallback(() => {
    if (!letters || currentIndex >= letters.length) return;

    // *** MODIFICATION: Guard against advancing while transcription is pending ***
    if (inputStatus[currentIndex] === "pending") {
      toast.info("Please wait, transcription is in progress...");
      return;
    }

    stopListening(currentIndex);
    if (currentIndex < letters.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      // This advances currentIndex to letters.length, triggering onTestComplete
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, letters, stopListening, inputStatus]); // Added inputStatus to dependency array

  useEffect(() => {
    if (
      isTestUIVisible &&
      letters &&
      letters.length > 0 &&
      currentIndex < letters.length
    ) {
      setTimeLeft(LETTER_TIMER_DURATION);
      inputRef.current?.focus();
    }
  }, [currentIndex, letters, isTestUIVisible, LETTER_TIMER_DURATION, inputRef]);

  useEffect(() => {
    const isPending = inputStatus[currentIndex] === "pending";

    if (
      !isTestUIVisible ||
      !letters ||
      letters.length === 0 ||
      currentIndex >= letters.length ||
      timeLeft <= 0 ||
      isPending
    ) {
      if (
        timeLeft <= 0 &&
        isTestUIVisible &&
        letters &&
        currentIndex < letters.length &&
        !isPending
      ) {
        handleNextInternal();
      }
      return;
    }

    const timerId = setTimeout(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => clearTimeout(timerId);
  }, [
    timeLeft,
    currentIndex,
    letters,
    isTestUIVisible,
    handleNextInternal,
    inputStatus,
  ]);

  useEffect(() => {
    if (letters && letters.length > 0 && currentIndex === letters.length) {
      stopListening(-1);
      if (onTestComplete) {
        onTestComplete();
      }
    }
  }, [currentIndex, letters, onTestComplete, stopListening]);

  const handleInputChange = (e) => {
    const value = e.target.value;
    const currentItemStatus = inputStatus[currentIndex] || "idle";
    if (["pending", "done_voice", "recording"].includes(currentItemStatus)) {
      if (currentItemStatus === "recording")
        toast.error("Stop recording before typing.");
      else toast.error("Clear voice input to type, or wait for transcription.");
      return;
    }
    setUserInputs((prev) => {
      const ni = [...prev];
      ni[currentIndex] = value;
      return ni;
    });
    setInputStatus((prev) => ({
      ...prev,
      [currentIndex]: value ? "done_typed" : "idle",
    }));
  };

  const handleRecordButtonClick = () => {
    if (isRecordingRef.current) {
      stopListening(currentIndex);
    } else {
      const currentItemStatus = inputStatus[currentIndex] || "idle";
      if (["done_typed", "done_voice", "pending"].includes(currentItemStatus)) {
        toast.info(
          "Input already provided or pending. Clear or wait to re-record."
        );
        return;
      }
      startListening();
    }
  };

  const resetLogic = useCallback(() => {
    setCurrentIndex(0);
    setTimeLeft(LETTER_TIMER_DURATION);
    setUserInputs(Array(letters?.length || 0).fill(""));
    setIsRecording(false);
    setInputStatus({});
    audioChunksRef.current = [];
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state === "recording"
    ) {
      try {
        mediaRecorderRef.current.stop();
      } catch (e) {
        /*ignore*/
      }
    }
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    mediaRecorderRef.current = null;
  }, [letters, LETTER_TIMER_DURATION]);

  useEffect(() => () => stopListening(-1), [stopListening]);

  return {
    currentIndex,
    timeLeft,
    userInputs,
    isRecording,
    inputStatus,
    handleInputChange,
    handleRecordButtonClick,
    handleNext: handleNextInternal,
    resetLogic,
  };
};