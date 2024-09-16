import { useEffect, useState } from "react";
import { getAllExams, deleteExam } from "@/api/ExmaData";
import { Button } from "@/components/ui/button";
import AdminHeader from "@/components/admin/Header";
import AdminDock from "@/components/admin/Dock";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AddCircle, Edit, Eye, Trash } from "iconsax-react";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger, } from "@/components/ui/alert-dialog"

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

export default function AdminExamManagement() {
    const [exams, setExams] = useState<Exam[]>([]);

    useEffect(() => {
        const fetchExams = async () => {
            try {
                const response = await getAllExams();
                setExams(response.data);
            } catch (error: any) {
                console.error('Error fetching exams:', error.toJSON());  // This will provide more insight
            }
        };

        fetchExams();
    }, []);

    const handleDeleteExam = async (examId: string) => {
        try {
            await deleteExam(examId);
            setExams(exams.filter((exam) => exam._id !== examId)); // Adjusted to use _id
        } catch (error) {
            console.error("Error deleting exam:", error);
        }
    };

    return (
        <div className="flex flex-col h-screen">
            <AdminHeader pageName="Exam Management" />
            <AdminDock />
            <div className="p-6 flex-1 flex flex-col">
                <div className="flex flex-row justify-between">
                    <div className="text-lg font-medium">Exams</div>
                    <Link to="/admin/exam/add">
                        <Button variant={"default"} className="gap-2">
                            <AddCircle variant="Bulk" /> Create Exam
                        </Button>
                    </Link>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6">
                    {exams.map((exam) => (
                        <Card key={exam._id}>
                            <CardHeader>
                                <CardTitle className="flex gap-2">
                                    {exam.name} ({exam.class})
                                    {exam.status && <Badge variant={"default"}>{exam.status}</Badge>}
                                </CardTitle>
                                {exam.date && <CardDescription>{new Date(exam.date).toLocaleDateString()}</CardDescription>}
                            </CardHeader>
                            <CardContent>Duration: {exam.duration} min</CardContent>
                            <CardFooter className="flex flex-row items-center justify-end gap-2">
                                <Button variant={"outline"}>
                                    <Eye variant="Bulk" />
                                </Button>
                                <Link to={`/admin/exam/edit/${exam._id}`}>
                                    <Button variant={"default"}>
                                        <Edit variant="Bulk" />
                                    </Button>
                                </Link>
                                <AlertDialog>
                                    <AlertDialogTrigger>
                                        <Button variant={"destructive"} >
                                            <Trash variant="Bulk" />
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                            <AlertDialogDescription>
                                                This action cannot be undone. This will permanently delete exam and remove your data from our servers.
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                                            <AlertDialogAction onClick={() => handleDeleteExam(exam._id)}>Continue</AlertDialogAction>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </CardFooter>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
}




// import { Label } from "@/components/ui/label"
// import { Input } from "@/components/ui/input"
// import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select"
// import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
// import { Calendar } from "@/components/ui/calendar"
// import { Checkbox } from "@/components/ui/checkbox"

// export default function AdminExamManagement() {
//     const [exams, setExams] = useState<Exam[]>([
//         // Your exam data here
//     ])
//     const [selectedExam, setSelectedExam] = useState<Exam | null>(null)

//     const handleExamSelect = (exam: Exam) => {
//         setSelectedExam(exam)
//     }

//     const handleExamCreate = (newExam: Exam) => {
//         setExams([...exams, newExam])
//     }

//     const handleExamUpdate = (updatedExam: Exam) => {
//         setExams(exams.map((exam) => (exam.id === updatedExam.id ? updatedExam : exam)))
//     }

//     const handleExamDelete = (examId: number) => {
//         setExams(exams.filter((exam) => exam.id !== examId))
//     }

//     return (
//         <div className="flex flex-col h-screen">
//             <AdminHeader pageName="Exam Management" />
//             <AdminDock />
//             <div className="flex-1 grid grid-cols-[300px_1fr] gap-6 p-6">
//                 <div className="bg-background rounded-lg shadow-md p-4">
//                     <h2 className="text-lg font-semibold mb-4">Exams</h2>
//                     <ul className="space-y-2">
//                         {exams.map((exam) => (
//                             <li
//                                 key={exam.id}
//                                 className={`px-4 py-2 rounded-md cursor-pointer transition-colors ${selectedExam?.id === exam.id ? "bg-primary text-primary-foreground" : "hover:bg-muted"
//                                     }`}
//                                 onClick={() => handleExamSelect(exam)}
//                             >
//                                 {exam.name} - {exam.class} ({exam.subject})
//                             </li>
//                         ))}
//                     </ul>
//                     <Button
//                         variant="outline"
//                         className="mt-4 w-full"
//                         onClick={() =>
//                             handleExamCreate({
//                                 id: exams.length + 1,
//                                 name: "New Exam",
//                                 category: "",
//                                 class: "",
//                                 subject: "",
//                                 duration: 0,
//                                 status: "Draft",
//                                 date: "",
//                                 passingMarks: 0,
//                                 fullMarks: 0,
//                                 perQuestionMarks: 0,
//                                 perQuestionNegativeMarks: 0,
//                                 calculatorAvailable: false,
//                             })
//                         }
//                     >
//                         Create New Exam
//                     </Button>
//                 </div>
//                 {selectedExam && (
//                     <div className="bg-background rounded-lg shadow-md p-4">
//                         <form className="grid grid-cols-2 gap-4">
//                             <div className="col-span-2 flex flex-row items-center justify-between">
//                                 <h2 className="text-lg font-semibold mb-4">{selectedExam.name}</h2>
//                                 <div className="flex flex-row gap-2">
//                                     <Button
//                                         type="button"
//                                         variant="outline"
//                                         className="mt-4"
//                                         onClick={() => handleExamUpdate(selectedExam)}
//                                     >
//                                         Update Exam
//                                     </Button>
//                                     <Button
//                                         type="button"
//                                         variant="destructive"
//                                         className="mt-4"
//                                         onClick={() => handleExamDelete(selectedExam.id)}
//                                     >
//                                         Delete Exam
//                                     </Button>
//                                 </div>
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="category">Exam Name</Label>
//                                 <Input
//                                     id="name"
//                                     type="text"
//                                     value={selectedExam.name}
//                                     onChange={(e) => handleExamUpdate({ ...selectedExam, name: e.target.value })}
//                                 />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="category">Category</Label>
//                                 <Input
//                                     id="category"
//                                     type="text"
//                                     value={selectedExam.category}
//                                     onChange={(e) => handleExamUpdate({ ...selectedExam, category: e.target.value })}
//                                 />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="class">Class</Label>
//                                 <Input
//                                     id="class"
//                                     type="text"
//                                     value={selectedExam.class}
//                                     onChange={(e) => handleExamUpdate({ ...selectedExam, class: e.target.value })}
//                                 />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="subject">Subject</Label>
//                                 <Input
//                                     id="subject"
//                                     type="text"
//                                     value={selectedExam.subject}
//                                     onChange={(e) => handleExamUpdate({ ...selectedExam, subject: e.target.value })}
//                                 />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="duration">Duration (minutes)</Label>
//                                 <Input
//                                     id="duration"
//                                     type="number"
//                                     value={selectedExam.duration}
//                                     onChange={(e) => handleExamUpdate({ ...selectedExam, duration: parseInt(e.target.value, 10) })}
//                                 />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="status">Status</Label>
//                                 <Select
//                                     value={selectedExam.status}
//                                     onValueChange={(value) => handleExamUpdate({ ...selectedExam, status: value as Exam["status"] })}
//                                 >
//                                     <SelectTrigger>
//                                         <SelectValue placeholder="Select status" />
//                                     </SelectTrigger>
//                                     <SelectContent>
//                                         <SelectItem value="Draft">Draft</SelectItem>
//                                         <SelectItem value="Active">Active</SelectItem>
//                                         <SelectItem value="Upcoming">Upcoming</SelectItem>
//                                         <SelectItem value="Completed">Completed</SelectItem>
//                                     </SelectContent>
//                                 </Select>
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="date">Date</Label>
//                                 <Popover>
//                                     <PopoverTrigger asChild>
//                                         <Button variant="outline" className="w-full justify-start font-normal">
//                                             {selectedExam.date || "Pick a date"}
//                                             <div className="ml-auto h-4 w-4 opacity-50" />
//                                         </Button>
//                                     </PopoverTrigger>
//                                     <PopoverContent className="w-auto p-0" align="start">
//                                         <Calendar
//                                             mode="single"
//                                             selected={selectedExam.date ? new Date(selectedExam.date) : undefined}
//                                             onSelect={(date) => {
//                                                 if (date) {
//                                                     handleExamUpdate({ ...selectedExam, date: date.toISOString().slice(0, 10) })
//                                                 }
//                                             }}
//                                         />
//                                     </PopoverContent>
//                                 </Popover>
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="passingMarks">Passing Marks</Label>
//                                 <Input
//                                     id="passingMarks"
//                                     type="number"
//                                     value={selectedExam.passingMarks}
//                                     onChange={(e) => handleExamUpdate({ ...selectedExam, passingMarks: parseInt(e.target.value, 10) })}
//                                 />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="fullMarks">Full Marks</Label>
//                                 <Input
//                                     id="fullMarks"
//                                     type="number"
//                                     value={selectedExam.fullMarks}
//                                     onChange={(e) => handleExamUpdate({ ...selectedExam, fullMarks: parseInt(e.target.value, 10) })}
//                                 />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="perQuestionMarks">Marks per Question</Label>
//                                 <Input
//                                     id="perQuestionMarks"
//                                     type="number"
//                                     value={selectedExam.perQuestionMarks}
//                                     onChange={(e) => handleExamUpdate({ ...selectedExam, perQuestionMarks: parseInt(e.target.value, 10) })}
//                                 />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="perQuestionNegativeMarks">Negative Marks per Question</Label>
//                                 <Input
//                                     id="perQuestionNegativeMarks"
//                                     type="number"
//                                     value={selectedExam.perQuestionNegativeMarks}
//                                     onChange={(e) => handleExamUpdate({ ...selectedExam, perQuestionNegativeMarks: parseInt(e.target.value, 10) })}
//                                 />
//                             </div>
//                             <div className="space-y-2">
//                                 <Label htmlFor="calculatorAvailable">Calculator Available</Label>
//                                 <Checkbox
//                                     id="calculatorAvailable"
//                                     checked={selectedExam.calculatorAvailable}
//                                     onCheckedChange={(checked) => handleExamUpdate({ ...selectedExam, calculatorAvailable: checked as boolean })}
//                                 />
//                             </div>

//                         </form>
//                     </div>
//                 )}
//             </div>
//         </div>
//     )
// }
