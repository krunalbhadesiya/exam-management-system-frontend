import { Dock, DockIcon } from "@/components/magicui/dock";
import { Award, Category, Document, LogoutCurve } from "iconsax-react";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

function StudentDock() {
    const { logout } = useAuth();

    return (
        <div className="fixed bottom-2 left-px right-px">
            <Dock direction="middle" >
                <DockIcon>
                    <Link to="/student/dashboard">
                        <Button variant={"ghost"} className="hover:bg-primary hover:text-primary-foreground text-primary p-1 w-10 h-10">
                            <Category variant="Bulk" />
                        </Button>
                    </Link>
                </DockIcon>
                <DockIcon>
                    <Link to="/student/exam">
                        <Button variant={"ghost"} className="hover:bg-primary hover:text-primary-foreground text-primary p-1 w-10 h-10">
                            <Document variant="Bulk" />
                        </Button>
                    </Link>
                </DockIcon>
                <DockIcon>
                    <Link to="/student/reports">
                        <Button variant={"ghost"} className="hover:bg-primary hover:text-primary-foreground text-primary p-1 w-10 h-10">
                            <Award variant="Bulk" />
                        </Button>
                    </Link>
                </DockIcon>
                <DockIcon>
                    <Button variant={"ghost"} className="hover:bg-primary hover:text-primary-foreground text-primary p-1 w-10 h-10" onClick={logout}>
                        <LogoutCurve variant="Bulk" />
                    </Button>
                </DockIcon>
            </Dock>
        </div>
    )
}

export default StudentDock



