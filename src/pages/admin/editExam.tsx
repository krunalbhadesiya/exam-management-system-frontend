import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { updateExam, getExamById } from '@/api/ExmaData';
import { createQuestion, getQuestionsByExamId } from '@/api/QuestionData';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { format } from 'date-fns';
import AdminHeader from '@/components/admin/Header';
import AdminDock from '@/components/admin/Dock';
import { useToast } from '@/hooks/use-toast';

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

export default function EditExam() {
    const { toast } = useToast();
    const { id: examId } = useParams<{ id: string }>();
    const [questions, setQuestions] = useState<Question[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined);

    const [examForm, setExamForm] = useState({
        name: '',
        category: '',
        class: '',
        subject: '',
        duration: '',
        status: '',
        date: '',
        passingMark: '',
        fullMark: '',
        perQuestionMark: '',
        perQuestionNegativeMark: '',
        calculator: 'no',
    });

    const [questionForm, setQuestionForm] = useState({
        examId: examId,
        question: '',
        options: { a: '', b: '', c: '', d: '' },
        correctAnswer: '',
    });

    useEffect(() => {
        if (examId) {
            const fetchExamDetails = async () => {
                try {
                    const response = await getExamById(examId);
                    const examData = response.data;

                    setExamForm(prev => ({
                        ...prev,
                        name: examData.name,
                        category: examData.category,
                        class: examData.class,
                        subject: examData.subject,
                        duration: examData.duration,
                        status: examData.status,
                        date: examData.date,
                        passingMark: examData.passingMark,
                        fullMark: examData.fullMark,
                        perQuestionMark: examData.perQuestionMark,
                        perQuestionNegativeMark: examData.perQuestionNegativeMark,
                        calculator: examData.calculator,
                    }));

                    const questionsResponse = await getQuestionsByExamId(examId);
                    setQuestions(questionsResponse.data);
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

    const handleExamFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { id, value } = e.target;
        setExamForm(prev => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSelectChange = (value: string, field: string) => {
        setExamForm(prev => ({
            ...prev,
            [field]: value,
        }));
    };

    // const handleQuestionFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    //     const { id, value } = e.target;
    //     setQuestionForm(prev => ({
    //         ...prev,
    //         [id]: value,
    //     }));
    // };

    const handleQuestionFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { id, value } = e.target;

        if (id in questionForm.options) {
            // Update specific option in options object
            setQuestionForm(prev => ({
                ...prev,
                options: {
                    ...prev.options,
                    [id]: value,
                },
            }));
        } else {
            // Update other fields in questionForm
            setQuestionForm(prev => ({
                ...prev,
                [id]: value,
            }));
        }
    };



    const handleExamSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await updateExam(String(examId), examForm);
            if (response) {
                toast({
                    variant: 'default',
                    title: 'Exam updated successfully!',
                });
            }
        } catch (error) {
            console.error('Error updating exam:', error);
            toast({
                variant: 'destructive',
                title: 'Failed to update exam.',
            });
        }
    };

    const handleQuestionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!questionForm.correctAnswer) {
            toast({
                variant: 'destructive',
                title: 'Failed to create question.',
                description: 'Correct answer is required.',
            });
            return;
        }

        try {
            await createQuestion({
                ...questionForm,
                examId: examId || '', // Ensure examId is a non-empty string
            });
            toast({
                variant: 'default',
                title: 'Question added successfully!',
            });
            setQuestionForm({
                examId: examId || '',
                question: '',
                options: { a: '', b: '', c: '', d: '' },
                correctAnswer: '',
            });
        } catch (error: any) {
            console.error('Error creating question:', error?.response?.data?.message || error.message);
            toast({
                variant: 'destructive',
                title: 'Failed to create question.',
                description: error?.response?.data?.message || 'Internal server error.',
            });
        }
    };


    // const handleQuestionSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    //     e.preventDefault();
    //     if (!questionForm.correctAnswer) {
    //         toast({
    //             variant: 'destructive',
    //             title: 'Failed to create question.',
    //             description: 'Correct answer is required.',
    //         });
    //         return;
    //     }
    //     try {
    //         await createQuestion(questionForm);
    //         toast({
    //             variant: 'default',
    //             title: 'Question added successfully!',
    //         });
    //         setQuestionForm({
    //             examId: examId || '',
    //             question: '',
    //             options: { a: '', b: '', c: '', d: '' },
    //             correctAnswer: ''
    //         });
    //     } catch (error: any) {
    //         console.error('Error creating question:', error?.response?.data?.message || error.message);
    //         toast({
    //             variant: 'destructive',
    //             title: 'Failed to create question.',
    //             description: error?.response?.data?.message || 'Internal server error.',
    //         });
    //     }
    // };

    return (
        <div className="flex flex-col">
            <AdminHeader pageName="Edit Exam" />
            <AdminDock />
            <Tabs defaultValue="exam" className="w-full p-6">
                <TabsList className="md:w-3/12 grid grid-cols-2 border-b">
                    <TabsTrigger value="exam">Exam</TabsTrigger>
                    <TabsTrigger value="questions" disabled={!examId}>Questions</TabsTrigger>
                </TabsList>

                <TabsContent value="exam">
                    <form onSubmit={handleExamSubmit}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Edit Exam</CardTitle>
                            </CardHeader>
                            <CardContent className="grid gap-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" value={examForm.name} onChange={handleExamFormChange} placeholder="Enter exam name" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="category">Category</Label>
                                        <Input id="category" value={examForm.category} onChange={handleExamFormChange} placeholder="Enter category" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="class">Class</Label>
                                        <Input id="class" value={examForm.class} onChange={handleExamFormChange} placeholder="Enter class" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="subject">Subject</Label>
                                        <Input id="subject" value={examForm.subject} onChange={handleExamFormChange} placeholder="Enter subject" required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="date">Date</Label>
                                        <Popover>
                                            <PopoverTrigger asChild>
                                                <Button variant="outline" className="w-full justify-start font-normal">
                                                    {selectedDate ? format(selectedDate, 'yyyy-MM-dd') : 'Pick a date'}
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar
                                                    mode="single"
                                                    selected={selectedDate}
                                                    onSelect={(date) => {
                                                        if (date) {
                                                            setSelectedDate(date);
                                                            setExamForm(prev => ({
                                                                ...prev,
                                                                date: format(date, 'yyyy-MM-dd'),
                                                            }));
                                                        }
                                                    }}
                                                />
                                            </PopoverContent>
                                        </Popover>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="duration">Duration (min)</Label>
                                        <Input id="duration" type="number" value={examForm.duration} onChange={handleExamFormChange} placeholder="Enter duration" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="status">Status</Label>
                                        <Select value={examForm.status} onValueChange={(value) => handleSelectChange(value, 'status')}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Please Select" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="upcoming">Upcoming</SelectItem>
                                                <SelectItem value="active">Active</SelectItem>
                                                <SelectItem value="completed">Completed</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="calculator">Calculator Need</Label>
                                        <Select value={examForm.calculator} onValueChange={(value) => handleSelectChange(value, 'calculator')}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select option" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="yes">Yes</SelectItem>
                                                <SelectItem value="no">No</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="passingMark">Passing Mark</Label>
                                        <Input id="passingMark" type="number" value={examForm.passingMark} onChange={handleExamFormChange} placeholder="Enter passing mark" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="fullMark">Full Mark</Label>
                                        <Input id="fullMark" type="number" value={examForm.fullMark} onChange={handleExamFormChange} placeholder="Enter full mark" required />
                                    </div>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="perQuestionMark">Per Question Mark</Label>
                                        <Input id="perQuestionMark" type="number" value={examForm.perQuestionMark} onChange={handleExamFormChange} placeholder="Enter mark per question" required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="perQuestionNegativeMark">Negative Mark per Question</Label>
                                        <Input id="perQuestionNegativeMark" type="number" value={examForm.perQuestionNegativeMark} onChange={handleExamFormChange} placeholder="Enter negative mark per question" required />
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit">Save Changes</Button>
                            </CardFooter>
                        </Card>
                    </form>
                </TabsContent>

                <TabsContent value="questions">
                    <Card >
                        <CardHeader>
                            <CardTitle className='flex justify-between items-center mb-4'>
                                Question List
                                <Dialog>
                                    <DialogTrigger asChild>
                                        <Button variant={'default'}>Add Question</Button>
                                    </DialogTrigger>
                                    <DialogContent>
                                        <DialogHeader>
                                            <DialogTitle>Add Question</DialogTitle>
                                            <DialogDescription>
                                                Fill in the details of the question.
                                            </DialogDescription>
                                        </DialogHeader>
                                        <form onSubmit={handleQuestionSubmit}>
                                            <div className="grid grid-cols-1 space-y-4">
                                                <div className="space-y-2">
                                                    <Label htmlFor="question">Question</Label>
                                                    <Textarea id="question" value={questionForm.question} onChange={handleQuestionFormChange} placeholder="Enter the question" required />
                                                </div>
                                                <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="a">Option A</Label>
                                                        <Input id="a" value={questionForm.options.a} onChange={handleQuestionFormChange} placeholder="Option A" required />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="b">Option B</Label>
                                                        <Input id="b" value={questionForm.options.b} onChange={handleQuestionFormChange} placeholder="Option B" required />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="c">Option C</Label>
                                                        <Input id="c" value={questionForm.options.c} onChange={handleQuestionFormChange} placeholder="Option C" required />
                                                    </div>
                                                    <div className="space-y-2">
                                                        <Label htmlFor="d">Option D</Label>
                                                        <Input id="d" value={questionForm.options.d} onChange={handleQuestionFormChange} placeholder="Option D" required />
                                                    </div>
                                                </div>
                                                <div className="space-y-2">
                                                    <Label htmlFor="correctAnswer">Correct Answer</Label>
                                                    <Select value={questionForm.correctAnswer} onValueChange={(value) => setQuestionForm(prev => ({
                                                        ...prev,
                                                        correctAnswer: value,
                                                    }))}>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select the correct answer" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="a">Option A</SelectItem>
                                                            <SelectItem value="b">Option B</SelectItem>
                                                            <SelectItem value="c">Option C</SelectItem>
                                                            <SelectItem value="d">Option D</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                </div>
                                            </div>
                                            <DialogFooter>
                                                <Button type="submit" className='mt-4'>Add Question</Button>
                                            </DialogFooter>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            {questions.map((question, index) => (
                                <Card key={question._id}>
                                    <CardHeader>
                                        <CardTitle>Question {index + 1} - {question.question}</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p></p>
                                        <ul className='grid grid-cols-4'>
                                            <li><strong>A:</strong> {question.options.a}</li>
                                            <li><strong>B:</strong> {question.options.b}</li>
                                            <li><strong>C:</strong> {question.options.c}</li>
                                            <li><strong>D:</strong> {question.options.d}</li>
                                        </ul>
                                        <p><strong>Correct Answer:</strong> {question.correctAnswer.toUpperCase()}</p>
                                    </CardContent>
                                </Card>
                            ))}
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
}
