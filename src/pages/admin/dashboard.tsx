import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AdminDock from "@/components/admin/Dock";
import AdminHeader from "@/components/admin/Header";
import { useEffect, useState } from "react";
import { getAllExams } from "@/api/ExmaData";
import { getAllReports } from "@/api/ReportData";
import dayjs from "dayjs";
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
    calculator?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

interface ExamResult {
    id: string;
    studentUsername: string;
    studentName: string;
    class: string;
    examName: string;
    examId: string;
    totalMarks: number;
    obtainedMarks: number;
    result: string;
    examDate: string;
    remarks?: string;
}

export default function AdminDashboard() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [examResults, setExamResults] = useState<ExamResult[]>([]);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await getAllExams();
                setExams(response.data);
            } catch (error: any) {
                console.error('Error fetching exams:', error.toJSON());
            }
        };

        fetchExams();
    }, []);

    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await getAllReports();
                setExamResults(response.data);
            } catch (error) {
                console.error("Error fetching reports:", error);
            }
        };

        fetchReports();
    }, []);

    // Get the top 5 recent exams
    const recentExams = exams
        .sort((a, b) => dayjs(b.date).diff(dayjs(a.date))) // Sort by date descending
        .slice(0, 5); // Top 5 recent exams

    // Get top 3 results for a specific exam
    const getTopResultsForExam = (examId: string) => {
        return examResults
            .filter(result => result.examId === examId)
            .sort((a, b) => b.obtainedMarks - a.obtainedMarks) // Sort by obtainedMarks descending
            .slice(0, 3); // Top 3 results
    };

    return (
        <div className="flex min-h-screen w-full flex-col bg-muted/40">
            <AdminHeader pageName="Dashboard" />
            <AdminDock />

            <main className="mt-2 md:mt-4 grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
                <div className="grid gap-4 md:grid-cols-2">
                    {/* Display recent exams */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Recent Exams</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                {recentExams.map(exam => (
                                    <div key={exam._id} className="flex items-center justify-between">
                                        <div>
                                            <div className="font-medium">{exam.name}</div>
                                            <div className="text-xs text-muted-foreground">
                                                {dayjs(exam.date).format("MMMM D, YYYY")}
                                            </div>
                                        </div>
                                        <Badge variant="secondary" className="text-xs">
                                            {exam.status}
                                        </Badge>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Display exam results */}
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Top Results</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4">
                                {recentExams.map(exam => (
                                    <div key={exam._id}>
                                        <div className="font-medium">{exam.name}</div>
                                        {getTopResultsForExam(exam._id).map((result, index) => (
                                            <div
                                                key={result.id}
                                                className="flex items-center justify-between mt-2"
                                            >
                                                <div>
                                                    <div className="font-medium">
                                                        {result.studentUsername}
                                                    </div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {result.studentName}
                                                    </div>
                                                </div>
                                                <div className={`font-medium ${index === 0 ? "text-green-500" : "text-yellow-500"}`}>
                                                    {((result.obtainedMarks / result.totalMarks) * 100).toFixed(2)}%
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
