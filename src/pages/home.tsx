import { Link } from "react-router-dom";
import { BatteryFull, Check, HambergerMenu, Information, Lock, Maximize3, Monitor } from "iconsax-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger, } from "@/components/ui/sheet"

export default function Home() {
    return (
        <div className="flex flex-col ">
            <header className="m-4 px-4 lg:px-6 py-4 flex flex-row items-center justify-between sticky top-4 bg-white border-2 rounded-full bg-opacity-20 border-primary backdrop-blur-3xl">
                <Link to="" className="flex items-center justify-center" >
                    <img src="/Logo.jpg" className="w-14 h-14 rounded-md" alt="Logo" />
                    <span className="sr-only">Exam System</span>
                </Link>
                <nav className="md:flex gap-4 sm:gap-6 hidden">
                    <Link to="" className="text-sm font-medium hover:underline underline-offset-4" >
                        Home
                    </Link>
                    <Link to="" className="text-sm font-medium hover:underline underline-offset-4" >
                        Features
                    </Link>
                    <Link to="" className="text-sm font-medium hover:underline underline-offset-4" >
                        Pricing
                    </Link>
                    <Link to="" className="text-sm font-medium hover:underline underline-offset-4" >
                        About
                    </Link>
                    <Link to="" className="text-sm font-medium hover:underline underline-offset-4" >
                        Contact
                    </Link>
                </nav>
                <div className="flex gap-2">

                    <Link to="/login">
                        <Button variant={"default"}> Login</Button>
                    </Link>
                    <Sheet>
                        <SheetTrigger>
                            <Button variant={"default"} className="md:hidden">
                                <HambergerMenu />
                            </Button>
                        </SheetTrigger>
                        <SheetContent className="flex flex-col ">
                            <SheetHeader>
                                <SheetTitle>
                                    <img src="/Logo.jpg" className="mx-auto w-1/2 rounded-md" alt="Logo" />

                                </SheetTitle>
                                <SheetDescription className="">
                                    Exam Management System
                                </SheetDescription>
                            </SheetHeader>
                            <nav className="w-fullflex flex-col gap-2 ">
                                <Link to="" className="text-sm font-medium hover:underline underline-offset-4" >
                                    <Button variant={"ghost"} className="w-full">
                                        Home
                                    </Button>
                                </Link>
                                <Link to="" className="text-sm font-medium hover:underline underline-offset-4" >
                                    <Button variant={"ghost"} className="w-full">
                                        Features
                                    </Button>
                                </Link>
                                <Link to="" className="text-sm font-medium hover:underline underline-offset-4" >
                                    <Button variant={"ghost"} className="w-full">
                                        Pricing
                                    </Button>
                                </Link>
                                <Link to="" className="text-sm font-medium hover:underline underline-offset-4" >
                                    <Button variant={"ghost"} className="w-full">
                                        About
                                    </Button>
                                </Link>
                                <Link to="" className="text-sm font-medium hover:underline underline-offset-4" >
                                    <Button variant={"ghost"} className="w-full">
                                        Contact
                                    </Button>
                                </Link>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </div>

            </header>
            <main className="flex-1">
                <section className="w-full ">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col-reverse md:grid md:grid-cols-2  gap-6 ">
                            <div className="flex flex-col justify-center space-y-4">
                                <div className="space-y-2">
                                    <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl xl:text-[3.4rem] 2xl:text-[3.75rem]">
                                        Streamline Your Exam Process
                                    </h1>
                                    <p className="max-w-[600px] text-muted-foreground md:text-xl">
                                        Our exam system software provides a comprehensive solution for creating, administering, and
                                        analyzing online exams.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 min-[400px]:flex-row">
                                    <Link
                                        to=""
                                        className="inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-primary to-primary/90 px-8 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"

                                    >
                                        Get Started
                                    </Link>
                                    <Link
                                        to=""
                                        className="inline-flex h-10 items-center justify-center rounded-md border border-input bg-background px-8 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"

                                    >
                                        Learn More
                                    </Link>
                                </div>
                            </div>
                            <div className="mx-auto aspect-square overflow-hidden rounded-xl object-cover sm:w- lg:order-last shadow-lg">
                                <img
                                    src="/Exams-bro.png"
                                    alt="Hero"
                                    className="w-full h-full  object-cover"
                                    style={{ aspectRatio: "550/550", objectFit: "cover" }}
                                />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="w-full py-12 md:py-24 lg:py-32">
                    <div className="container px-4 md:px-6">
                        <div className="flex flex-col items-center justify-center space-y-4 text-center">
                            <div className="space-y-2">
                                <div className="inline-block rounded-lg bg-gradient-to-r from-primary to-primary/90 px-3 py-1 text-sm text-primary-foreground">
                                    Key Features
                                </div>
                                <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Powerful Exam Management Tools</h2>
                                <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                                    Our exam system software provides a comprehensive suite of tools to streamline your exam process, from
                                    creation to analysis.
                                </p>
                            </div>
                        </div>
                        <div className="mx-auto grid items-start gap-8 sm:max-w-4xl sm:grid-cols-2 md:gap-12 lg:max-w-5xl lg:grid-cols-3">
                            <div className="grid gap-1 bg-background p-6 rounded-lg shadow-lg">
                                <Check className="h-8 w-8 text-primary" />
                                <h3 className="text-lg font-bold">Online Exam Creation</h3>
                                <p className="text-sm text-muted-foreground">
                                    Easily create and customize online exams with a user-friendly interface.
                                </p>
                            </div>
                            <div className="grid gap-1 bg-background p-6 rounded-lg shadow-lg">
                                <Monitor className="h-8 w-8 text-primary" />
                                <h3 className="text-lg font-bold">Proctoring Solutions</h3>
                                <p className="text-sm text-muted-foreground">
                                    Ensure exam integrity with our advanced proctoring features.
                                </p>
                            </div>
                            <div className="grid gap-1 bg-background p-6 rounded-lg shadow-lg">
                                <Information className="h-8 w-8 text-primary" />
                                <h3 className="text-lg font-bold">Comprehensive Reporting</h3>
                                <p className="text-sm text-muted-foreground">
                                    Generate detailed reports and analytics to gain valuable insights.
                                </p>
                            </div>
                            <div className="grid gap-1 bg-background p-6 rounded-lg shadow-lg">
                                <Lock className="h-8 w-8 text-primary" />
                                <h3 className="text-lg font-bold">Secure and Reliable</h3>
                                <p className="text-sm text-muted-foreground">
                                    Our platform is designed with security and reliability in mind.
                                </p>
                            </div>
                            <div className="grid gap-1 bg-background p-6 rounded-lg shadow-lg">
                                <Maximize3 className="h-8 w-8 text-primary" />
                                <h3 className="text-lg font-bold">Scalable and Flexible</h3>
                                <p className="text-sm text-muted-foreground">
                                    Scale your exam process with ease, no matter the number of participants.
                                </p>
                            </div>
                            <div className="grid gap-1 bg-background p-6 rounded-lg shadow-lg">
                                <BatteryFull className="h-8 w-8 text-primary" />
                                <h3 className="text-lg font-bold">Dedicated Support</h3>
                                <p className="text-sm text-muted-foreground">Our team is here to help you every step of the way.</p>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            <footer className="flex flex-col gap-2 sm:flex-row py-6 w-full shrink-0 items-center justify-center px-4 md:px-6 border-t border-muted/20 bg-gradient-to-r from-primary to-primary/90 text-primary-foreground">
                <p className="text-xs">&copy; 2023 Exam Management System. All rights reserved.</p>
            </footer>
        </div>
    )
}

