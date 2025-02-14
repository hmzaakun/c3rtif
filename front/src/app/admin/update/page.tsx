"use client"

import { useState } from "react"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Plus, Minus, AlertCircle, PencilLine, Sparkles } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import { useUpdateAll } from "../ChainWrite"

// Validation schemas
const programSchema = z.object({
    id: z.string().min(1, "Program ID is required"),
    studentId: z.string().min(1, "Student ID is required"),
    programName: z.string().min(1, "Program name is required"),
    yearRange: z.string().min(1, "Year range is required"),
    programStatus: z.string().min(1, "Program status is required"),
    certificateIssuedDate: z.string().min(1, "Certificate issued date is required"),
    comments: z.string(),
    issuer: z.string().min(1, "Issuer is required"),
    signer: z.string().min(1, "Signer is required"),
})

const performanceSchema = z.object({
    id: z.string().min(1, "Performance ID is required"),
    parentTokenId: z.string().min(1, "Program ID is required"),
    studentId: z.string().min(1, "Student ID is required"),
    studentName: z.string().min(1, "Student name is required"),
    year: z.string().min(1, "Year is required"),
    courses: z
        .array(
            z.object({
                name: z.string().min(1, "Course name is required"),
                grade: z.string().min(1, "Grade is required"),
                result: z.string().min(1, "Result is required"),
                comments: z.string(),
            }),
        )
        .min(1, "At least one course is required"),
    yearStartDate: z.string().min(1, "Start date is required"),
    yearEndDate: z.string().min(1, "End date is required"),
    academicStatus: z.string().min(1, "Academic status is required"),
    academicComments: z.string(),
    issuer: z.string().min(1, "Issuer is required"),
    signer: z.string().min(1, "Signer is required"),
})

type ProgramForm = z.infer<typeof programSchema>
type PerformanceForm = z.infer<typeof performanceSchema>

