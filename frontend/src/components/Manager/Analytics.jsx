import React, { useEffect, useState } from "react";
import axios from "axios";
const http = axios.create();
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function Analytics() {
    const [data, setData] = useState({
        total: 0,
        byCategory: [],
        byStatus: [],
        feedbackTotal: 0,
        feedbackByCategory: [],
        feedbackByRating: [],
        feedbackAvgRating: 0,
    });

    const load = async () => {
        // Load complaints and feedback in parallel; fall back to local only for complaints
        const [complaintsRes, feedbackRes] = await Promise.allSettled([
            http.get("/api/complaints"),
            // Feedback API is mounted at /feedback in backend/server.js
            http.get("/feedback"),
        ]);

        // Complaints metrics
        let complaints = [];
        if (complaintsRes.status === "fulfilled") {
            complaints = complaintsRes.value?.data || [];
        } else {
            complaints = JSON.parse(localStorage.getItem("complaints") || "[]");
        }
        const compByCategoryEntries = Object.entries(
            complaints.reduce((acc, c) => {
                const key = c.category || "other";
                acc[key] = (acc[key] || 0) + 1;
                return acc;
            }, {})
        );
        const compByCategory = compByCategoryEntries.map(([name, value]) => ({ name, value }));
        const compByStatus = Object.entries(
            complaints.reduce((acc, c) => {
                const key = c.status || "unknown";
                acc[key] = (acc[key] || 0) + 1;
                return acc;
            }, {})
        ).map(([name, value]) => ({ name, value }));

        // Feedback metrics
        let feedback = [];
        if (feedbackRes.status === "fulfilled") {
            const raw = feedbackRes.value?.data;
            feedback = Array.isArray(raw) ? raw : (raw?.data || []);
        } else {
            feedback = [];
        }
        const fByCategory = Object.entries(
            feedback.reduce((acc, f) => {
                const key = f.category || "other";
                acc[key] = (acc[key] || 0) + 1;
                return acc;
            }, {})
        ).map(([name, value]) => ({ name, value }));
        const ratingCounts = feedback.reduce((acc, f) => {
            if (typeof f.rating === "number" && f.rating >= 1 && f.rating <= 5) {
                acc[f.rating] = (acc[f.rating] || 0) + 1;
            }
            return acc;
        }, {});
        const fByRating = [1, 2, 3, 4, 5].map((r) => ({ name: `${r}★`, value: ratingCounts[r] || 0 }));
        const ratedOnly = feedback.filter((f) => typeof f.rating === "number" && f.rating >= 1 && f.rating <= 5);
        const fAvgRating = ratedOnly.length ? (ratedOnly.reduce((s, f) => s + f.rating, 0) / ratedOnly.length) : 0;

        setData({
            total: complaints.length,
            byCategory: compByCategory,
            byStatus: compByStatus,
            feedbackTotal: feedback.length,
            feedbackByCategory: fByCategory,
            feedbackByRating: fByRating,
            feedbackAvgRating: Number(fAvgRating.toFixed(2)),
        });
    };

    useEffect(() => { load(); }, []);

    return (
        <div className="p-6">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Analytics</h1>
                    <p className="text-sm text-gray-500">Overview of complaints and feedback</p>
                </div>
                <div className="flex gap-4 text-sm">
                    <div className="bg-white rounded-xl shadow px-4 py-2">
                        Total complaints: <span className="font-semibold">{data.total}</span>
                    </div>
                    <div className="bg-white rounded-xl shadow px-4 py-2">
                        Feedback entries: <span className="font-semibold">{data.feedbackTotal}</span>
                    </div>
                    <div className="bg-white rounded-xl shadow px-4 py-2">
                        Avg rating: <span className="font-semibold">{data.feedbackAvgRating || 0}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-xl shadow">
                        <h2 className="font-semibold mb-2">Complaints by Category</h2>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie data={data.byCategory} dataKey="value" nameKey="name" outerRadius={90}>
                                    {data.byCategory.map((entry, index) => (
                                        <Cell key={`c-cat-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow">
                        <h2 className="font-semibold mb-2">Complaints by Status</h2>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={data.byStatus}>
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#3b82f6" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white p-4 rounded-xl shadow">
                        <h2 className="font-semibold mb-2">Ratings Distribution</h2>
                        <ResponsiveContainer width="100%" height={280}>
                            <BarChart data={data.feedbackByRating}>
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Legend />
                                <Bar dataKey="value" fill="#10b981" radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow">
                        <h2 className="font-semibold mb-2">Feedback by Category</h2>
                        <ResponsiveContainer width="100%" height={280}>
                            <PieChart>
                                <Pie data={data.feedbackByCategory} dataKey="value" nameKey="name" outerRadius={90}>
                                    {data.feedbackByCategory.map((entry, index) => (
                                        <Cell key={`f-cat-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
}
