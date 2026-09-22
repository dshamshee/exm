"use client"

import * as React from "react"
import { useGetExamQuery } from "../query/get"
import { columns } from "./column"
import { DataTable } from "./data-table"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

export function ExamTableView() {
    const { data: exams, isLoading, isError, error } = useGetExamQuery()
    const [searchQuery, setSearchQuery] = React.useState("")

    const filteredExams = React.useMemo(() => {
        if (!exams) return []
        if (!searchQuery.trim()) return exams
        const query = searchQuery.toLowerCase().trim()
        return exams.filter((exam) => {
            const matchesName = exam.name?.toLowerCase().includes(query)
            const matchesPost = exam.post?.toLowerCase().includes(query)
            const matchesCenter = exam.center?.toLowerCase().includes(query)
            return matchesName || matchesPost || matchesCenter
        })
    }, [exams, searchQuery])

    if (isLoading) {
        return (
            <div className="flex h-48 items-center justify-center rounded-md border">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Spinner size="md" />
                    <span>Loading exam details...</span>
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex h-48 items-center justify-center rounded-md border border-destructive/50">
                <p className="text-destructive">
                    {error?.message ?? "Failed to load exam details"}
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Filter Toolbar */}
            <div className="flex items-center gap-3">
                <div className="relative w-full sm:w-72">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search Exam, Post, or Center..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {searchQuery.trim() !== "" && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSearchQuery("")}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Exam Table */}
            <DataTable columns={columns} data={filteredExams} />
        </div>
    )
}
