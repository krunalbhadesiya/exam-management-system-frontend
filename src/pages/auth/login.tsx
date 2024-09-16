import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/auth/login', {
                username,
                password,
            });

            const { role } = response.data;

            // Store data based on role
            if (role === 'student') {
                const { token, role, username: resUsername, userClass, rollNo, name, email, phone } = response.data;

                // Store all student data in localStorage
                localStorage.setItem('authToken', token);
                localStorage.setItem('userRole', role);
                localStorage.setItem('username', resUsername);
                localStorage.setItem('userClass', userClass);
                localStorage.setItem('rollNo', rollNo);
                localStorage.setItem('name', name);
                localStorage.setItem('email', email);
                localStorage.setItem('phone', phone);

                // Redirect to student dashboard
                navigate('/student/dashboard');
            } else if (role === 'admin') {
                const { token, role } = response.data;

                // Store only admin data in localStorage
                localStorage.setItem('authToken', token);
                localStorage.setItem('userRole', role);

                // Redirect to admin dashboard
                navigate('/admin/dashboard');
            }

            // Trigger login logic
            login();
        } catch (error) {
            console.error('Login failed:', error);
            setErrorMessage('Login failed. Please check your username and password.');
        }
    };

    return (
        <div className="dotdotbg w-full h-screen flex flex-col items-center justify-center">
            <Card className="w-11/12 md:w-3/12">
                <CardHeader className="text-center font-bold text-2xl">
                    Login
                </CardHeader>
                <CardContent className="flex flex-col gap-6">
                    <div className="flex flex-col gap-4">
                        <div>
                            <Label htmlFor="username">Username</Label>
                            <Input
                                id="username"
                                name="username"
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>
                        <div>
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                        {errorMessage && (
                            <div className="text-red-500 text-center">{errorMessage}</div>
                        )}
                        <Button type="button" variant={"default"} className="w-full" onClick={handleLogin}>
                            Login
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

export default Login;