export default function UpdatePage() {
    const [activeForm, setActiveForm] = useState<"program" | "performance">("program")
    const { updateAll } = useUpdateAll();

    // Program Form
    const programForm = useForm<ProgramForm>({
        resolver: zodResolver(programSchema),
        defaultValues: {
            id: "",
            studentId: "",
            programName: "",
            yearRange: "",
            programStatus: "",
            certificateIssuedDate: "",
            comments: "",
            issuer: "",
            signer: "",
        },
    })

    // Performance Form
    const performanceForm = useForm<PerformanceForm>({
        resolver: zodResolver(performanceSchema),
        defaultValues: {
            id: "",
            parentTokenId: "",
            studentId: "",
            studentName: "",
            year: "",
            courses: [{ name: "", grade: "", result: "", comments: "" }],
            yearStartDate: "",
            yearEndDate: "",
            academicStatus: "",
            academicComments: "",
            issuer: "",
            signer: "",
        },
    })

    const { fields, append, remove } = useFieldArray({
        control: performanceForm.control,
        name: "courses",
    })

    const onProgramSubmit = (data: ProgramForm) => {
        console.log("Program Update Data:", data)
        const updateProgram = updateAll(data.id, data);
        console.log(JSON.stringify(updateProgram));
    }

    const onPerformanceSubmit = (data: PerformanceForm) => {
        console.log("Performance Update Data:", data)
        const updatePerformance = updateAll(data.id, data);
        console.log(JSON.stringify(updatePerformance));
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100/50 dark:from-slate-950 dark:to-slate-900">
            <div className="max-w-4xl mx-auto p-8 space-y-8">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/60">
                        <PencilLine className="h-10 w-10 text-primary" />
                        Update Records
                        <Sparkles className="h-6 w-6 text-primary/60 animate-pulse" />
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Update existing program or performance records by entering their ID and new information.
                    </p>
                </div>

                <Alert className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200/50 dark:from-yellow-950 dark:to-orange-950 dark:border-yellow-800/50">
                    <AlertCircle className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                    <AlertTitle className="text-yellow-800 dark:text-yellow-300">Important</AlertTitle>
                    <AlertDescription className="text-yellow-700 dark:text-yellow-400">
                        Make sure to verify the ID before updating. All fields must be filled even if they remain unchanged.
                    </AlertDescription>
                </Alert>

                <div className="rounded-lg backdrop-blur-sm bg-white/30 dark:bg-slate-950/30 p-1">
                    <Tabs
                        value={activeForm}
                        onValueChange={(value) => setActiveForm(value as "program" | "performance")}
                        className="w-full"
                    >
                        <TabsList className="grid w-full grid-cols-2 mb-4">
                            <TabsTrigger
                                value="program"
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            >
                                Update Program
                            </TabsTrigger>
                            <TabsTrigger
                                value="performance"
                                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                            >
                                Update Performance
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="program">
                            <Card className="border-0 shadow-lg shadow-primary/5 bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm">
                                <CardHeader className="border-b border-primary/5">
                                    <CardTitle className="text-2xl">Update Program</CardTitle>
                                    <CardDescription>Modify an existing program's information.</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <Form {...programForm}>
                                        <form onSubmit={programForm.handleSubmit(onProgramSubmit)} className="space-y-6">
                                            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                                                <FormField
                                                    control={programForm.control}
                                                    name="id"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-base">Program ID to Update</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    className="border-primary/20 bg-white dark:bg-slate-950"
                                                                    placeholder="Enter the program ID"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="space-y-6 border-t border-primary/10 pt-6">
                                                <FormField
                                                    control={programForm.control}
                                                    name="studentId"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Student ID</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} className="border-primary/20 bg-white/70 dark:bg-slate-950/70" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={programForm.control}
                                                    name="programName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Program Name</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} className="border-primary/20 bg-white/70 dark:bg-slate-950/70" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={programForm.control}
                                                    name="yearRange"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Year Range</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} className="border-primary/20 bg-white/70 dark:bg-slate-950/70" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={programForm.control}
                                                    name="programStatus"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Program Status</FormLabel>
                                                            <FormControl>
                                                                <Select
                                                                    onValueChange={field.onChange}
                                                                    value={field.value}
                                                                >
                                                                    <SelectTrigger className="border-primary/20 bg-white/70 dark:bg-slate-950/70">
                                                                        <SelectValue placeholder="Select status" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                                                        <SelectItem value="COMPLETED">Completed</SelectItem>
                                                                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={programForm.control}
                                                    name="certificateIssuedDate"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Certificate Issued Date</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    type="date"
                                                                    {...field}
                                                                    className="border-primary/20 bg-white/70 dark:bg-slate-950/70"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={programForm.control}
                                                    name="comments"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Comments</FormLabel>
                                                            <FormControl>
                                                                <Textarea {...field} className="border-primary/20 bg-white/70 dark:bg-slate-950/70" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={programForm.control}
                                                    name="issuer"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Issuer</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} className="border-primary/20 bg-white/70 dark:bg-slate-950/70" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={programForm.control}
                                                    name="signer"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Signer</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} className="border-primary/20 bg-white/70 dark:bg-slate-950/70" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <Button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                                            >
                                                Update Program
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="performance">
                            <Card className="border-0 shadow-lg shadow-primary/5 bg-white/70 dark:bg-slate-950/70 backdrop-blur-sm">
                                <CardHeader className="border-b border-primary/5">
                                    <CardTitle className="text-2xl">Update Performance Record</CardTitle>
                                    <CardDescription>Modify an existing performance record.</CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    <Form {...performanceForm}>
                                        <form onSubmit={performanceForm.handleSubmit(onPerformanceSubmit)} className="space-y-6">
                                            <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                                                <FormField
                                                    control={performanceForm.control}
                                                    name="id"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel className="text-base">Performance ID to Update</FormLabel>
                                                            <FormControl>
                                                                <Input
                                                                    {...field}
                                                                    className="border-primary/20 bg-white dark:bg-slate-950"
                                                                    placeholder="Enter the performance ID"
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <div className="space-y-6 border-t border-primary/10 pt-6">
                                                <FormField
                                                    control={performanceForm.control}
                                                    name="parentTokenId"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Program ID</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} className="border-primary/20 bg-white/70 dark:bg-slate-950/70" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={performanceForm.control}
                                                    name="studentId"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Student ID</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} className="border-primary/20 bg-white/70 dark:bg-slate-950/70" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={performanceForm.control}
                                                    name="studentName"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Student Name</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} className="border-primary/20 bg-white/70 dark:bg-slate-950/70" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={performanceForm.control}
                                                    name="year"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Year</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} className="border-primary/20 bg-white/70 dark:bg-slate-950/70" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <div className="space-y-4">
                                                    <div className="flex items-center justify-between">
                                                        <FormLabel>Courses</FormLabel>
                                                        <Button
                                                            type="button"
                                                            variant="outline"
                                                            size="sm"
                                                            onClick={() => append({ name: "", grade: "", result: "", comments: "" })}
                                                            className="border-primary/20 hover:bg-primary/10"
                                                        >
                                                            <Plus className="h-4 w-4" />
                                                            Add Course
                                                        </Button>
                                                    </div>
                                                    {fields.map((field, index) => (
                                                        <div
                                                            key={field.id}
                                                            className="p-4 rounded-lg border border-primary/10 bg-white/50 dark:bg-slate-950/50 space-y-4"
                                                        >
                                                            <div className="flex justify-end">
                                                                {index > 0 && (
                                                                    <Button type="button" variant="ghost" size="sm" onClick={() => remove(index)}>
                                                                        <Minus className="h-4 w-4" />
                                                                    </Button>
                                                                )}
                                                            </div>
                                                            <FormField
                                                                control={performanceForm.control}
                                                                name={`courses.${index}.name`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Course Name</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                {...field}
                                                                                className="border-primary/20 bg-white/70 dark:bg-slate-950/70"
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={performanceForm.control}
                                                                name={`courses.${index}.grade`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Grade</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                {...field}
                                                                                className="border-primary/20 bg-white/70 dark:bg-slate-950/70"
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={performanceForm.control}
                                                                name={`courses.${index}.result`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Result</FormLabel>
                                                                        <FormControl>
                                                                            <Input
                                                                                {...field}
                                                                                className="border-primary/20 bg-white/70 dark:bg-slate-950/70"
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={performanceForm.control}
                                                                name={`courses.${index}.comments`}
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Comments</FormLabel>
                                                                        <FormControl>
                                                                            <Textarea
                                                                                {...field}
                                                                                className="border-primary/20 bg-white/70 dark:bg-slate-950/70"
                                                                            />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                        </div>
                                                    ))}
                                                </div>

                                                <div className="grid grid-cols-2 gap-4">
                                                    <FormField
                                                        control={performanceForm.control}
                                                        name="yearStartDate"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>Start Date</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        type="date"
                                                                        {...field}
                                                                        className="border-primary/20 bg-white/70 dark:bg-slate-950/70"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={performanceForm.control}
                                                        name="yearEndDate"
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel>End Date</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        type="date"
                                                                        {...field}
                                                                        className="border-primary/20 bg-white/70 dark:bg-slate-950/70"
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>

                                                <FormField
                                                    control={performanceForm.control}
                                                    name="academicStatus"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Academic Status</FormLabel>
                                                            <FormControl>
                                                                <Select
                                                                    onValueChange={field.onChange}
                                                                    value={field.value}
                                                                >
                                                                    <SelectTrigger className="border-primary/20 bg-white/70 dark:bg-slate-950/70">
                                                                        <SelectValue placeholder="Select status" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="SUCCESS">Success</SelectItem>
                                                                        <SelectItem value="FAILED">Failed</SelectItem>
                                                                        <SelectItem value="REVOKED">Revoked</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={performanceForm.control}
                                                    name="academicComments"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Academic Comments</FormLabel>
                                                            <FormControl>
                                                                <Textarea {...field} className="border-primary/20 bg-white/70 dark:bg-slate-950/70" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={performanceForm.control}
                                                    name="issuer"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Issuer</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} className="border-primary/20 bg-white/70 dark:bg-slate-950/70" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />

                                                <FormField
                                                    control={performanceForm.control}
                                                    name="signer"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Signer</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} className="border-primary/20 bg-white/70 dark:bg-slate-950/70" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                            <Button
                                                type="submit"
                                                className="w-full bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70"
                                            >
                                                Update Performance Record
                                            </Button>
                                        </form>
                                    </Form>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}

