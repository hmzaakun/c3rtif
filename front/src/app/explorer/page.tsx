"use client"

import { useState } from "react"
import { GraduationCap, Award, Calendar, User, FileText, Filter } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

import { useGetPrograms, Program, Annual, useGetAnnuals } from "@/app/ChainCall"

export default function ExplorerPage() {
    const [activeTab, setActiveTab] = useState<"all" | "programs" | "performances">("all")
    const [statusFilter, setStatusFilter] = useState<string>("all")

    const { programs } = useGetPrograms()
    const { annuals } = useGetAnnuals()
    console.log("programs", programs)
    console.log("annuals", annuals)

    const filteredPrograms = programs?.filter(
        (program) => statusFilter === "all" || program.programStatus === statusFilter,
    )

    const filteredAnnuals = annuals?.filter((annual) => statusFilter === "all" || annual.academicStatus === statusFilter)

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-950 dark:to-slate-900">
            <div className="max-w-7xl mx-auto p-8 space-y-8">
                {/* Header */}
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight">Explore Certificates</h1>
                    <p className="text-xl text-muted-foreground">Browse through all programs and performance records</p>
                </div>

                {/* Filter */}
                <div className="flex items-center gap-2">
                    <Filter className="h-4 w-4 text-muted-foreground" />
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-[180px] bg-white dark:bg-slate-950">
                            <SelectValue placeholder="Filter by status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="ACTIVE">Active</SelectItem>
                            <SelectItem value="COMPLETED">Completed</SelectItem>
                            <SelectItem value="SUCCESS">Success</SelectItem>
                            <SelectItem value="FAILED">Failed</SelectItem>
                            <SelectItem value="REVOKED">Revoked</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Content Tabs */}
                <Tabs value={activeTab} onValueChange={(value: string) => setActiveTab(value as "all" | "programs" | "performances")}>
                    <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
                        <TabsTrigger value="all">All</TabsTrigger>
                        <TabsTrigger value="programs">Programs</TabsTrigger>
                        <TabsTrigger value="performances">Performances</TabsTrigger>
                    </TabsList>

                    <TabsContent value="all" className="space-y-8">
                        {/* Programs Section */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold flex items-center gap-2">
                                <GraduationCap className="h-6 w-6 text-primary" />
                                Programs
                            </h2>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {filteredPrograms?.map((program) => (
                                    <ProgramCard key={program.studentId} program={program} />
                                ))}
                            </div>
                        </div>

                        {/* Performances Section */}
                        <div className="space-y-4">
                            <h2 className="text-2xl font-semibold flex items-center gap-2">
                                <Award className="h-6 w-6 text-primary" />
                                Performance Records
                            </h2>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {filteredAnnuals?.map((annual, index) => (
                                    <PerformanceCard key={`${annual.parentTokenId}-${annual.year}-${index}`} annual={annual} />
                                ))}
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="programs">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredPrograms?.map((program) => (
                                <ProgramCard key={program.studentId} program={program} />
                            ))}
                        </div>
                    </TabsContent>

                    <TabsContent value="performances">
                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            {filteredAnnuals?.map((annual, index) => (
                                <PerformanceCard key={`${annual.parentTokenId}-${annual.year}-${index}`} annual={annual} />
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

function ProgramCard({ program }: { program: Program }) {
    return (
        <Card className="hover:shadow-lg transition-shadow bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm">
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
                    {program.comments && (
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Comments</p>
                            <p className="text-sm whitespace-pre-wrap">{program.comments}</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

function PerformanceCard({ annual }: { annual: Annual }) {
    return (
        <Card className="hover:shadow-lg transition-shadow bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm">
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
                                ? "outline"
                                : annual.academicStatus === "FAILED"
                                    ? "destructive"
                                    : "secondary"
                        }
                        className="h-6 flex items-center gap-1"
                    >
                        {annual.academicStatus}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Program ID</p>
                            <p className="text-sm">{annual.parentTokenId}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Student ID</p>
                            <p className="text-sm">{annual.studentId}</p>
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <FileText className="h-4 w-4 text-primary" />
                            <p className="text-sm font-medium">Courses ({annual.courses.length})</p>
                        </div>
                        <div className="space-y-2">
                            {annual.courses.map((course, index) => (
                                <div key={index} className="bg-primary/5 rounded-lg p-2 text-sm">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-medium">{course.name}</span>
                                        <Badge variant="outline" className="font-mono">
                                            {course.grade}
                                        </Badge>
                                    </div>
                                    <p className="text-muted-foreground">Result: {course.result}</p>
                                    {course.comments && <p className="text-muted-foreground mt-1">{course.comments}</p>}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Start Date</p>
                            <p className="text-sm">{new Date(annual.yearStartDate).toLocaleDateString()}</p>
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">End Date</p>
                            <p className="text-sm">{new Date(annual.yearEndDate).toLocaleDateString()}</p>
                        </div>
                    </div>

                    {annual.academicComments && (
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">Academic Comments</p>
                            <p className="text-sm whitespace-pre-wrap">{annual.academicComments}</p>
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}

