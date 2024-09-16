import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"

import { Badge } from "@/components/ui/badge"
import StudentHeader from "@/components/student/Header"
import StudentDock from "@/components/student/Dock"
import { useEffect, useState } from "react"
import { getExamsByClass } from "@/api/ExmaData"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "iconsax-react"
import { Link } from "react-router-dom"

interface Exam {
    _id: string;  // Adjusted to match API response
    name: string;
    category: string;
    class?: string;
    subject?: string;
    duration: number;
    status?: "draft" | "active" | "upcoming" | "completed";
    date?: string;
    passingMark?: number; // Adjusted from passingMarks
    fullMark?: number;    // Adjusted from fullMarks
    perQuestionMark?: number;
    perQuestionNegativeMark?: number;
    calculator?: boolean;
    createdAt?: string;
    updatedAt?: string;
}

export default function StudenExam() {
    const [exams, setExams] = useState<Exam[]>([]);
    const [studentProfile, setStudentProfile] = useState({
        username: '',
        userClass: '',
        rollNo: '',
        name: '',
        email: '',
        phone: ''
    });

    // Fetch data from localStorage when the component mounts
    useEffect(() => {
        setStudentProfile({
            username: localStorage.getItem('username') || 'N/A',
            userClass: localStorage.getItem('userClass') || 'N/A',
            rollNo: localStorage.getItem('rollNo') || 'N/A',
            name: localStorage.getItem('name') || 'N/A',
            email: localStorage.getItem('email') || 'N/A',
            phone: localStorage.getItem('phone') || 'N/A',
        });
    }, []);


    useEffect(() => {
        const fetchExams = async () => {
            try {
                if (studentProfile.userClass) {  // Ensure userClass is available
                    const response = await getExamsByClass(studentProfile.userClass);
                    setExams(response.data);
                } else {
                    console.warn('User class is not available yet.');
                }
            } catch (error: any) {
                console.error('Error fetching exams:', error.response?.data || error.toJSON());
            }
        };

        fetchExams();
    }, [studentProfile.userClass]);  // Depend on userClass to wait until it's fetched


    return (
        <div className="flex flex-col min-h-screen w-full bg-background">
            <StudentHeader pageName="Exams" />
            <StudentDock />
            <main className="mt-2 md:mt-4 grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8 lg:grid-cols-3 xl:grid-cols-3">
                <div className="grid auto-rows-max items-start gap-4 md:gap-8 lg:col-span-3">
                    <h2 className="text-lg font-semibold">Exams List</h2>

                    {exams.map((exam) => (
                        <Card key={exam._id}>
                            <CardHeader>
                                <CardTitle className="flex flex-row flex-wrap items-center justify-between gap-2">
                                    <div className="text-xl flex items-center">
                                        {exam.name}
                                        {exam.status && <Badge variant={"default"} className="ml-2">{exam.status}</Badge>}
                                    </div>
                                    {exam.status === 'active' && <Link to={`/student/exam/instrections/${exam._id}`} ><Button variant={"outline"} className="gap-2">Join Exam <ArrowRight /> </Button></Link>}
                                    {/* <Button variant={"outline"} className="gap-2">Join Exam <ArrowRight /></Button> */}
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-row items-center justify-between">
                                <div>
                                    Date: <span className="font-semibold">{exam.date && new Date(exam.date).toLocaleDateString()}</span>
                                </div>
                                <div>
                                    Duration: <span className="font-semibold">{exam.duration} min</span>
                                </div>
                                <div>
                                    Full Mark: <span className="font-semibold">{exam.fullMark}</span>
                                </div>
                                <div>
                                    Passing Mark: <span className="font-semibold">{exam.passingMark}</span>
                                </div>
                            </CardContent>
                            <CardFooter className="flex flex-row items-center justify-end gap-2">

                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    )
}
