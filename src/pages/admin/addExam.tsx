import { useState } from 'react';
import { createExam } from '@/api/ExmaData';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import AdminHeader from '@/components/admin/Header';
import AdminDock from '@/components/admin/Dock';
import { useToast } from '@/hooks/use-toast';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AddExam() {
    const { toast } = useToast();
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
    const [selectedDate, setSelectedDate] = useState<Date | undefined>();

    const handleExamFormChange = (e: any) => {
        const { id, value, type } = e.target;
        setExamForm((prev) => ({
            ...prev,
            [id as keyof typeof examForm]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
        }));
    };

    const handleSelectChange = (value: string, field: string) => {
        setExamForm(prev => ({
            ...prev,
            [field]: value,
        }));
    };


    const SubmitExam = async (e: any) => {
        e.preventDefault();
        try {
            const response = await createExam(examForm);
            if (response) {
                toast({
                    variant: "default",
                    title: "Exam created successfully!",
                });
            }
        } catch (error: any) {
            console.error('Error creating exam:', error?.response?.data?.message || error.message);
            toast({
                variant: "destructive",
                title: "Failed to create exam.",
                description: error?.response?.data?.message || "Internal server error."
            });
        }
    };


    return (
        <div className="flex flex-col">
            <AdminHeader pageName="Add Exam " />
            <AdminDock />
            <form onSubmit={SubmitExam} className='p-2 md:p-4'>
                <Card>
                    <CardHeader>
                        <CardTitle className='w-full flex flex-row items-center justify-between'>
                            Create a new exam
                            <Button type="submit">Save Exam</Button>
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-6 md:gap-14">
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
                                                    setExamForm((prev) => ({
                                                        ...prev,
                                                        date: format(date, 'yyyy-MM-dd'), // Set formatted date in examForm
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
                                <Select
                                    onValueChange={(value) => handleSelectChange(value, 'status')} // Use this to update the state
                                >
                                    <SelectTrigger id='status'>
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
                                <Select>
                                    <SelectTrigger id='calculator'>
                                        <SelectValue placeholder="Please Select" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="no" onSelect={() => setExamForm(prev => ({ ...prev, calculator: 'no' }))}>No</SelectItem>
                                        <SelectItem value="yes" onSelect={() => setExamForm(prev => ({ ...prev, calculator: 'yes' }))}>Yes</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="fullMark">Full Mark</Label>
                                <Input id="fullMark" type="number" value={examForm.fullMark} onChange={handleExamFormChange} placeholder="Enter full mark" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="passingMark">Passing Mark</Label>
                                <Input id="passingMark" value={examForm.passingMark} onChange={handleExamFormChange} type="number" placeholder="Enter passing mark" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="perQuestionMark">Per Question Mark</Label>
                                <Input id="perQuestionMark" type="number" value={examForm.perQuestionMark} onChange={handleExamFormChange} placeholder="Enter per question mark" required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="perQuestionNegativeMark">Per Question Negative Mark</Label>
                                <Input
                                    id="perQuestionNegativeMark"
                                    type="number"
                                    value={examForm.perQuestionNegativeMark}
                                    onChange={handleExamFormChange}
                                    placeholder="Enter per question negative mark"
                                    required
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </form>
        </div>
    );
}
