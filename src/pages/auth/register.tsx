import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link } from "react-router-dom"

function Register() {
    return (
        <div className="dotdotbg w-full h-screen flex flex-col items-center justify-center">
            <Card className="w-11/12 md:w-3/12 ">
                <CardHeader className="text-center font-bold text-2xl">
                    Register
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    <div>
                        <Label htmlFor="name">Name</Label>
                        <Input id="name" name="name" type="text" />
                    </div>
                    <div>
                        <Label htmlFor="username">Username</Label>
                        <Input id="usetrname" name="username" type="text" />
                    </div>
                    <div>
                        <Label htmlFor="password">Password</Label>
                        <Input id="password" name="password" type="password" />
                    </div>
                    <Button variant={"default"} className="w-full">
                        Register
                    </Button>
                    <div className="mt-4 text-center text-sm">
                        I Have Account? <Link to="/login" className="text-primary">Login</Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Register