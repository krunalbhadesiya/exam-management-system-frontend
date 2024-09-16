import { Link } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../ui/breadcrumb";
import { useEffect, useState } from "react";

interface HeaderProps {
    pageName: string;
}

function StudentHeader({ pageName }: HeaderProps) {
    const [UserProfile, setUserProfile] = useState({
        role: '',
        name: '',
    });

    // Fetch data from localStorage when the component mounts
    useEffect(() => {
        setUserProfile({
            name: localStorage.getItem('name') || 'Student User',
            role: localStorage.getItem('role') || 'student',
        });
    }, []);

    return (
        <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b bg-background p-4">
            <img src="/Logo.png" className="w-14 h-14 rounded-md" alt="Logo" />
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild>
                            <Link to="">
                                Student
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                        <BreadcrumbPage>{pageName}</BreadcrumbPage>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            <div >
                {UserProfile.name} (<span className="font-semibold">{UserProfile.role}</span>)
            </div>
        </header>
    );
}

export default StudentHeader;
