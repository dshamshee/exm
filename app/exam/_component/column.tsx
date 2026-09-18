"use client"

import { createColumnHelper } from "@tanstack/react-table"
import { type DataTableFeatures } from "./data-table-feature"
import { type Exam } from "../query/get"
import { ExamRowActions } from "./exam-row-actions"

const columnHelper = createColumnHelper<DataTableFeatures, Exam>()

export const columns = columnHelper.columns([
    columnHelper.accessor("name", {
        header: "Exam Name",
        cell: (info) => info.getValue() ?? "-",
    }),
    columnHelper.accessor("post", {
        header: "Post",
        cell: (info) => info.getValue() ?? "-",
    }),
    columnHelper.accessor("date", {
        header: "Date",
        cell: (info) => (info.getValue() ? String(info.getValue()) : "-"),
    }),
    columnHelper.accessor("time", {
        header: "Time",
        cell: (info) => info.getValue() ?? "-",
    }),
    columnHelper.accessor("reporting", {
        header: "Reporting",
        cell: (info) => info.getValue() ?? "-",
    }),
    columnHelper.accessor("center", {
        header: "Center",
        cell: (info) => info.getValue() ?? "-",
    }),
    columnHelper.display({
        id: "options",
        header: "Option",
        cell: (props) => <ExamRowActions exam={props.row.original} />,
    }),
])
