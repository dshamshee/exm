"use client"

import { createColumnHelper } from "@tanstack/react-table"

import { type DataTableFeatures } from "./data-table-feature"
import { type Candidate } from "../query/get"
import { CandidateRowActions } from "./candidate-row-actions"

const columnHelper = createColumnHelper<DataTableFeatures, Candidate>()

export const columns = columnHelper.columns([
    columnHelper.accessor("name", {
        header: "Name",
    }),
    columnHelper.accessor("roll", {
        header: "Roll No.",
    }),
    columnHelper.accessor("phone", {
        header: "Phone",
    }),
    columnHelper.accessor("examName", {
        header: "Exam Name",
        cell: (info) => info.getValue() ?? "-",
    }),
    columnHelper.display({
        id: "options",
        header: "Option",
        cell: (props) => <CandidateRowActions candidate={props.row.original} />,
    }),
])