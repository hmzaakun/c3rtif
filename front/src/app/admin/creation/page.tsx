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
import { Plus, Minus } from "lucide-react"

import { useCreateProgram, useCreatePerformance } from "../ChainWrite"

import RoleWrapper from "@/app/admin/RoleWrapper"

// Validation schemas
const programSchema = z.object({
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

export default function AdminPage() {
    const { createProgram } = useCreateProgram();
    const { createPerformance } = useCreatePerformance();

    const [activeForm, setActiveForm] = useState<"program" | "performance">("program")

    // Program Form
    const programForm = useForm<ProgramForm>({
        resolver: zodResolver(programSchema),
        defaultValues: {
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
        console.log("Program Form Data:", data)
        const creationProgram = createProgram(data);
        console.log(JSON.stringify(creationProgram));
    }

    const onPerformanceSubmit = (data: PerformanceForm) => {
        console.log("Performance Form Data:", data)
        const creationPerformance = createPerformance(data.parentTokenId, data);
        console.log(JSON.stringify(creationPerformance));
    }

    return (
        <RoleWrapper>
            <div className="min-h-screen p-8 bg-gray-50">
                <div className="max-w-4xl mx-auto space-y-8">
                    <div className="flex gap-4">
                        <Button variant={activeForm === "program" ? "default" : "outline"} onClick={() => setActiveForm("program")}>
                            Program Form
                        </Button>
                        <Button
                            variant={activeForm === "performance" ? "default" : "outline"}
                            onClick={() => setActiveForm("performance")}
                        >
                            Performance Form
                        </Button>
                    </div>

                    {activeForm === "program" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Create Program</CardTitle>
                                <CardDescription>Enter the program details below.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...programForm}>
                                    <form onSubmit={programForm.handleSubmit(onProgramSubmit)} className="space-y-6">
                                        <FormField
                                            control={programForm.control}
                                            name="studentId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Student ID</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
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
                                                        <Input {...field} />
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
                                                        <Input {...field} />
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
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger>
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
                                                        <Input type="date" {...field} />
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
                                                        <Textarea {...field} />
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
                                                        <Input {...field} />
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
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <Button type="submit">Create Program</Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    )}

                    {activeForm === "performance" && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Create Performance Record</CardTitle>
                                <CardDescription>Enter the annual performance details below.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Form {...performanceForm}>
                                    <form onSubmit={performanceForm.handleSubmit(onPerformanceSubmit)} className="space-y-6">
                                        <FormField
                                            control={performanceForm.control}
                                            name="parentTokenId"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Program ID</FormLabel>
                                                    <FormControl>
                                                        <Input {...field} />
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
                                                        <Input {...field} />
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
                                                        <Input {...field} />
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
                                                        <Input {...field} />
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
                                                >
                                                    <Plus className="h-4 w-4" />
                                                    Add Course
                                                </Button>
                                            </div>
                                            {fields.map((field, index) => (
                                                <div key={field.id} className="space-y-4 p-4 border rounded-lg">
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
                                                                    <Input {...field} />
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
                                                                    <Input {...field} />
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
                                                                    <Input {...field} />
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
                                                                    <Textarea {...field} />
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
                                                            <Input type="date" {...field} />
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
                                                            <Input type="date" {...field} />
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
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger>
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
                                                        <Textarea {...field} />
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
                                                        <Input {...field} />
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
                                                        <Input {...field} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />

                                        <Button type="submit">Create Performance Record</Button>
                                    </form>
                                </Form>
                            </CardContent>
                        </Card>
                    )}
                </div>
            </div>
        </RoleWrapper>
    )
}

