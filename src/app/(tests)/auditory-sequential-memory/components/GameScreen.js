'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MicOff, Mic, CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'react-toastify';
// Removed AudioPlayer if it's not directly used for playback *within* GameScreen
// If it's for user's recorded audio, you might need to adapt.
// import AudioPlayer from './AudioPlayer'; // Not used in the provided snippet

// These constants should ideally be defined in the parent and passed down if needed,
// but for MAX_ERRORS, it's used only for display here, so keeping it is okay.
const DIGIT_DISPLAY_TIME = 1000; // This is a display constant, doesn't control logic here
const PAUSE_BETWEEN_DIGITS = 200; // This is a display constant, doesn't control logic here
const MAX_ERRORS = 2; // Used for rendering error circles

export default function GameScreen({
    // Props passed from parent (page.js)
    gameState, // 'presenting', 'listening', 'evaluating'
    mode, // 'forward' or 'reverse'
    displayedDigit, // The single digit to show
    isRecording, // true/false for microphone
    isTranscribing, // true/false for API call
    transcript, // The transcribed text from user
    evaluationResult, // 'correct' / 'incorrect' / null

    // Functions/data passed from parent
    langData, // All language-specific data including digitMap
    t, // Translation function
    backendURL, // Backend URL for API calls
    language, // Current language for speech synthesis and transcription

    // Callbacks to trigger actions in the parent
    onRecordingStop, // Called when user manually stops recording
    onRecordingStartAuto, // Called when game state transitions to listening and recording should auto-start
    onUploadAudio, // Callback to send audio blob to parent for transcription
    onEvaluateAnswer, // Callback to trigger evaluation in parent
}) {
    // Refs for MediaRecorder and timeouts
    const mediaRecorderRef = useRef(null);
    const timeoutRef = useRef(null);
    const isRecordingRef = useRef(isRecording); // To get current `isRecording` value in async callbacks

    // Update isRecording ref whenever isRecording prop changes
    useEffect(() => {
        isRecordingRef.current = isRecording;
    }, [isRecording]);

    // Speech synthesis function - remains similar
    const speakText = useCallback((text, rate = 0.9, pitch = 1.1) => {
        if (!text) {
            console.warn('speakText called with empty text.');
            return;
        }
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const speech = new SpeechSynthesisUtterance(text);
            speech.rate = rate;
            speech.pitch = pitch;

            // Set language for speech synthesis
            if (language === 'ta') {
                speech.lang = 'ta-IN';
            } else if (language === 'hi') {
                speech.lang = 'hi-IN';
            } else {
                speech.lang = 'en-US';
            }

            speech.onend = () => { /* console.log('Speech finished'); */ };
            speech.onerror = (event) => {
                console.error('Speech synthesis error:', event.error);
                if (t) toast.error(t('speech_synthesis_error') || 'Speech synthesis error.');
            };

            window.speechSynthesis.speak(speech);
        } else {
            console.warn('Speech synthesis not supported in this browser.');
            if (t) toast.warn(t('speech_synthesis_not_supported') || 'Speech synthesis not supported.');
        }
    }, [language, t]); // Dependencies for useCallback

    // Audio recording functions
    const stopListening = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            try {
                mediaRecorderRef.current.stop();
            } catch (e) {
                console.error('Error stopping MediaRecorder:', e);
            }
        }

        if (window.stream) { // Assume window.stream is managed globally or passed as prop
            try {
                window.stream.getTracks().forEach((track) => {
                    track.stop();
                });
            } catch (e) {
                console.error('Error stopping stream tracks:', e);
            }
            window.stream = null;
        }

        mediaRecorderRef.current = null;
        // Signal to parent that recording has stopped
        if (onRecordingStop) {
            onRecordingStop();
        }
    }, [onRecordingStop]);

    const startListening = useCallback(() => {
        if (isRecordingRef.current) { // Prevent multiple starts
            return;
        }

        // Reset display states only relevant to GameScreen
        // `transcript`, `evaluationResult` are handled by parent

        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                window.stream = stream; // Store stream globally or pass back to parent
                let localAudioChunks = [];

                if (stream.getAudioTracks().length > 0) {
                    stream.getAudioTracks()[0].onended = () => {
                        console.warn('Audio track ended unexpectedly!');
                        stopListening();
                    };
                }

                const newMediaRecorder = new MediaRecorder(stream);
                mediaRecorderRef.current = newMediaRecorder;

                newMediaRecorder.ondataavailable = (event) => {
                    if (event.data && event.data.size > 0) {
                        localAudioChunks.push(event.data);
                    }
                };

                newMediaRecorder.onstop = async () => {
                    if (localAudioChunks.length > 0) {
                        const audioBlob = new Blob(localAudioChunks, { type: 'audio/wav' });
                        // Callback to parent to handle audio upload/transcription
                        if (onUploadAudio) {
                            onUploadAudio(audioBlob);
                        }
                    } else {
                        console.log('No audio chunks recorded in onstop. Not uploading.');
                        if (t) toast.warn(t('no_audio_detected') || 'No audio detected. Please speak clearly.');
                        // If no audio, perhaps signal parent to allow re-attempt or next sequence
                        if (onRecordingStop) onRecordingStop(); // Stop recording state
                        // Decide if game state should revert to listening or move to next
                        // This logic is better in parent (`page.js`)
                    }
                };

                newMediaRecorder.onerror = (event) => {
                    console.error('MediaRecorder error event:', event.error);
                    if (t) toast.error(t('media_recorder_error') || 'Recording error occurred.');
                    stopListening();
                };

                try {
                    newMediaRecorder.start();
                    // Signal to parent that recording has started
                    if (onRecordingStartAuto) onRecordingStartAuto(true); // Assuming parent sets isRecording
                } catch (e) {
                    console.error('Error calling MediaRecorder.start():', e);
                    if (t) toast.error(t('recording_start_error') || 'Failed to start recording.');
                    stopListening();
                    return;
                }
            })
            .catch((error) => {
                console.error('Error accessing microphone:', error);
                if (t) toast.error(t('microphone_access_error'));
                stopListening();
            });
    }, [onUploadAudio, stopListening, onRecordingStartAuto, t]);


    // Effect to auto-start recording when in listening state
    // This is the primary trigger for mic in GameScreen, based on parent's gameState
    useEffect(() => {
        if (gameState === 'listening' && t) {
            speakText(
                mode === 'forward'
                    ? t('your_turn_say_numbers')
                    : t('your_turn_say_numbers_backwards')
            );

            const startTimeout = setTimeout(() => {
                // Only start if not already recording (checked by isRecordingRef.current)
                // The parent component should control `isRecording` state based on `onRecordingStartAuto`
                if (!isRecordingRef.current) {
                    startListening();
                }
            }, 1500);

            return () => {
                clearTimeout(startTimeout);
            };
        }
    }, [gameState, startListening, mode, t, speakText]);


    // Trigger evaluation when transcript is ready from parent
    // This effect should only run if `gameState` is 'evaluating' AND `transcript` is received.
    useEffect(() => {
        if (gameState === 'evaluating' && transcript && onEvaluateAnswer) {
            // Delay evaluation slightly to allow UI updates or for speakText to finish
            const evaluationDelay = setTimeout(() => {
                onEvaluateAnswer(transcript); // Pass transcript to parent for evaluation
            }, 500); // Small delay to ensure `transcript` state is settled

            return () => clearTimeout(evaluationDelay);
        }
    }, [gameState, transcript, onEvaluateAnswer]); // Depends on relevant props


    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            stopListening(); // Ensure microphone is released
        };
    }, [stopListening]);


    // GameScreen no longer manages the progress through sequence presentation.
    // It just displays `displayedDigit` when available.
    const renderPresenting = () => (
        <motion.div
            className="flex flex-col items-center justify-center space-y-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <div className="relative h-80 w-80 flex items-center justify-center">
                <AnimatePresence>
                    {displayedDigit !== null && (
                        <motion.div
                            key={displayedDigit} // Use displayedDigit as key for re-animation
                            initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                                rotate: 0,
                                transition: { type: 'spring', stiffness: 200, damping: 15 },
                            }}
                            exit={{ opacity: 0, scale: 0.5, rotate: 10 }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="text-9xl font-bold text-blue-600 p-10 bg-white rounded-2xl shadow-lg border border-gray-100">
                                {displayedDigit}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            <motion.div
                className="text-2xl font-medium text-gray-700 bg-blue-50 px-8 py-4 rounded-xl shadow-sm"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
            >
                {t ? t('listen_carefully') : 'Listen carefully'}
            </motion.div>
        </motion.div>
    );

    const renderListening = () => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center space-y-8 p-10 bg-white rounded-2xl shadow-lg max-w-3xl mx-auto border border-gray-100"
        >
            <h3 className="text-2xl font-bold text-gray-800">
                {mode === 'forward'
                    ? (t ? t('repeat_numbers_order') : 'Repeat the numbers in order')
                    : (t ? t('say_numbers_reverse') : 'Say the numbers in reverse order')}
            </h3>

            <div className="flex items-center gap-6">
                <motion.button
                    onClick={stopListening} // This button triggers `stopListening`
                    disabled={!isRecording}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={`relative rounded-xl h-16 w-16 flex items-center justify-center transition-all duration-300 shadow-md ${
                        !isRecording
                            ? 'bg-gray-100 cursor-not-allowed text-gray-400'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                >
                    {isRecording ? <MicOff size={32} /> : <Mic size={32} />}
                    {isRecording && (
                        <motion.span
                            className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full"
                            animate={{ scale: [1, 1.2, 1] }}
                            transition={{ repeat: Infinity, duration: 1.5 }}
                        />
                    )}
                </motion.button>

                {isRecording && !isTranscribing && (
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-xl"
                    >
                        <span className="text-lg font-medium">{t ? t('recording') : 'Recording'}</span>
                        <span className="flex gap-0.5">
                            <motion.span
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
                            >
                                •
                            </motion.span>
                            <motion.span
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: 0.5 }}
                            >
                                •
                            </motion.span>
                            <motion.span
                                animate={{ opacity: [0, 1, 0] }}
                                transition={{ repeat: Infinity, duration: 1.5, delay: 1 }}
                            >
                                •
                            </motion.span>
                        </span>
                    </motion.div>
                )}
            </div>

            {isTranscribing && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex flex-col items-center space-y-4"
                >
                    <motion.div
                        className="w-16 h-16 relative"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                    >
                        <div className="absolute inset-0 border-4 border-blue-200 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-blue-600 rounded-full border-t-transparent"></div>
                    </motion.div>
                    <div className="text-xl text-blue-600 font-medium">
                        {t ? t('processing_your_answer') : 'Processing your answer...'}
                    </div>
                </motion.div>
            )}

            {transcript && !isTranscribing && (
                <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-xl"
                >
                    <p className="text-lg text-gray-600">
                        {t ? t('you_said') : 'You said'}:{' '}
                        <strong className="text-gray-800">{transcript}</strong>
                    </p>
                </motion.div>
            )}

            <AnimatePresence>
                {evaluationResult && (
                    <motion.div
                        key="evaluationFeedback"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="flex flex-col items-center space-y-4 mt-6"
                    >
                        {evaluationResult === 'correct' ? (
                            <>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                >
                                    <CheckCircle size={48} className="text-green-600" />
                                </motion.div>
                                <motion.div
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-green-50 text-green-600 px-8 py-4 rounded-xl border border-green-200"
                                >
                                    <span className="text-2xl font-bold">{t ? t('correct') : 'Correct'}!</span>
                                </motion.div>
                            </>
                        ) : (
                            <>
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                                >
                                    <XCircle size={48} className="text-blue-600" />
                                </motion.div>
                                <div className="bg-blue-50 text-blue-600 px-8 py-4 rounded-xl border border-blue-200">
                                    <span className="text-2xl font-bold">
                                        {t ? t('lets_try_next_one') : "Let's try the next one"}
                                    </span>
                                </div>
                            </>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );

    return (
        <div className="flex flex-col items-center space-y-10">
            {/* Progress indicator - kept here as per your original structure,
                but ensure props like sequences.length, sequenceIndex etc. are provided by parent. */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-10 bg-white rounded-2xl p-6 shadow-lg border border-gray-100 max-w-3xl mx-auto"
            >
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
                    <div className="flex flex-col md:flex-row md:items-center gap-6">
                        <span className="text-lg font-medium text-gray-600">
                            {t ? t('mode') : 'Mode'}:{' '}
                            <span className="font-bold capitalize text-blue-600">
                                {mode || 'forward'}
                            </span>
                        </span>
                        <span className="text-lg font-medium text-gray-600">
                            {t ? t('sequence') : 'Sequence'}:{' '}
                            {/* Make sure sequenceIndex and sequences.length are passed correctly from parent */}
                            <span className="font-bold text-blue-600">
                                {sequenceIndex + 1}
                            </span>{' '}
                            / <span className="text-gray-600">{sequences.length}</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="text-lg font-medium text-gray-600">
                            {t ? t('errors') : 'Errors'}:
                        </span>
                        <div className="flex gap-2">
                            {[...Array(MAX_ERRORS)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-4 w-4 rounded-full transition-colors duration-300 ${
                                        i < (mode === 'forward' ? forwardErrors : reverseErrors)
                                            ? 'bg-red-500'
                                            : 'bg-gray-200'
                                    }`}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Game content based on gameState prop */}
            <AnimatePresence mode="wait">
                {gameState === 'presenting' && (
                    <motion.div key="presenting" exit={{ opacity: 0 }}>
                        {renderPresenting()}
                    </motion.div>
                )}
                {(gameState === 'listening' || gameState === 'evaluating') && (
                    <motion.div
                        key="listening-evaluating"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {renderListening()}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}