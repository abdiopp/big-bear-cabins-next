"use client";

import { useState } from "react";
import { CldUploadWidget, CloudinaryUploadWidgetResults } from "next-cloudinary";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Upload, Link, ImageIcon, X, Check } from "lucide-react";
import MediaGallery from "./MediaGallery";

interface ImagePickerProps {
    value: string;
    onChange: (url: string) => void;
    label?: string;
}

export default function ImagePicker({ value, onChange, label }: ImagePickerProps) {
    const [open, setOpen] = useState(false);
    const [urlInput, setUrlInput] = useState("");
    const [activeTab, setActiveTab] = useState("upload");

    const handleUploadSuccess = async (result: CloudinaryUploadWidgetResults) => {
        if (result.info && typeof result.info === "object" && "secure_url" in result.info) {
            const info = result.info;
            onChange(info.secure_url as string);

            // Save to database
            try {
                await fetch("/api/media", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        publicId: info.public_id,
                        url: info.secure_url,
                        format: info.format,
                        width: info.width,
                        height: info.height,
                        bytes: info.bytes,
                        filename: info.original_filename,
                    }),
                });
            } catch (e) {
                console.error("Failed to save media to database:", e);
            }

            setOpen(false);
        }
    };

    const handleUrlSubmit = () => {
        if (urlInput.trim()) {
            onChange(urlInput.trim());
            setUrlInput("");
            setOpen(false);
        }
    };

    const handleGallerySelect = (url: string) => {
        onChange(url);
        setOpen(false);
    };

    const handleClear = () => {
        onChange("");
    };

    return (
        <div className="space-y-2">
            {label && <Label>{label}</Label>}
            <div className="flex gap-2">
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button type="button" variant="outline" className="flex-1 justify-start cursor-pointer">
                            {value ? (
                                <span className="truncate max-w-[250px]">{value}</span>
                            ) : (
                                <>
                                    <ImageIcon className="w-4 h-4 mr-2" />
                                    Select Image
                                </>
                            )}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Select Image</DialogTitle>
                        </DialogHeader>
                        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                            <TabsList className="grid w-full grid-cols-3">
                                <TabsTrigger value="upload" className="flex gap-2">
                                    <Upload className="w-4 h-4" />
                                    Upload
                                </TabsTrigger>
                                <TabsTrigger value="url" className="flex gap-2">
                                    <Link className="w-4 h-4" />
                                    URL
                                </TabsTrigger>
                                <TabsTrigger value="gallery" className="flex gap-2">
                                    <ImageIcon className="w-4 h-4" />
                                    Gallery
                                </TabsTrigger>
                            </TabsList>

                            <TabsContent value="upload" className="mt-4">
                                <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg">
                                    <CldUploadWidget
                                        uploadPreset="my_preset"
                                        onSuccess={handleUploadSuccess}
                                        options={{
                                            sources: ["local", "url", "camera"],
                                            multiple: false,
                                            maxFiles: 1,
                                            // @ts-ignore - zIndex is a valid option but might be missing in type definition
                                            zIndex: 9999,
                                        }}
                                    >
                                        {({ open }) => (
                                            <Button
                                                type="button"
                                                onClick={() => open?.()}
                                                size="lg"
                                                className="cursor-pointer"
                                            >
                                                <Upload className="w-5 h-5 mr-2" />
                                                Upload from Computer
                                            </Button>
                                        )}
                                    </CldUploadWidget>
                                    <p className="text-sm text-muted-foreground mt-3">
                                        Supports JPG, PNG, GIF, WebP
                                    </p>
                                </div>
                            </TabsContent>

                            <TabsContent value="url" className="mt-4">
                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <Label>Image URL</Label>
                                        <Input
                                            value={urlInput}
                                            onChange={(e) => setUrlInput(e.target.value)}
                                            placeholder="https://example.com/image.jpg"
                                            onKeyDown={(e) => {
                                                if (e.key === "Enter") {
                                                    e.preventDefault();
                                                    handleUrlSubmit();
                                                }
                                            }}
                                        />
                                    </div>
                                    {urlInput && (
                                        <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                                            <img
                                                src={urlInput}
                                                alt="Preview"
                                                className="w-full h-full object-contain"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).style.display = "none";
                                                }}
                                            />
                                        </div>
                                    )}
                                    <Button
                                        type="button"
                                        onClick={handleUrlSubmit}
                                        disabled={!urlInput.trim()}
                                        className="w-full cursor-pointer"
                                    >
                                        <Check className="w-4 h-4 mr-2" />
                                        Use this URL
                                    </Button>
                                </div>
                            </TabsContent>

                            <TabsContent value="gallery" className="mt-4">
                                <MediaGallery onSelect={handleGallerySelect} />
                            </TabsContent>
                        </Tabs>
                    </DialogContent>
                </Dialog>

                {value && (
                    <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        onClick={handleClear}
                    >
                        <X className="w-4 h-4" />
                    </Button>
                )}
            </div>

            {/* Preview */}
            {value && (
                <div className="relative w-32 h-24 bg-muted rounded-lg overflow-hidden border">
                    <img
                        src={value}
                        alt="Selected"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                        }}
                    />
                </div>
            )}

            <style dangerouslySetInnerHTML={{
                __html: `
                .cloudinary-overlay,
                .cloudinary-popup,
                .cloudinary-modal,
                #cloudinary-widget,
                iframe[src*="cloudinary"] {
                    z-index: 99999 !important;
                    pointer-events: auto !important;
                }
            `}} />
        </div>
    );
}
