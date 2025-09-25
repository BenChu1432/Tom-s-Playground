"use client";
import React, { useRef, useState } from "react";
import { TextField, Button, Autocomplete, Container, ImageList, ImageListItem } from "@mui/material";
import Title from "../components/Title";
import newsSources from "../../data/constant";
import Content from "../components/Content";
import { Timestamp } from "next/dist/server/lib/cache-handlers/types";
import timeUtil from "../util/timeUtil";
import ImageCarousel from "../components/ImageCarousel";
import { Article } from "../../data/dto";

const NEXT_PUBLIC_BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default () => {
    const [selectedMedia, setSelectedMedia] = useState<{ label: string } | null>(null);
    const [data, setData] = useState<string[] | undefined>(undefined);

    const handleStartScraping = async () => {
        const mediaName = selectedMedia?.label;

        if (!mediaName) {
            alert("Please provide both the news URL and media name.");
            return;
        }
        try {
            console.log("BACKEND_URL:", NEXT_PUBLIC_BACKEND_URL);
            const response = await fetch(`${NEXT_PUBLIC_BACKEND_URL}/web-scraping/parse-news-urls/${mediaName}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const result = await response.json();
            console.log("result:", result);
            setData(result);
        } catch (error) {
            console.error("API Error:", error);
            alert("Something went wrong while calling the API.");
        }
    };

    return (
        <Container>
            <h1>Tom's test playground</h1>
            <div style={{ display: "flex", justifyContent: "left", alignItems: "center", gap: 110, marginTop: 20 }}>
                <Title text="News Media:" />
                <Autocomplete
                    disablePortal
                    options={newsSources}
                    sx={{ width: 300 }}
                    onChange={(event, newValue) => setSelectedMedia(newValue)}
                    renderInput={(params) => <TextField {...params} label="News" />}
                />
            </div>

            <div style={{ display: "flex", width: "100%", justifyContent: "end", alignItems: "center" }}>
                <Button variant="contained" style={{ marginTop: 20 }} onClick={handleStartScraping}>
                    Start Web-Scraping
                </Button>
            </div>
            {data &&
                data.map((url) => {
                    return <div>{url}</div>;
                })}
        </Container>
    );
};
