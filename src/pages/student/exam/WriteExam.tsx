import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Calculator from "@/components/Calculator";
import { useParams } from "react-router-dom";
import { getQuestionsByExamId } from "@/api/QuestionData";
import { getExamById } from "@/api/ExmaData";
import { useToast } from "@/hooks/use-toast";
import axiosInstance from '@/api/axios'; // Adjust the import path if necessary
import screenfull from "screenfull"; // Import screenfull
import { createReport } from "@/api/ReportData";

interface Exam {
    _id: string;
    name: string;
    category: string;
    class?: string;
    subject?: string;
    duration: number;
    status?: "draft" | "active" | "upcoming" | "completed";
    date?: string;
    passingMark?: number;
    fullMark?: number;
    perQuestionMark?: number;
    perQuestionNegativeMark?: number;
    calculator?: string;
    createdAt?: string;
    updatedAt?: string;
}

type Question = {
    _id: string;
    question: string;
    options: {
        a: string;
        b: string;
        c: string;
        d: string;
    };
    correctAnswer: string;
};

export default function WriteExam() {
    const { toast } = useToast();
    const { id: examId } = useParams<{ id: string }>();
    const [exam, setExam] = useState<Exam | null>(null);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<number>(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [markedForReview, setMarkedForReview] = useState<number[]>([]);
    const [examStartTime, setExamStartTime] = useState<number>(Date.now());
    const [answers, setAnswers] = useState<Record<number, number>>({});
    const [remainingTime, setRemainingTime] = useState<{
        minutes: number;
        seconds: number;
        milliseconds: number;
    }>({
        minutes: 0,
        seconds: 0,
        milliseconds: 0,
    });

    const testexamDuration = exam?.duration ?? 0;
    const examDuration = testexamDuration * 60;

    useEffect(() => {
        if (screenfull.isEnabled) {
            const handleFullscreenChange = () => {
                if (!screenfull.isFullscreen) {
                    if (confirm("You exited full-screen mode. Do you want to submit the exam now?")) {
                        handleSubmitExam();
                        toast({
                            variant: 'destructive',
                            title: 'You exited full-screen mode.',
                            description: 'The exam has been submitted.',
                        });
                    }
                }
            };
            screenfull.on('change', handleFullscreenChange);

            return () => screenfull.off('change', handleFullscreenChange);
        }
    }, []);


    useEffect(() => {
        if (examId) {
            const fetchExamDetails = async () => {
                try {
                    const response = await getExamById(examId);
                    const examData = response.data;
                    setExam(examData);
                    setExamStartTime(Date.now()); // Set exam start time when exam details are fetched
                    const questionsResponse = await getQuestionsByExamId(examId);
                    setQuestions(questionsResponse.data);
                } catch (error) {
                    toast({
                        variant: "destructive",
                        title: "Failed to fetch exam details.",
                    });
                }
            };
            fetchExamDetails();
        }
    }, [examId, toast]);


    useEffect(() => {
        const intervalId = setInterval(() => {
            const now = Date.now();
            const elapsedTime = (now - examStartTime) / 1000;
            const timeLeft = examDuration - elapsedTime;
            if (timeLeft <= 0) {
                clearInterval(intervalId);
                setRemainingTime({ minutes: 0, seconds: 0, milliseconds: 0 });
                handleSubmitExam();
            } else {
                const minutes = Math.floor(timeLeft / 60);
                const seconds = Math.floor(timeLeft % 60);
                const milliseconds = Math.floor((timeLeft % 1) * 1000);
                setRemainingTime({ minutes, seconds, milliseconds });
            }
        }, 100);

        return () => clearInterval(intervalId);
    }, [examStartTime, examDuration]);

    useEffect(() => {
        setSelectedOption(answers[currentQuestion] ?? null);
    }, [currentQuestion, answers]);

    const handleOptionSelect = (index: number) => {
        setSelectedOption(index);
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [currentQuestion]: index,
        }));
        if (!markedForReview.includes(currentQuestion)) {
            setMarkedForReview([...markedForReview, currentQuestion]);
        }
    };

    const handleClearSelection = () => {
        setSelectedOption(null);
        setAnswers(prevAnswers => {
            const newAnswers = { ...prevAnswers };
            delete newAnswers[currentQuestion];
            return newAnswers;
        });
        setMarkedForReview(markedForReview.filter(q => q !== currentQuestion));
    };

    const handleNavigation = (index: number) => {
        setCurrentQuestion(index);
        setSelectedOption(answers[index] ?? null);
    };

    const optionPrefixes = ["a", "b", "c", "d"];

    const studentUsername = localStorage.getItem("username")

    const checkResult = (score: number) => {
        if (exam?.passingMark && score >= exam.passingMark) {
            return "pass";
        } else {
            return "fail";
        }
    };

    const addResult = async (obtainedMarks: number) => {
        try {
            // Prepare the data to send to the server
            const result = checkResult(obtainedMarks);
            const reportData = {
                studentUsername: studentUsername,
                studentName: localStorage.getItem('name') || '',
                class: localStorage.getItem('userClass') || '',
                examName: exam?.name || '',
                examId: examId,
                totalMarks: exam?.fullMark || 0,
                obtainedMarks: obtainedMarks,
                result: result,
                examDate: new Date().toISOString(),
                remarks: '',
            };
            const response = await createReport(reportData);
            if (response) {
                toast({
                    variant: 'default',
                    title: 'Result submitted successfully!',
                    description: `Your result has been recorded successfully.`,
                });
            }
        } catch (error: any) {
            console.error('Error submitting result:', error);
            toast({
                variant: 'destructive',
                title: 'Error submitting result.',
                description: `Please try again later. Error: ${error.response?.data?.message || error.message}`,
            });
        }
    };
    const handleSubmitExam = async () => {
        try {
            // Map through questions and prepare answers
            const answersToSubmit = questions.map((question, index) => ({
                questionId: question._id,
                question: question.question,
                selectedAnswer: answers[index] !== undefined ? optionPrefixes[answers[index]] : "",
                correctAnswer: question.correctAnswer,
                options: Object.values(question.options),
            }));

            // Submit exam data to the server
            const response = await axiosInstance.post('exams/attempts/submit-exam', {
                studentUsername: studentUsername,
                examId: exam?._id,
                perQuestionMark: exam?.perQuestionMark,
                perQuestionNegativeMark: exam?.perQuestionNegativeMark,
                answers: answersToSubmit,
            });

            const obtainedMarks = response.data.score;
            await addResult(obtainedMarks); // Pass obtainedMarks to addResult function

            // Show success toast
            toast({
                variant: 'default',
                title: 'Exam submitted successfully!',
                description: `we will notify on result section show. `,
            });

        } catch (error: any) {
            console.error('Error submitting exam:', error);
            toast({
                variant: 'destructive',
                title: 'Error submitting exam.',
                description: `Please try again later. Error: ${error.response?.data?.message || error.message}`,
            });
        }


    };

    // const handleSubmitExam = async () => {
    //     try {
    //         const answersToSubmit = questions.map((question, index) => ({
    //             questionId: question._id,
    //             selectedAnswer: answers[index] !== undefined ? optionPrefixes[answers[index]] : "",
    //             correctAnswer: question.correctAnswer,
    //             options: Object.values(question.options),
    //         }));

    //         const response = await axiosInstance.post('exams/attempts/submit-exam', {
    //             studentUsername: studentUsername,
    //             examId: exam?._id,
    //             answers: answersToSubmit,
    //         });

    //         console.log('Exam submitted successfully:', response.data);
    //         toast({
    //             variant: 'default',
    //             title: 'Exam submitted successfully!',
    //             description: `Score: ${response.data.report.score}`,
    //         });
    // } catch (error:any) {
    //     console.error('Error submitting exam:', error);
    //     toast({
    //         variant: 'destructive',
    //         title: 'Error submitting exam.',
    //         description: `Please try again later. Error: ${error.response?.data?.message || error.message}`,
    //     });
    // }
    // };


    return (
        <div className="flex h-screen w-full flex-col bg-background">
            <header className="bg-primary text-primary-foreground p-4 flex items-center justify-between">
                <img src="/Logo.png" className="w-14 h-14 rounded-sm" alt="" />
                <div>
                    <h1 className="text-2xl font-bold text-center">
                        {exam?.name} Exam
                    </h1>
                    <p className="text-sm text-center">
                        {exam?.subject}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <div className="bg-primary-foreground text-primary px-4 py-2 rounded-md text-sm font-medium ">
                        Time Left
                        <span className="ml-2">
                            {remainingTime.minutes.toString().padStart(2, "0")}:
                            {remainingTime.seconds.toString().padStart(2, "0")}
                        </span>
                    </div>
                </div>
            </header>

            <div className="flex flex-col flex-1">
                <div className="bg-card rounded-md p-4 flex flex-col gap-4 ml-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold">Exam Navigation</h2>
                        <button
                            className="px-4 py-2 rounded-md bg-primary text-primary-foreground"
                            onClick={handleSubmitExam}
                        >
                            Submit Exam
                        </button>
                    </div>
                    <div className="flex flex-row flex-wrap gap-2">
                        {questions.map((_, index) => (
                            <Button
                                key={index}
                                variant={"outline"}
                                className={`text-sm font-medium transition-colors ${index === currentQuestion
                                    ? "bg-primary text-primary-foreground" // Active button
                                    : markedForReview.includes(index)
                                        ? "bg-green-500 text-white" // Marked for review
                                        : answers[index] !== null
                                            ? "bg-white text-black" // Answered but not reviewed
                                            : "bg-muted hover:bg-muted/80" // Default state
                                    }`}
                                onClick={() => handleNavigation(index)}
                            >
                                {index + 1}
                            </Button>
                        ))}
                    </div>
                </div>

                <div className="flex flex-row flex-1">
                    <div className="flex flex-col flex-1 p-4 gap-4">
                        <div className="bg-card rounded-md p-4 flex flex-col gap-4">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-bold">
                                    Question {currentQuestion + 1}
                                </h2>
                                <Button
                                    className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${selectedOption !== null
                                        ? "bg-red-500 hover:bg-red-600"
                                        : "bg-gray-400 cursor-not-allowed"
                                        }`}
                                    onClick={handleClearSelection}
                                    disabled={selectedOption === null}
                                >
                                    Clear Selection
                                </Button>
                            </div>

                            <div className="prose">
                                <p>{questions[currentQuestion]?.question}</p>
                            </div>
                            <div className="grid gap-2">
                                {Object.entries(questions[currentQuestion]?.options ?? {}).map(
                                    ([_, option], index) => (
                                        <button
                                            key={index}
                                            className={`px-4 py-2 rounded-md text-left transition-colors ${selectedOption === index
                                                ? "bg-primary text-primary-foreground"
                                                : "bg-muted hover:bg-muted/80"
                                                }`}
                                            onClick={() => handleOptionSelect(index)}
                                        >
                                            {`${optionPrefixes[index]}. ${option}`}
                                        </button>
                                    )
                                )}
                            </div>
                            <div className="flex justify-between">
                                <Button
                                    disabled={currentQuestion === 0}
                                    onClick={() =>
                                        handleNavigation(currentQuestion - 1)
                                    }
                                >
                                    Previous
                                </Button>
                                <Button
                                    disabled={
                                        currentQuestion ===
                                        questions.length - 1
                                    }
                                    onClick={() =>
                                        handleNavigation(currentQuestion + 1)
                                    }
                                >
                                    Next
                                </Button>
                            </div>
                        </div>
                    </div>
                    {exam?.calculator === "yes" && (
                        <div className="bg-card rounded-md p-4 flex flex-col gap-4 w-[300px] ml-4">
                            <Calculator />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
