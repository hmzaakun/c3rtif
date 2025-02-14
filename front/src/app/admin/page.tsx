"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Wallet, Plus, PencilRuler, GraduationCap, Award, User, FileText, CheckCircle, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useGetPrograms, useGetAnnuals, Program, Annual } from "./ChainCall"

// This would come from your auth/wallet context
const mockUserData = {
    address: "0x1234...3456",
    role: "MANAGER",
}


export default function AdminPanel() {
    const router = useRouter()
    const [userData] = useState(mockUserData)
    const { programs } = useGetPrograms();
    console.log(programs);
    const { annuals } = useGetAnnuals();
    console.log(annuals);

    return (
        <div className="min-h-screen p-8 bg-gray-50">
            <div className="max-w-6xl mx-auto space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">
                        <span className="flex items-center gap-2">
                            👋 Welcome back,
                            <div className="flex items-center gap-2 text-primary">
                                <Wallet className="h-6 w-6" />
                                {userData.address}
                            </div>
                        </span>
                    </h1>
                    <p className="text-xl text-muted-foreground">
                        You are logged in as <span className="font-medium text-primary">{userData.role}</span>. What would you like
                        to do today?
                    </p>
                </div>

                {/* Action Cards */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>Create New</CardTitle>
                            <CardDescription>Add a new program or performance record</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full" onClick={() => router.push("/admin/creation")}>
                                <Plus className="mr-2 h-4 w-4" />
                                Create Program/Performance
                            </Button>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle>Update Existing</CardTitle>
                            <CardDescription>Modify existing programs or performances</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Button className="w-full" variant="secondary" onClick={() => router.push("/admin/update")}>
                                <PencilRuler className="mr-2 h-4 w-4" />
                                Update Records
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                <Separator className="my-8" />

                {/* Records List */}
                <div className="space-y-8">
                    {/* Programs Section */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                            <GraduationCap className="h-6 w-6 text-primary" />
                            Programs
                        </h2>
                        <div className="grid gap-4 lg:grid-cols-2">
                            {programs?.map((program: Program) => (
                                <Card key={program.studentId} className="hover:shadow-lg transition-shadow">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <GraduationCap className="h-5 w-5 text-primary" />
                                                <CardTitle className="text-xl">{program.programName}</CardTitle>
                                            </div>
                                            <Badge
                                                variant={
                                                    program.programStatus === "ACTIVE"
                                                        ? "default"
                                                        : program.programStatus === "COMPLETED"
                                                            ? "outline"
                                                            : "secondary"
                                                }
                                            >
                                                {program.programStatus}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Student ID</p>
                                                    <p className="text-sm">{program.studentId}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Year Range</p>
                                                    <p className="text-sm">{program.yearRange}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Certificate Issued</p>
                                                    <p className="text-sm">{new Date(program.certificateIssuedDate).toLocaleDateString()}</p>
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Issuer</p>
                                                    <p className="text-sm">{program.issuer}</p>
                                                </div>
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Signer</p>
                                                <p className="text-sm">{program.signer}</p>
                                            </div>
                                            {program.comments && (
                                                <div>
                                                    <p className="text-sm font-medium text-muted-foreground">Comments</p>
                                                    <p className="text-sm whitespace-pre-wrap">{program.comments}</p>
                                                </div>
                                            )}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>

                    {/* Annuals Section */}
                    <div className="space-y-4">
                        <h2 className="text-2xl font-semibold flex items-center gap-2">
                            <Award className="h-6 w-6 text-primary" />
                            Annual Performances
                        </h2>
                        <div className="grid gap-6">
                            {annuals?.map((annual: Annual, index: number) => (
                                <Card key={`${annual.parentTokenId}-${annual.year}-${index}`} className="hover:shadow-lg transition-shadow">
                                    <CardHeader className="pb-2">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                                                    <User className="h-6 w-6 text-primary" />
                                                </div>
                                                <div>
                                                    <CardTitle className="text-xl">{annual.studentName}</CardTitle>
                                                    <CardDescription className="flex items-center gap-2">
                                                        <Calendar className="h-4 w-4" />
                                                        Academic Year: {annual.year}
                                                    </CardDescription>
                                                </div>
                                            </div>
                                            <Badge
                                                variant={
                                                    annual.academicStatus === "SUCCESS"
                                                        ? "default"
                                                        : annual.academicStatus === "FAILED"
                                                            ? "destructive"
                                                            : "secondary"
                                                }
                                                className="h-6 flex items-center gap-1"
                                            >
                                                <CheckCircle className="h-3 w-3" />
                                                {annual.academicStatus}
                                            </Badge>
                                        </div>
                                    </CardHeader>
                                    <CardContent>
                                        <Tabs defaultValue="overview" className="w-full">
                                            <TabsList className="grid w-full grid-cols-3">
                                                <TabsTrigger value="overview">Overview</TabsTrigger>
                                                <TabsTrigger value="courses">Courses ({annual.courses.length})</TabsTrigger>
                                                <TabsTrigger value="details">Details</TabsTrigger>
                                            </TabsList>

                                            <TabsContent value="overview" className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4 mt-4">
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium text-muted-foreground">Program ID</p>
                                                        <p className="font-medium">{annual.parentTokenId}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium text-muted-foreground">Student ID</p>
                                                        <p className="font-medium">{annual.studentId}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                                                        <p className="font-medium">{new Date(annual.yearStartDate).toLocaleDateString()}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium text-muted-foreground">End Date</p>
                                                        <p className="font-medium">{new Date(annual.yearEndDate).toLocaleDateString()}</p>
                                                    </div>
                                                </div>
                                                {annual.academicComments && (
                                                    <div className="pt-4 border-t">
                                                        <p className="text-sm font-medium text-muted-foreground mb-1">Academic Comments</p>
                                                        <p className="text-sm">{annual.academicComments}</p>
                                                    </div>
                                                )}
                                            </TabsContent>

                                            <TabsContent value="courses">
                                                <div className="divide-y mt-4">
                                                    {annual.courses.map((course, index) => (
                                                        <div key={index} className="py-4 first:pt-0 last:pb-0">
                                                            <div className="flex items-start gap-4">
                                                                <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                                                                    <FileText className="h-4 w-4 text-primary" />
                                                                </div>
                                                                <div className="space-y-1 flex-1">
                                                                    <div className="flex items-center justify-between">
                                                                        <p className="font-medium">{course.name}</p>
                                                                        <Badge variant="outline" className="font-mono">
                                                                            {course.grade}
                                                                        </Badge>
                                                                    </div>
                                                                    <p className="text-sm text-muted-foreground">Result: {course.result}</p>
                                                                    {course.comments && (
                                                                        <p className="text-sm text-muted-foreground">{course.comments}</p>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </TabsContent>

                                            <TabsContent value="details" className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4 mt-4">
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium text-muted-foreground">Issuer</p>
                                                        <p className="font-medium">{annual.issuer}</p>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <p className="text-sm font-medium text-muted-foreground">Signer</p>
                                                        <p className="font-medium">{annual.signer}</p>
                                                    </div>
                                                </div>
                                                <div className="pt-4 border-t">
                                                    <p className="text-sm font-medium text-muted-foreground mb-2">Timeline</p>
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Calendar className="h-4 w-4 text-primary" />
                                                            <span>Started: {new Date(annual.yearStartDate).toLocaleDateString()}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm">
                                                            <Calendar className="h-4 w-4 text-primary" />
                                                            <span>Ended: {new Date(annual.yearEndDate).toLocaleDateString()}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            </TabsContent>
                                        </Tabs>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
