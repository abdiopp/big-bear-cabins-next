"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { updateCoupons } from "@/actions/cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, Plus, ChevronDown, ChevronUp, ImageIcon } from "lucide-react";
import { useState } from "react";
import ImagePicker from "./ImagePicker";

type CouponOffer = {
    slug: string;
    offerImage: string;
    badgeLabel?: string;
    icon?: string;
    offerTitle: string;
    offerSubtitle?: string;
    offerDescription: string;
    promoCode?: string;
    discount?: string;
    heroImage?: string;
    longDescription?: string;
    dates?: string;
    location?: string;
    features: string[];
    inclusions: string[];
    images: string[];
};

type CouponsFormData = {
    carouselTitle: string;
    viewAllBtnLabel?: string;
    viewAllBtnUrl?: string;
    offers: CouponOffer[];
};

function ArrayInput({ value, onChange, placeholder }: { value: string[], onChange: (val: string[]) => void, placeholder: string }) {
    const [inputValue, setInputValue] = useState("");

    const addItem = () => {
        if (inputValue.trim()) {
            onChange([...value, inputValue.trim()]);
            setInputValue("");
        }
    };

    const removeItem = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-2">
            <div className="flex gap-2">
                <Input
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={placeholder}
                    onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addItem(); } }}
                />
                <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Plus className="w-4 h-4" />
                </Button>
            </div>
            {value.length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {value.map((item, index) => (
                        <div key={index} className="flex items-center gap-1 bg-muted px-2 py-1 rounded text-sm">
                            <span className="max-w-[200px] truncate">{item}</span>
                            <button type="button" onClick={() => removeItem(index)} className="text-destructive hover:text-destructive/80">
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

function ImageArrayInput({ value, onChange }: { value: string[], onChange: (val: string[]) => void }) {
    const [showPicker, setShowPicker] = useState(false);
    const [currentValue, setCurrentValue] = useState("");

    const addImage = (url: string) => {
        if (url.trim()) {
            onChange([...value, url.trim()]);
            setCurrentValue("");
            setShowPicker(false);
        }
    };

    const removeImage = (index: number) => {
        onChange(value.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-3">
            <div className="flex gap-2 items-end">
                <div className="flex-1">
                    {showPicker ? (
                        <ImagePicker
                            value={currentValue}
                            onChange={addImage}
                        />
                    ) : (
                        <Button type="button" variant="outline" onClick={() => setShowPicker(true)} className="w-full">
                            <Plus className="w-4 h-4 mr-2" />
                            Add Image
                        </Button>
                    )}
                </div>
                {showPicker && (
                    <Button type="button" variant="ghost" size="sm" onClick={() => setShowPicker(false)}>
                        Cancel
                    </Button>
                )}
            </div>
            {value.length > 0 && (
                <div className="grid grid-cols-4 gap-2">
                    {value.map((url, index) => (
                        <div key={index} className="relative group aspect-square bg-muted rounded-lg overflow-hidden border">
                            <img
                                src={url}
                                alt={`Image ${index + 1}`}
                                className="w-full h-full object-cover"
                                onError={(e) => { (e.target as HTMLImageElement).src = "/placeholder.svg"; }}
                            />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-1 right-1 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                            >
                                <Trash2 className="w-3 h-3" />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default function CouponsForm({ defaultValues }: { defaultValues: CouponsFormData }) {
    const { register, control, handleSubmit } = useForm<CouponsFormData>({
        defaultValues: defaultValues || { carouselTitle: "", offers: [] },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "offers",
    });

    const [expandedOffers, setExpandedOffers] = useState<Set<number>>(new Set());

    const toggleExpand = (index: number) => {
        const newSet = new Set(expandedOffers);
        if (newSet.has(index)) {
            newSet.delete(index);
        } else {
            newSet.add(index);
        }
        setExpandedOffers(newSet);
    };

    const onSubmit = async (data: CouponsFormData) => {
        try {
            await updateCoupons(data);
            toast.success("Coupons updated successfully!");
        } catch (e) {
            console.error(e);
            toast.error("Failed to update Coupons.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
            <div className="space-y-4 border p-4 rounded-md bg-card">
                <h2 className="text-lg font-semibold">General Section Settings</h2>
                <div className="space-y-2">
                    <Label htmlFor="carouselTitle">Carousel Title</Label>
                    <Input id="carouselTitle" {...register("carouselTitle")} placeholder="e.g. Special Offers" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="viewAllBtnLabel">View All Button Label</Label>
                        <Input id="viewAllBtnLabel" {...register("viewAllBtnLabel")} placeholder="View All" />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="viewAllBtnUrl">View All Button URL</Label>
                        <Input id="viewAllBtnUrl" {...register("viewAllBtnUrl")} placeholder="/offers" />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold">Offers</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => append({
                        slug: "",
                        offerImage: "",
                        offerTitle: "",
                        offerDescription: "",
                        features: [],
                        inclusions: [],
                        images: [],
                    } as CouponOffer)}>
                        <Plus className="w-4 h-4 mr-2" /> Add Offer
                    </Button>
                </div>
                {fields.map((field, index) => (
                    <Card key={field.id}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2">
                                <button type="button" onClick={() => toggleExpand(index)} className="hover:bg-muted p-1 rounded">
                                    {expandedOffers.has(index) ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                </button>
                                Offer #{index + 1}: {field.offerTitle || "(untitled)"}
                            </CardTitle>
                            <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </CardHeader>
                        <CardContent className={`grid gap-4 p-4 ${!expandedOffers.has(index) ? 'hidden' : ''}`}>
                            {/* Basic Info */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Slug (URL path)*</Label>
                                    <Input {...register(`offers.${index}.slug`)} placeholder="e.g. oktoberfest" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Title*</Label>
                                    <Input {...register(`offers.${index}.offerTitle`)} placeholder="Offer Title" />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Subtitle</Label>
                                    <Input {...register(`offers.${index}.offerSubtitle`)} placeholder="Subtitle" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Discount Label</Label>
                                    <Input {...register(`offers.${index}.discount`)} placeholder="e.g. 15% Off" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Short Description*</Label>
                                <Textarea {...register(`offers.${index}.offerDescription`)} placeholder="Brief description for card view..." />
                            </div>

                            <div className="space-y-2">
                                <Label>Long Description</Label>
                                <Textarea {...register(`offers.${index}.longDescription`)} placeholder="Full detailed description for detail page..." rows={4} />
                            </div>

                            {/* Dates & Location */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Dates</Label>
                                    <Input {...register(`offers.${index}.dates`)} placeholder="e.g. September 20-22, 2025" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Location</Label>
                                    <Input {...register(`offers.${index}.location`)} placeholder="e.g. Big Bear Village" />
                                </div>
                            </div>

                            {/* Images */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Controller
                                    control={control}
                                    name={`offers.${index}.offerImage`}
                                    render={({ field }) => (
                                        <ImagePicker
                                            label="Card Image*"
                                            value={field.value || ""}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                                <Controller
                                    control={control}
                                    name={`offers.${index}.heroImage`}
                                    render={({ field }) => (
                                        <ImagePicker
                                            label="Hero Image"
                                            value={field.value || ""}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Icon (lucide name)</Label>
                                    <Input {...register(`offers.${index}.icon`)} placeholder="e.g. Beer, Mountain, Gift" />
                                </div>
                                <div className="space-y-2">
                                    <Label>Badge Label</Label>
                                    <Input {...register(`offers.${index}.badgeLabel`)} placeholder="e.g. New" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label>Promo Code</Label>
                                <Input {...register(`offers.${index}.promoCode`)} placeholder="CODE123" />
                            </div>

                            {/* Array Fields */}
                            <div className="space-y-2">
                                <Label>Features</Label>
                                <Controller
                                    control={control}
                                    name={`offers.${index}.features`}
                                    render={({ field }) => (
                                        <ArrayInput value={field.value || []} onChange={field.onChange} placeholder="Add a feature..." />
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Package Inclusions</Label>
                                <Controller
                                    control={control}
                                    name={`offers.${index}.inclusions`}
                                    render={({ field }) => (
                                        <ArrayInput value={field.value || []} onChange={field.onChange} placeholder="Add an inclusion..." />
                                    )}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label>Gallery Images</Label>
                                <Controller
                                    control={control}
                                    name={`offers.${index}.images`}
                                    render={({ field }) => (
                                        <ImageArrayInput value={field.value || []} onChange={field.onChange} />
                                    )}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Button type="submit" size="lg">Save Changes</Button>
        </form>
    );
}

