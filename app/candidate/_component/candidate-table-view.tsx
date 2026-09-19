"use client"

import * as React from "react"
import { useGetCandidateQuery, useGetExamsQuery } from "../query/get"
import { columns } from "./column"
import { DataTable } from "./data-table"
import { Spinner } from "@/components/ui/spinner"
import { Input } from "@/components/ui/input"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Search, X } from "lucide-react"

export function CandidateTableView() {
    const { data: candidates, isLoading: isCandidatesLoading, isError, error } = useGetCandidateQuery()
    const { data: examsData } = useGetExamsQuery()

    const [rollSearch, setRollSearch] = React.useState("")
    const [selectedExam, setSelectedExam] = React.useState<string>("ALL")
    const [selectedPost, setSelectedPost] = React.useState<string>("ALL")

    // Derive list of unique available exams (combining DB exams and candidate records)
    const availableExams = React.useMemo(() => {
        const map = new Map<string, string>()
        if (examsData) {
            examsData.forEach((e) => {
                if (e.name) map.set(e.name, e.name)
            })
        }
        if (candidates) {
            candidates.forEach((c) => {
                if (c.examName) map.set(c.examName, c.examName)
            })
        }
        return Array.from(map.values())
    }, [examsData, candidates])

    // Derive unique exam posts from candidate records
    const availablePosts = React.useMemo(() => {
        if (!candidates) return []
        const set = new Set<string>()
        candidates.forEach((c) => {
            if (c.examPost) set.add(c.examPost)
        })
        return Array.from(set)
    }, [candidates])

    // Filter candidates based on Roll No search and Exam selection
    const filteredCandidates = React.useMemo(() => {
        if (!candidates) return []
        return candidates.filter((candidate) => {
            const matchesRoll = !rollSearch.trim() || candidate.roll.toString().includes(rollSearch.trim())
            const matchesExam = selectedExam === "ALL" || candidate.examName === selectedExam
            const matchesPost = selectedPost === "ALL" || candidate.examPost === selectedPost
            return matchesRoll && matchesExam && matchesPost
        })
    }, [candidates, rollSearch, selectedExam, selectedPost])

    const hasActiveFilters = rollSearch.trim() !== "" || selectedExam !== "ALL" || selectedPost !== "ALL"

    const handleResetFilters = () => {
        setRollSearch("")
        setSelectedExam("ALL")
        setSelectedPost("ALL")
    }

    if (isCandidatesLoading) {
        return (
            <div className="flex h-48 items-center justify-center rounded-md border">
                <div className="flex items-center gap-2 text-muted-foreground">
                    <Spinner size="md" />
                    <span>Loading candidates...</span>
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="flex h-48 items-center justify-center rounded-md border border-destructive/50">
                <p className="text-destructive">
                    {error?.message ?? "Failed to load candidates"}
                </p>
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-4">
            {/* Filters Toolbar */}
            <div className="flex flex-wrap items-center gap-3">
                {/* Search Roll No Input */}
                <div className="relative w-full sm:w-64">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search Roll No..."
                        value={rollSearch}
                        onChange={(e) => setRollSearch(e.target.value)}
                        className="pl-9"
                    />
                </div>

                {/* Exam Select Filter */}
                <div className="w-full sm:w-56">
                    <Select value={selectedExam} onValueChange={(val) => setSelectedExam(val ?? "ALL")}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Exam" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Exams</SelectItem>
                            {availableExams.map((examName) => (
                                <SelectItem key={examName} value={examName}>
                                    {examName}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Exam Post Filter */}
                <div className="w-full sm:w-56">
                    <Select value={selectedPost} onValueChange={(val) => setSelectedPost(val ?? "ALL")}>
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Post" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="ALL">All Posts</SelectItem>
                            {availablePosts.map((post) => (
                                <SelectItem key={post} value={post}>
                                    {post}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Reset Filters Button */}
                {hasActiveFilters && (
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleResetFilters}
                        className="h-8 px-2 lg:px-3"
                    >
                        Reset
                        <X className="ml-2 h-4 w-4" />
                    </Button>
                )}
            </div>

            {/* Candidates Table */}
            <DataTable columns={columns} data={filteredCandidates} />
        </div>
    )
}
