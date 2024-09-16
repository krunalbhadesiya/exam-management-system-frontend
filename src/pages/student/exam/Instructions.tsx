import { useParams, useNavigate } from 'react-router-dom';
import StudentHeader from "@/components/student/Header";
import StudentDock from "@/components/student/Dock";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from '@/hooks/use-toast';
import { useEffect, useState } from 'react';
import { getExamById } from '@/api/ExmaData';
import screenfull from 'screenfull'; // Import screenfull

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

export default function ExamInstructions() {
    const { id: examId } = useParams<{ id: string }>();
    const navigate = useNavigate(); // Get navigate function
    const { toast } = useToast();
    const [exam, setExam] = useState<Exam | null>(null);

    useEffect(() => {
        if (examId) {
            const fetchExamDetails = async () => {
                try {
                    const response = await getExamById(examId);
                    const examData = response.data;

                    setExam(examData);
                } catch (error) {
                    toast({
                        variant: 'destructive',
                        title: 'Failed to fetch exam details.',
                    });
                }
            };
            fetchExamDetails();
        }
    }, [examId, toast]);

    const handleExamStart = () => {
        if (screenfull.isEnabled) {
            screenfull.request().then(() => {
                navigate(`/student/exam/write/${examId}`);
            }).catch(() => {
                toast({
                    variant: 'destructive',
                    title: 'Failed to enter fullscreen mode.',
                });
            });
        } else {
            // Navigate immediately if fullscreen is not enabled
            navigate(`/student/exam/write/${examId}`);
        }
    };

    return (
        <div className="flex flex-col min-h-screen w-full bg-background">
            <StudentHeader pageName="Exam Instructions" />
            <StudentDock />
            <main className="p-2 md:p-4 pb-8 md:pb-20 mx-auto">
                {exam ? ( 
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-xl text-center">Exam Details</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="text-sm mb-4">
                                <li><strong>Exam Name:</strong> {exam.name}</li>
                                <li><strong>Subject:</strong> {exam.subject}</li>
                                <li><strong>Duration:</strong> {exam.duration} minutes</li>
                                <li><strong>Passing Mark:</strong> {exam.passingMark}</li>
                                <li><strong>Per Question Mark:</strong> {exam.perQuestionMark}</li>
                                <li><strong>Per Question Negative Mark:</strong> {exam.perQuestionNegativeMark}</li>
                            </ul>
                            <h3 className="text-base font-semibold mb-2">Before the Exam:</h3>
                            <ul className="text-sm mb-4 list-disc list-inside">
                                <li>Check your internet connection to avoid interruptions.</li>
                                <li>Close any unnecessary apps and browser tabs to stay focused.</li>
                            </ul>
                            <h3 className="text-base font-semibold mb-2">During the Exam:</h3>
                            <ul className="text-sm mb-4 list-disc list-inside">
                                <li>The exam will open in full-screen mode automatically.</li>
                                <li>Leaving full-screen or switching tabs will submit your exam.</li>
                                <li>The timer will always be visible, and your exam will auto-submit when time runs out.</li>
                                <li>Finished early? Click 'Submit' to finalize your answers.</li>
                                <li>Don't use any unauthorized materials or devices, and avoid sharing exam information.</li>
                            </ul>
                            <h3 className="text-base font-semibold mb-2">After the Exam:</h3>
                            <ul className="text-sm mb-4 list-disc list-inside">
                                <li>Submit your exam before the timer runs out to avoid any penalties.</li>
                                <li>Results will be shared within the given time.</li>
                            </ul>
                        </CardContent>
                        <CardFooter>
                            <Button variant={"default"} className=" w-full" onClick={handleExamStart}>Start Exam</Button>
                        </CardFooter>
                    </Card>
                ) : (
                    <p>Loading exam details...</p>
                )}
            </main>
        </div>
    );
}
