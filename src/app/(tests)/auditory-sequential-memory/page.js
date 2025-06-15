'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import WelcomeScreen from './components/WelcomeScreen';
import InstructionsScreen from './components/InstructionsScreen';
import GameScreen from './components/GameScreen'; // Make sure the path is correct
import ResultsScreen from './components/ResultsScreen';
import GameProgressBar from './components/GameProgressBar';

import test13Translations from './test13Translations.json';

const DIGIT_DISPLAY_TIME = 1000;
const PAUSE_BETWEEN_DIGITS = 200;
const MAX_ERRORS = 2;

export default function AuditorySequentialMemoryTest() {
    const router = useRouter();

    // Language context
    const [language, setLanguage] = useState('en'); // Default to English
    // Ensure langData updates when language changes
    const langData = test13Translations[language] || test13Translations.en;

    // Game state management
    const [gameState, setGameState] = useState('instructions'); // welcome, instructions, instructions_reverse, presenting, listening, evaluating, finished
    const [mode, setMode] = useState('forward'); // forward, reverse
    // sequences should be initialized based on the initial mode
    const [sequences, setSequences] = useState(langData.questions.forward);
    const [sequenceIndex, setSequenceIndex] = useState(0);
    const [currentSequence, setCurrentSequence] = useState([]); // The actual sequence being presented (e.g., [4, 9])

    // Display state for GameScreen
    const [displayedDigit, setDisplayedDigit] = useState(null);

    // Scores and errors
    const [forwardScore, setForwardScore] = useState(0);
    const [reverseScore, setReverseScore] = useState(0);
    const [forwardErrors, setForwardErrors] = useState(0);
    const [reverseErrors, setReverseErrors] = useState(0);

    // Audio and transcript state
    const [transcript, setTranscript] = useState('');
    const [isRecording, setIsRecording] = useState(false);
    const [isTranscribing, setIsTranscribing] = useState(false);
    const [evaluationResult, setEvaluationResult] = useState(null); // 'correct', 'incorrect', null

    // Refs
    const mediaRecorderRef = useRef(null);
    const timeoutRef = useRef(null);
    // presentNextDigitLogicRef is no longer needed here as it's the core logic for the presentation loop
    // isRecordingRef is still useful for checking recording state in async callbacks

    // Translation helper
    const t = useCallback((key, params = {}) => {
        const translations = {
            en: {
                memory_test: 'Memory Test',
                welcome_memory_game: 'Welcome to our memory game! This test will challenge your ability to remember sequences of numbers.',
                listen_carefully_numbers: 'Listen carefully to the numbers I say',
                repeat_back_exactly: 'Repeat them back in the exact same order',
                start_easy_get_harder: 'We\'ll start easy and get harder as we go',
                start_test: 'Start Test',
                level_up_reverse_challenge: 'Level Up: Reverse Challenge!',
                now_exciting_twist: 'Now for an exciting twist! This time, you need to say the numbers backwards.',
                if_i_say: 'If I say:',
                you_say: 'You say:',
                start_reverse_challenge: 'Start Reverse Challenge',
                listen_carefully: 'Listen Carefully',
                repeat_numbers_order: 'Repeat the numbers in order',
                say_numbers_reverse: 'Say the numbers in reverse order',
                recording: 'Recording',
                processing_your_answer: 'Processing your answer...',
                you_said: 'You said',
                correct: 'Correct',
                lets_try_next_one: 'Let\'s try the next one',
                challenge_complete: 'Challenge Complete',
                forward_score: 'Forward Score',
                reverse_score: 'Reverse Score',
                final_score: 'Final Score',
                submit_results: 'Submit Results',
                mode: 'Mode',
                sequence: 'Sequence',
                errors: 'Errors',
                your_turn_say_numbers: 'Your turn! Say the numbers.',
                your_turn_say_numbers_backwards: 'Your turn! Say the numbers backwards.',
                start_forward_instructions: 'Starting forward test. Listen carefully and repeat the numbers in the same order.',
                start_reverse_instructions: 'Starting reverse test. Listen carefully and repeat the numbers in reverse order.',
                could_not_understand_numbers: 'Could not understand the numbers clearly.',
                could_not_understand_numbers_clearly: 'Could not understand the numbers clearly. Let\'s try again.',
                transcription_failed: 'Transcription failed. Please try again.',
                audio_upload_error: 'Error uploading audio. Please try again.',
                microphone_access_error: 'Error accessing microphone. Please check permissions.',
                no_student_selected: 'No student selected.',
                test_submitted_success: `Test submitted successfully! Score: ${params.score || 0}`,
                submit_results_failed: 'Failed to submit results.',
                submit_error_check_connection: 'Error submitting results. Please check your connection.',
                not_quite_try_next: 'Not quite right, but let\'s try the next one!',
                speech_synthesis_error: 'Speech synthesis error.',
                speech_synthesis_not_supported: 'Speech synthesis not supported in this browser.',
                media_recorder_error: 'Recording error occurred.',
                recording_start_error: 'Failed to start recording.',
                no_audio_detected: 'No audio detected. Please speak clearly.'
            }
            // Add other languages as needed
        };
        return translations[language]?.[key] || translations.en[key] || key;
    }, [language]);

    // Speech synthesis function
    const speakText = useCallback((text, rate = 0.9, pitch = 1.1) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const speech = new SpeechSynthesisUtterance(text);
            speech.rate = rate;
            speech.pitch = pitch;

            if (language === 'ta') {
                speech.lang = 'ta-IN';
            } else if (language === 'hi') {
                speech.lang = 'hi-IN';
            } else {
                speech.lang = 'en-US';
            }

            speech.onend = () => {
                console.log('Speech finished');
            };
            speech.onerror = (event) => {
                console.error('Speech synthesis error:', event.error);
                toast.error(t('speech_synthesis_error'));
            };

            window.speechSynthesis.speak(speech);
        } else {
            console.warn('Speech synthesis not supported in this browser.');
            toast.warn(t('speech_synthesis_not_supported'));
        }
    }, [language, t]);

    // Parse transcript function
    const parseTranscript = useCallback((transcriptToParse) => {
        if (!transcriptToParse) return [];

        const digitMap = langData.digitMap;
        let cleaned = transcriptToParse.toLowerCase().replace(/[.,!?]/g, '');

        Object.entries(digitMap).forEach(([word, digit]) => {
            cleaned = cleaned.replace(new RegExp(`\\b${word}\\b`, 'g'), digit);
        });

        const spaceSplit = cleaned.trim().split(/\s+/);
        if (spaceSplit.every((item) => /^\d$/.test(item))) {
            return spaceSplit.map(Number);
        }

        const concatenated = cleaned.replace(/\s+/g, '');
        if (/^\d+$/.test(concatenated)) {
            return concatenated.split('').map(Number);
        }

        console.warn('Could not reliably parse transcript:', transcriptToParse);
        toast.warn(t('could_not_understand_numbers'));
        return [];
    }, [langData.digitMap, t]);

    // --- AUDIO RECORDING AND TRANSCRIPTION LOGIC ---
    // These functions are now the *callbacks* that GameScreen will use
    const handleUploadAudio = useCallback(async (audioBlob) => {
        const formData = new FormData();
        const file = new File([audioBlob], 'user_digit_span.wav', {
            type: 'audio/wav',
        });
        formData.append('file', file);
        formData.append('language', language);

        setIsTranscribing(true);
        setEvaluationResult(null); // Reset evaluation result when new audio is uploaded

        try {
            const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
            const response = await fetch(`${backendURL}/transcribe`, {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            console.log('Transcription API Response:', result);

            if (response.ok) {
                setTranscript(result.transcription || ''); // Set transcript here
                setGameState('evaluating'); // Move to evaluating state
            } else {
                console.error('Transcription error response:', result);
                toast.error(t('transcription_failed'));
                setTranscript(''); // Clear transcript on failure
                setGameState('listening'); // Go back to listening for re-attempt
            }
        } catch (error) {
            console.error('Error uploading audio:', error);
            toast.error(t('audio_upload_error'));
            setTranscript(''); // Clear transcript on failure
            setGameState('listening'); // Go back to listening for re-attempt
        } finally {
            setIsTranscribing(false);
        }
    }, [language, t]);

    const handleStopRecording = useCallback(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            try {
                mediaRecorderRef.current.stop();
            } catch (e) {
                console.error('Error stopping MediaRecorder:', e);
            }
        }

        if (window.stream) {
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
        setIsRecording(false); // Update recording state
    }, []);

    const handleStartRecording = useCallback(() => {
        if (isRecording) { // Prevent multiple starts
            return;
        }

        setTranscript(''); // Clear previous transcript
        setEvaluationResult(null); // Clear previous evaluation result

        navigator.mediaDevices
            .getUserMedia({ audio: true })
            .then((stream) => {
                window.stream = stream; // Keep a reference to the stream

                if (stream.getAudioTracks().length === 0) {
                    console.error('No audio tracks found in stream.');
                    toast.error(t('microphone_access_error'));
                    handleStopRecording();
                    return;
                }

                stream.getAudioTracks()[0].onended = () => {
                    console.warn('Audio track ended unexpectedly!');
                    handleStopRecording();
                };

                let localAudioChunks = [];
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
                        localAudioChunks = []; // Clear chunks after use
                        await handleUploadAudio(audioBlob); // Pass to handleUploadAudio
                    } else {
                        console.log('No audio chunks recorded during onstop.');
                        toast.warn(t('no_audio_detected'));
                        // If no audio, let the game state revert or restart listening
                        setGameState('listening'); // Allow re-attempt if no audio was captured
                    }
                };

                newMediaRecorder.onerror = (event) => {
                    console.error('MediaRecorder error event:', event.error);
                    toast.error(t('media_recorder_error'));
                    handleStopRecording();
                };

                try {
                    newMediaRecorder.start();
                    setIsRecording(true); // Set recording state
                } catch (e) {
                    console.error('Error calling MediaRecorder.start():', e);
                    toast.error(t('recording_start_error'));
                    handleStopRecording();
                }
            })
            .catch((error) => {
                console.error('Error accessing microphone:', error);
                toast.error(t('microphone_access_error'));
                handleStopRecording();
            });
    }, [isRecording, handleUploadAudio, handleStopRecording, t]);


    // --- GAME FLOW CONTROL ---

    // Move to next mode (forward -> reverse, or reverse -> finished)
    const moveToNextMode = useCallback(() => {
        handleStopRecording(); // Ensure recording is stopped
        setEvaluationResult(null);
        setTranscript('');

        if (mode === 'forward') {
            // Check if we should even proceed to reverse based on forward errors
            // Or if reverse already has too many errors (unlikely at this transition point, but for safety)
            if (forwardErrors >= MAX_ERRORS) { // If forward mode failed too many times
                // Skip reverse and go straight to finished
                setGameState('finished');
            } else {
                setMode('reverse');
                setSequences(langData.questions.reverse);
                setSequenceIndex(0);
                setGameState('instructions_reverse'); // Show instructions for reverse mode
            }
        } else { // Already in reverse mode
            setGameState('finished'); // Test is complete
        }
    }, [mode, forwardErrors, handleStopRecording, langData.questions.reverse]);


    // Move to next sequence within the current mode
    const moveToNextSequence = useCallback(() => {
        handleStopRecording(); // Ensure recording is stopped
        setEvaluationResult(null);
        setTranscript('');

        if (sequenceIndex + 1 < sequences.length) {
            setSequenceIndex((prev) => prev + 1);
            setGameState('presenting'); // Start presenting the next sequence
        } else {
            // No more sequences in current mode, move to next mode
            moveToNextMode();
        }
    }, [sequenceIndex, sequences.length, moveToNextMode, handleStopRecording]);


    // Evaluate user answer
    const handleEvaluateAnswer = useCallback((receivedTranscript) => {
        const userAnswer = parseTranscript(receivedTranscript);
        const correctAnswer = mode === 'forward' ? currentSequence : [...currentSequence].reverse();

        if (userAnswer.length === 0) {
            toast.warning(t('could_not_understand_numbers_clearly'));
            setTranscript(''); // Clear problematic transcript
            setGameState('listening'); // Allow user to try again for the same sequence
            return;
        }

        let isCorrect =
            userAnswer.length === correctAnswer.length &&
            userAnswer.every((digit, i) => digit === correctAnswer[i]);

        setEvaluationResult(isCorrect ? 'correct' : 'incorrect');

        if (isCorrect) {
            speakText(t('correct'), 0.9, 1.3);
            if (mode === 'forward') setForwardScore((prev) => prev + 1);
            else setReverseScore((prev) => prev + 1);
            // Move to next sequence after a short delay
            timeoutRef.current = setTimeout(() => moveToNextSequence(), 1500);
        } else {
            speakText(t('not_quite_try_next'), 0.9, 1.0);
            if (mode === 'forward') {
                const newErrors = forwardErrors + 1;
                setForwardErrors(newErrors);
                if (newErrors >= MAX_ERRORS) {
                    timeoutRef.current = setTimeout(() => moveToNextMode(), 1500);
                } else {
                    timeoutRef.current = setTimeout(() => moveToNextSequence(), 1500);
                }
            } else { // reverse mode
                const newErrors = reverseErrors + 1;
                setReverseErrors(newErrors);
                if (newErrors >= MAX_ERRORS) {
                    timeoutRef.current = setTimeout(() => moveToNextMode(), 1500);
                } else {
                    timeoutRef.current = setTimeout(() => moveToNextSequence(), 1500);
                }
            }
        }
    }, [
        parseTranscript, mode, currentSequence, forwardErrors, reverseErrors,
        speakText, t, setEvaluationResult, setForwardScore, setReverseScore,
        setForwardErrors, setReverseErrors, moveToNextSequence, moveToNextMode
    ]);


    // --- DIGIT PRESENTATION LOGIC ---
    const presentNextDigit = useCallback((sequence, index) => {
        if (index >= sequence.length) {
            setDisplayedDigit(null); // Clear the digit display
            timeoutRef.current = setTimeout(() => {
                setGameState('listening'); // Transition to listening state
            }, 500); // Short delay before asking for response
            return;
        }

        const digit = sequence[index];
        setDisplayedDigit(digit); // Set the digit to be displayed in GameScreen
        speakText(String(digit), 1, 1.2); // Speak the digit

        timeoutRef.current = setTimeout(() => {
            setDisplayedDigit(null); // Clear digit after display time
            timeoutRef.current = setTimeout(() => {
                presentNextDigit(sequence, index + 1); // Recurse for the next digit
            }, PAUSE_BETWEEN_DIGITS); // Pause between digits
        }, DIGIT_DISPLAY_TIME); // How long each digit is displayed
    }, [speakText]); // Only depends on speakText for stable reference

    // Effect to start the presentation of a new sequence
    useEffect(() => {
        if (gameState === 'presenting' && sequences && sequences.length > 0 && sequenceIndex < sequences.length) {
            const sequenceToPresent = sequences[sequenceIndex];
            setCurrentSequence(sequenceToPresent); // Store for evaluation later
            setDisplayedDigit(null); // Clear any old digit
            setTranscript(''); // Clear previous transcript
            setEvaluationResult(null); // Clear previous evaluation

            // Clear any existing timeout before starting a new sequence presentation
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            timeoutRef.current = setTimeout(
                () => presentNextDigit(sequenceToPresent, 0), // Start from the first digit
                500 // Initial delay before the first digit appears
            );
        }
        // Cleanup function for this effect
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [gameState, sequenceIndex, sequences, presentNextDigit]);


    // Cleanup effect for unmount
    useEffect(() => {
        return () => {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
            if (timeoutRef.current) clearTimeout(timeoutRef.current);
            handleStopRecording(); // Ensure microphone is released on unmount
        };
    }, [handleStopRecording]);


    // Test start handlers
    const startTest = useCallback((selectedMode) => {
        setMode(selectedMode);
        // Reset sequence index and set sequences based on selected mode
        setSequences(
            selectedMode === 'forward'
                ? langData.questions.forward
                : langData.questions.reverse
        );
        setSequenceIndex(0);
        // Reset scores and errors for the new test run
        setForwardScore(0);
        setReverseScore(0);
        setForwardErrors(0);
        setReverseErrors(0);
        // Reset any transcription/evaluation states
        setTranscript('');
        setEvaluationResult(null);
        // Transition to presenting state to start the first sequence
        setGameState('presenting');
    }, [langData.questions]);

    const handleStartForward = useCallback(() => {
        speakText(t('start_forward_instructions'));
        // Delay starting the test slightly to allow speech to finish
        setTimeout(() => startTest('forward'), 1000);
    }, [startTest, speakText, t]);

    const handleStartReverse = useCallback(() => {
        speakText(t('start_reverse_instructions'));
        // Delay starting the test slightly to allow speech to finish
        setTimeout(() => startTest('reverse'), 1000);
    }, [startTest, speakText, t]);


    // Submit results
    const submitResults = useCallback(async () => {
        try {
            const backendURL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
            const token = localStorage.getItem('access_token');
            const childId = localStorage.getItem('childId');

            if (!childId) {
                toast.error(t('no_student_selected'));
                return;
            }

            // Calculate final score - maybe average, or total correct sequences
            const finalScore = Math.round((forwardScore + reverseScore) / 2);

            const response = await fetch(`${backendURL}/addTest13`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    childId: childId,
                    score: finalScore,
                    forwardCorrect: forwardScore,
                    reverseCorrect: reverseScore,
                }),
            });

            if (response.status === 201) {
                toast.success(t('test_submitted_success', { score: finalScore }), {
                    position: 'top-center',
                    autoClose: 5000,
                    onClose: () => router.push('/'), // Redirect after success
                });
            } else {
                toast.error(t('submit_results_failed'));
            }
        } catch (error) {
            console.error('Error submitting test results:', error);
            toast.error(t('submit_error_check_connection'));
        }
    }, [forwardScore, reverseScore, router, t]);

    // Render different screens based on game state
    const renderCurrentScreen = () => {
        switch (gameState) {
            case 'instructions':
                return (
                    <WelcomeScreen
                        onStart={handleStartForward}
                        t={t}
                    />
                );
            case 'instructions_reverse':
                return (
                    <InstructionsScreen
                        onStart={handleStartReverse}
                        t={t}
                    />
                );
            case 'presenting':
            case 'listening':
            case 'evaluating':
                return (
                    <GameScreen
                        // Props for GameScreen's display
                        gameState={gameState} // Crucial for GameScreen to know what to render
                        mode={mode}
                        displayedDigit={displayedDigit} // This comes directly from page.js's presentation loop
                        isRecording={isRecording}
                        isTranscribing={isTranscribing}
                        transcript={transcript}
                        evaluationResult={evaluationResult}

                        // Data props
                        langData={langData} // Pass the entire langData object
                        t={t}
                        backendURL={process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001'}
                        language={language} // Pass current language for speech synthesis

                        // Callbacks for GameScreen to communicate back to page.js
                        onRecordingStop={handleStopRecording} // GameScreen button presses this
                        onRecordingStartAuto={handleStartRecording} // GameScreen requests auto-start
                        onUploadAudio={handleUploadAudio} // GameScreen gives audio blob
                        onEvaluateAnswer={handleEvaluateAnswer} // GameScreen indicates transcript is ready
                    />
                );
            case 'finished':
                return (
                    <ResultsScreen
                        forwardScore={forwardScore}
                        reverseScore={reverseScore}
                        maxScore={langData.questions.forward.length} // Assuming max score is num of forward sequences
                        onSubmit={submitResults}
                        t={t}
                    />
                );
            default:
                return null;
        }
    };

    return (
        <div className="h-screen overflow-y-auto bg-gray-50 p-6 md:p-10">
            <div className="max-w-6xl mx-auto w-full">
                <ToastContainer
                    position="top-center"
                    autoClose={3000}
                    hideProgressBar={false}
                    newestOnTop={false}
                    closeOnClick
                    rtl={false}
                    pauseOnFocusLoss
                    draggable
                    pauseOnHover
                    theme="colored"
                />

                {(gameState === 'presenting' ||
                    gameState === 'listening' ||
                    gameState === 'evaluating') && (
                        <GameProgressBar
                            mode={mode}
                            sequenceIndex={sequenceIndex}
                            totalSequences={sequences.length}
                            forwardErrors={forwardErrors}
                            reverseErrors={reverseErrors}
                            maxErrors={MAX_ERRORS}
                            t={t}
                        />
                    )}

                {renderCurrentScreen()}
            </div>
        </div>
    );
}