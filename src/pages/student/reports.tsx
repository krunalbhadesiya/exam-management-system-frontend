import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import AdminDock from "@/components/admin/Dock";
import AdminHeader from "@/components/admin/Header";
import { getReportByStudentUsername } from "@/api/ReportData"; // Import the function

interface ExamResult {
    id: string; // Changed from number to string to match the ID type from the backend
    studentUsername: string; // Changed to studentUsername
    studentName: string;
    class: string;
    examName: string;
    examId: string;
    totalMarks: number;
    obtainedMarks: number;
    result: string;
    examDate: string;
    remarks?: string; // Optional field
}

export default function StudentReports() {
    const [selectedRows, setSelectedRows] = useState<string[]>([]); // Changed to string
    const [examResults, setExamResults] = useState<ExamResult[]>([]);
    const username = localStorage.getItem('username') || 'N/A';
    
    useEffect(() => {
        const fetchReports = async () => {
            try {
                const response = await getReportByStudentUsername(username);
                setExamResults(response.data); // Set the fetched data
            } catch (error) {
                console.error("Error fetching reports:", error);
            }
        };

        fetchReports();
    }, []);

    const [filters, setFilters] = useState({
        name: "",
        class: "",
        exam: "",
        result: "",
    });

    const filteredExamResults = useMemo(() => {
        return examResults.filter((result) => {
            const nameMatch = result.studentName.toLowerCase().includes(filters.name.toLowerCase());
            const classMatch = result.class.toLowerCase().includes(filters.class.toLowerCase());
            const examMatch = result.examName.toLowerCase().includes(filters.exam.toLowerCase());
            const resultMatch = result.result.toLowerCase().includes(filters.result.toLowerCase());
            return nameMatch && classMatch && examMatch && resultMatch;
        });
    }, [examResults, filters]);

    const handleRowSelect = (id: string) => {
        if (selectedRows.includes(id)) {
            setSelectedRows(selectedRows.filter((rowId) => rowId !== id));
        } else {
            setSelectedRows([...selectedRows, id]);
        }
    };

    const handlePrintSelected = () => {
        const selectedExamResults = examResults.filter((result) => selectedRows.includes(result.id));
        console.log("Printing selected exam results:", selectedExamResults);
    };

    const handleFilterChange = (field: keyof typeof filters, value: string) => {
        setFilters((prevFilters) => ({
            ...prevFilters,
            [field]: value,
        }));
    };

    return (
        <div className="w-full ">
            <AdminHeader pageName="Exam Results" />
            <AdminDock />
            <div className=" p-4 md:p-6">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold">Exam Results</h1>
                    <div className="flex flex-row gap-2 items-center ">
                        <Input
                            placeholder="Search by name"
                            value={filters.name}
                            onChange={(e) => handleFilterChange("name", e.target.value)}
                        />
                        <Input
                            placeholder="Search by class"
                            value={filters.class}
                            onChange={(e) => handleFilterChange("class", e.target.value)}
                        />
                        <Input
                            placeholder="Search by exam"
                            value={filters.exam}
                            onChange={(e) => handleFilterChange("exam", e.target.value)}
                        />
                        <Button onClick={handlePrintSelected} disabled={selectedRows.length === 0}>
                            Print Selected
                        </Button>
                    </div>
                </div>
                <div className="bg-background rounded-lg shadow-lg p-6">

                    <div className="overflow-x-auto">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[32px]">
                                        <Checkbox
                                            checked={selectedRows.length === filteredExamResults.length}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setSelectedRows(filteredExamResults.map((result) => result.id));
                                                } else {
                                                    setSelectedRows([]);
                                                }
                                            }}
                                        />
                                    </TableHead>
                                    <TableHead>Student Name</TableHead>
                                    <TableHead>Class</TableHead>
                                    <TableHead>Exam Name</TableHead>
                                    <TableHead>Marks Obtained</TableHead>
                                    <TableHead>Result</TableHead>
                                    <TableHead>Exam Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredExamResults.map((result) => (
                                    <TableRow key={result.id}>
                                        <TableCell>
                                            <Checkbox
                                                checked={selectedRows.includes(result.id)}
                                                onCheckedChange={() => handleRowSelect(result.id)}
                                            />
                                        </TableCell>
                                        <TableCell className="font-medium">{result.studentName}</TableCell>
                                        <TableCell>{result.class}</TableCell>
                                        <TableCell>{result.examName}</TableCell>
                                        <TableCell>{result.obtainedMarks} /  {result.totalMarks}</TableCell>
                                        <TableCell>
                                            <div
                                                className={`px-2 py-1 rounded-full text-xs font-medium ${result.result === "Pass" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                                                    }`}
                                            >
                                                {result.result}
                                            </div>
                                        </TableCell>
                                        <TableCell>{result.examDate}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                </div>
            </div>
        </div>
    );
}
