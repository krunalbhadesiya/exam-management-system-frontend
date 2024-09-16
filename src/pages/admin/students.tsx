import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Edit, SearchNormal, Trash } from "iconsax-react";
import AdminDock from "@/components/admin/Dock";
import AdminHeader from "@/components/admin/Header";
import { useToast } from "@/hooks/use-toast";
import { registerUser, getAllUsers, deleteUser } from "@/api/StudentData";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

interface Student {
    _id: string;
    username: string;
    name: string;
    class: string;
    rollNo: string;
    email: string;
    phone: string;
}

export default function AdminStudents() {
    const { toast } = useToast();
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState<{ key: keyof Student; order: "asc" | "desc" }>({ key: "name", order: "asc" });
    const [students, setStudents] = useState<Student[]>([]);
    const [formData, setFormData] = useState({
        username: "",
        password: "",
        name: "",
        class: "",
        rollNo: "",
        phone: "",
        email: "",
    });

    useEffect(() => {
        // Fetch students data on component mount
        const fetchStudents = async () => {
            try {
                const response = await getAllUsers();
                // Assume response.data is in the format { data: Student[] }
                const studentsData: Student[] = response.data.filter((user: any) => user.role === 'student');
                setStudents(studentsData); // Ensure data is of type Student[]
            } catch (error) {
                console.error('Error fetching students:', error);
                toast({
                    variant: "destructive",
                    title: "Failed to load students.",
                    description: "Unable to fetch students from the server."
                });
            }
        };

        fetchStudents();
    }, [toast]);

    useEffect(() => {
        // Generate password and update formData when the dialog opens
        if (formData.username) {
            const password = generatePassword();
            setFormData(prev => ({ ...prev, password }));
        }
    }, [formData.username]);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [id]: value
        }));
        if (id === "class" || id === "rollNo") {
            setFormData(prev => ({
                ...prev,
                username: `${prev.class}${prev.rollNo}`
            }));
        }
    };

    const generatePassword = () => {
        // const chars = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@#$";
        const chars = "0123456789";
        let password = "";
        for (let i = 0; i < 6; i++) {
            const randomIndex = Math.floor(Math.random() * chars.length);
            password += chars[randomIndex];
        }
        return password;
    };


    const handleAddStudent = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const response = await registerUser({ ...formData, role: "student" });
            if (response) {
                toast({
                    variant: "default",
                    title: "Student added successfully!",
                });
                setFormData({
                    username: "",
                    password: "",
                    name: "",
                    class: "",
                    rollNo: "",
                    phone: "",
                    email: "",
                });
                setStudents(prevStudents => [...prevStudents, response.data]);
            }
        } catch (error: any) {
            console.error('Error adding student:', error?.response?.data?.message || error.message);
            toast({
                variant: "destructive",
                title: "Failed to add student.",
                description: error?.response?.data?.message || "Internal server error."
            });
        }
    };
    const handleCreateStudent = () => {
        setFormData({
            username: "",
            password: "",
            name: "",
            class: "",
            rollNo: "",
            phone: "",
            email: "",
        });
    };
    const handleEditStudent = (student: Student) => {
        setFormData({
            // _id: student._id, 
            username: student.username,
            password: "",
            name: student.name,
            class: student.class,
            rollNo: student.rollNo,
            phone: student.phone,
            email: student.email,
        });
    };
    const handleDeleteStudent = async (id: string) => {
        try {
            const response = await deleteUser(id);
            if (response) {
                toast({
                    variant: "default",
                    title: "Student deleted successfully!",
                });
                setStudents(prevStudents => prevStudents.filter(student => student._id !== id));
            }
        } catch (error: any) {
            console.error('Error deleting student:', error?.response?.data?.message || error.message);
            toast({
                variant: "destructive",
                title: "Failed to delete student.",
                description: error?.response?.data?.message || "Internal server error."
            });
        }
    };


    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value);
    const handleSort = (key: keyof Student) => {
        if (sort.key === key) {
            setSort({ key, order: sort.order === "asc" ? "desc" : "asc" });
        } else {
            setSort({ key, order: "asc" });
        }
    };

    const filteredStudents = useMemo(() => {
        return students
            .filter((student) => {
                const searchValue = search.toLowerCase();
                return (
                    student.name.toLowerCase().includes(searchValue) ||
                    student.rollNo.toLowerCase().includes(searchValue) ||
                    student.email.toLowerCase().includes(searchValue) ||
                    student.phone.toLowerCase().includes(searchValue)
                );
            })
            .sort((a, b) => {
                if (sort.order === "asc") {
                    return a[sort.key].localeCompare(b[sort.key]);
                } else {
                    return b[sort.key].localeCompare(a[sort.key]);
                }
            });
    }, [search, sort, students]);

    return (
        <div>
            <AdminHeader pageName="Students" />
            <AdminDock />
            <div className="flex flex-col gap-4 p-4 md:p-6">
                <div className="flex items-center gap-4">
                    <div className="relative flex-1">
                        <SearchNormal className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search students..."
                            value={search}
                            onChange={handleSearch}
                            className="pl-8 w-full"
                        />
                    </div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button onClick={handleCreateStudent}>Add Student</Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Add Student</DialogTitle>
                                <DialogDescription>Fill out the form to add a new student.</DialogDescription>
                            </DialogHeader>
                            <form onSubmit={handleAddStudent} className="grid gap-4 py-4">
                                <div>
                                    <Label htmlFor="name" className="text-right">
                                        Name
                                    </Label>
                                    <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="Enter name" className="col-span-3" required />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label htmlFor="class" className="text-right">
                                            Class
                                        </Label>
                                        <Input id="class" value={formData.class} onChange={handleInputChange} placeholder="Enter class" className="col-span-3" required />
                                    </div>
                                    <div>
                                        <Label htmlFor="rollNo" className="text-right">
                                            Roll Number
                                        </Label>
                                        <Input id="rollNo" value={formData.rollNo} onChange={handleInputChange} placeholder="Enter Roll Number" className="col-span-3" required />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="username" className="text-right">
                                        Username
                                    </Label>
                                    <Input id="username" value={formData.username} readOnly className="col-span-3" />
                                </div>
                                <div>
                                    <Label htmlFor="password" className="text-right">
                                        Password
                                    </Label>
                                    <Input id="password" value={formData.password} className="col-span-3" />
                                </div>
                                <div>
                                    <Label htmlFor="phone" className="text-right">
                                        Phone No
                                    </Label>
                                    <Input id="phone" value={formData.phone} onChange={handleInputChange} placeholder="Enter Phone" className="col-span-3" />
                                </div>
                                <div>
                                    <Label htmlFor="email" className="text-right">
                                        Email
                                    </Label>
                                    <Input id="email" value={formData.email} onChange={handleInputChange} placeholder="Enter Email" className="col-span-3" />
                                </div>
                                <DialogFooter>
                                    <Button variant="default" type="submit">Add Student</Button>
                                </DialogFooter>
                            </form>
                        </DialogContent>
                    </Dialog>
                </div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("class")}>Class</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("rollNo")}>Roll No</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("name")}>Name</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("username")}>Username</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("email")}>Email</TableHead>
                            <TableHead className="cursor-pointer" onClick={() => handleSort("phone")}>Phone</TableHead>
                            <TableHead className="text-center">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredStudents.map((student) => (
                            <TableRow key={student._id}>
                                <TableCell>{student.class}</TableCell>
                                <TableCell>{student.rollNo}</TableCell>
                                <TableCell>{student.name}</TableCell>
                                <TableCell>{student.username}</TableCell>
                                <TableCell>{student.email}</TableCell>
                                <TableCell>{student.phone}</TableCell>
                                <TableCell className="text-center">
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="outline" onClick={() => handleEditStudent(student)} >
                                                <Edit />
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="sm:max-w-[425px]">
                                            <DialogHeader>
                                                <DialogTitle>Add Student</DialogTitle>
                                                <DialogDescription>Fill out the form to add a new student.</DialogDescription>
                                            </DialogHeader>
                                            <form onSubmit={handleAddStudent} className="grid gap-4 py-4">
                                                <div>
                                                    <Label htmlFor="name" className="text-right">
                                                        Name
                                                    </Label>
                                                    <Input id="name" value={formData.name} onChange={handleInputChange} placeholder="Enter name" className="col-span-3" required />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <Label htmlFor="class" className="text-right">
                                                            Class
                                                        </Label>
                                                        <Input id="class" value={formData.class} onChange={handleInputChange} placeholder="Enter class" className="col-span-3" required />
                                                    </div>
                                                    <div>
                                                        <Label htmlFor="rollNo" className="text-right">
                                                            Roll Number
                                                        </Label>
                                                        <Input id="rollNo" value={formData.rollNo} onChange={handleInputChange} placeholder="Enter Roll Number" className="col-span-3" required />
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label htmlFor="username" className="text-right">
                                                        Username
                                                    </Label>
                                                    <Input id="username" value={formData.username} readOnly className="col-span-3" />
                                                </div>
                                                <div>
                                                    <Label htmlFor="password" className="text-right">
                                                        Password
                                                    </Label>
                                                    <Input id="password" value={formData.password} className="col-span-3" />
                                                </div>
                                                <div>
                                                    <Label htmlFor="phone" className="text-right">
                                                        Phone No
                                                    </Label>
                                                    <Input id="phone" value={formData.phone} onChange={handleInputChange} placeholder="Enter Phone" className="col-span-3" />
                                                </div>
                                                <div>
                                                    <Label htmlFor="email" className="text-right">
                                                        Email
                                                    </Label>
                                                    <Input id="email" value={formData.email} onChange={handleInputChange} placeholder="Enter Email" className="col-span-3" />
                                                </div>
                                                <DialogFooter>
                                                    <Button variant="default" type="submit">Add Student</Button>
                                                </DialogFooter>
                                            </form>
                                        </DialogContent>
                                    </Dialog>

                                    <AlertDialog>
                                        <AlertDialogTrigger>
                                            <Button variant="destructive" className="m-2"  >
                                                <Trash />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete student and remove your data from our servers.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                <AlertDialogAction onClick={() => handleDeleteStudent(student._id)}>Continue</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
