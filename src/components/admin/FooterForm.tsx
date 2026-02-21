"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import ImagePicker from "@/components/admin/ImagePicker";
import { GripVertical, Plus, Trash2, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";

const linkSchema = z.object({
    id: z.string(),
    label: z.string().min(1, "Label is required"),
    url: z.string().min(1, "URL is required").refine(
        (val) => val.startsWith("/") || val.startsWith("http://") || val.startsWith("https://") || val.startsWith("mailto:") || val.startsWith("tel:"),
        { message: "Must be a valid URL (https://) or internal path (/path)" }
    ),
    isExternal: z.boolean(),
    newTab: z.boolean(),
});

const sectionSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "Section title is required"),
    links: z.array(linkSchema),
});

const socialLinkSchema = z.object({
    id: z.string(),
    platform: z.string().optional(),
    url: z.string().min(1, "URL is required").refine(
        (val) => val.startsWith("/") || val.startsWith("http://") || val.startsWith("https://") || val.startsWith("mailto:") || val.startsWith("tel:"),
        { message: "Must be a valid URL (https://) or internal path (/path)" }
    ),
    icon: z.string().min(1, "Icon is required"),
    altText: z.string().optional(),
});

const footerSchema = z.object({
    sections: z.array(sectionSchema),
    socialLinks: z.array(socialLinkSchema),
});

type FooterFormValues = z.infer<typeof footerSchema>;

export default function FooterForm() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset
    } = useForm<FooterFormValues>({
        resolver: zodResolver(footerSchema),
        defaultValues: { sections: [], socialLinks: [] },
    });

    const {
        fields: sections,
        append: appendSection,
        remove: removeSection,
        move: moveSection
    } = useFieldArray({
        control,
        name: "sections",
    });

    const {
        fields: socialLinks,
        append: appendSocial,
        remove: removeSocial,
        move: moveSocial
    } = useFieldArray({
        control,
        name: "socialLinks",
    });

    useEffect(() => {
        const fetchFooter = async () => {
            try {
                const res = await fetch("/api/footer");
                if (res.ok) {
                    const data = await res.json();
                    reset({
                        sections: data.sections || [],
                        socialLinks: data.socialLinks || []
                    });
                }
            } catch (error) {
                console.error("Failed to fetch footer:", error);
                toast.error("Failed to load footer data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchFooter();
    }, [reset]);

    const onSubmit = async (data: FooterFormValues) => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/footer", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) throw new Error("Failed to save");
            toast.success("Footer saved successfully");

            // Re-fetch to normalize any data from the server
            const updatedData = await res.json();
            reset(updatedData);
        } catch (error) {
            console.error(error);
            toast.error("Failed to save footer");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;

        const { source, destination, type } = result;

        if (type === "section") {
            moveSection(source.index, destination.index);
        } else if (type === "socialLink") {
            moveSocial(source.index, destination.index);
        } else if (type.startsWith("link-")) {
            const sectionIndex = parseInt(type.split("-")[1], 10);
            const items = watch(`sections.${sectionIndex}.links`) || [];
            const newItems = Array.from(items);
            const [reorderedItem] = newItems.splice(source.index, 1);
            newItems.splice(destination.index, 0, reorderedItem);
            setValue(`sections.${sectionIndex}.links`, newItems, { shouldValidate: true, shouldDirty: true });
        }
    };

    if (isLoading) return <div className="p-8 text-center text-muted-foreground">Loading...</div>;

    const generateId = () => Math.random().toString(36).substring(2, 9);

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 max-w-4xl">
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Manage Footer</h1>
                <Button type="submit" disabled={isSaving}>
                    {isSaving ? "Saving..." : "Save Changes"}
                </Button>
            </div>

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Footer Sections</h2>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => appendSection({ id: generateId(), title: "New Section", links: [] })}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Section
                        </Button>
                    </div>

                    <Droppable droppableId="sections" type="section">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4">
                                {sections.map((section, sectionIndex) => (
                                    <Draggable key={section.id} draggableId={section.id} index={sectionIndex}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className="border rounded-lg bg-card text-card-foreground shadow-sm overflow-hidden"
                                            >
                                                <div className="flex items-center gap-4 bg-muted/50 p-4 border-b">
                                                    <div {...provided.dragHandleProps} className="cursor-grab hover:bg-muted p-1 rounded">
                                                        <GripVertical className="w-5 h-5 text-muted-foreground" />
                                                    </div>
                                                    <div className="flex-1 space-y-1">
                                                        <Label>Section Title</Label>
                                                        <Input
                                                            {...register(`sections.${sectionIndex}.title`)}
                                                            placeholder="e.g., Company, Support"
                                                        />
                                                        {errors.sections?.[sectionIndex]?.title && (
                                                            <p className="text-xs text-red-500">{errors.sections[sectionIndex]?.title?.message}</p>
                                                        )}
                                                    </div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        className="text-destructive hover:bg-destructive/10"
                                                        onClick={() => removeSection(sectionIndex)}
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </Button>
                                                </div>

                                                <div className="p-4 space-y-4">
                                                    <div className="flex justify-between items-center">
                                                        <Label className="text-muted-foreground">Links</Label>
                                                        <Button
                                                            type="button"
                                                            variant="secondary"
                                                            size="sm"
                                                            onClick={() => {
                                                                const currentLinks = watch(`sections.${sectionIndex}.links`) || [];
                                                                setValue(`sections.${sectionIndex}.links`, [
                                                                    ...currentLinks,
                                                                    { id: generateId(), label: "New Link", url: "https://", isExternal: false, newTab: false }
                                                                ]);
                                                            }}
                                                        >
                                                            <Plus className="w-3 h-3 mr-2" />
                                                            Add Link
                                                        </Button>
                                                    </div>

                                                    <SectionLinksField
                                                        sectionIndex={sectionIndex}
                                                        control={control}
                                                        register={register}
                                                        watch={watch}
                                                        setValue={setValue}
                                                        errors={errors}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    <hr className="my-8" />

                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold">Social Media Links</h2>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => appendSocial({ id: generateId(), platform: "", url: "https://", icon: "", altText: "" })}
                        >
                            <Plus className="w-4 h-4 mr-2" />
                            Add Social Link
                        </Button>
                    </div>

                    <Droppable droppableId="socialLinks" type="socialLink">
                        {(provided) => (
                            <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                                {socialLinks.map((social, index) => (
                                    <Draggable key={social.id} draggableId={social.id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className="border rounded-lg bg-card p-4 flex gap-4 mt-0 shadow-sm"
                                            >
                                                <div {...provided.dragHandleProps} className="cursor-grab text-muted-foreground mt-8">
                                                    <GripVertical className="w-5 h-5" />
                                                </div>
                                                <div className="flex-1 space-y-4">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div className="space-y-1">
                                                            <Label>Platform Name</Label>
                                                            <Input {...register(`socialLinks.${index}.platform`)} placeholder="e.g. Twitter" />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <Label>URL</Label>
                                                            <Input {...register(`socialLinks.${index}.url`)} placeholder="https://" />
                                                            {errors.socialLinks?.[index]?.url && <p className="text-xs text-red-500">{errors.socialLinks[index]?.url?.message}</p>}
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1">
                                                        <ImagePicker
                                                            label="Social Icon"
                                                            value={watch(`socialLinks.${index}.icon`)}
                                                            onChange={(val) => setValue(`socialLinks.${index}.icon`, val, { shouldValidate: true, shouldDirty: true })}
                                                        />
                                                        {errors.socialLinks?.[index]?.icon && <p className="text-xs text-red-500">{errors.socialLinks[index]?.icon?.message}</p>}
                                                    </div>
                                                    <div className="space-y-1">
                                                        <Label>Alt Text</Label>
                                                        <Input {...register(`socialLinks.${index}.altText`)} placeholder="e.g. Twitter Profile" />
                                                    </div>
                                                </div>
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    size="icon"
                                                    className="self-start text-destructive"
                                                    onClick={() => removeSocial(index)}
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </DragDropContext>
        </form>
    );
}

// Sub-component for individual section links to isolate re-renders and drag drops
function SectionLinksField({ sectionIndex, control, register, watch, setValue, errors }: any) {
    const { fields, remove, insert } = useFieldArray({
        control,
        name: `sections.${sectionIndex}.links`
    });

    if (fields.length === 0) {
        return <p className="text-sm text-muted-foreground italic">No links added to this section yet.</p>;
    }

    return (
        <Droppable droppableId={`links-${sectionIndex}`} type={`link-${sectionIndex}`}>
            {(provided) => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-3">
                    {fields.map((field: any, index: number) => (
                        <Draggable key={field.id} draggableId={field.id} index={index}>
                            {(provided) => (
                                <div
                                    ref={provided.innerRef}
                                    {...provided.draggableProps}
                                    className="flex items-start gap-4 p-3 border rounded bg-background"
                                >
                                    <div {...provided.dragHandleProps} className="cursor-grab mt-6">
                                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                                    </div>
                                    <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <Label className="text-xs">Label</Label>
                                            <Input
                                                {...register(`sections.${sectionIndex}.links.${index}.label`)}
                                                placeholder="Link Text"
                                            />
                                            {errors.sections?.[sectionIndex]?.links?.[index]?.label && (
                                                <p className="text-xs text-red-500">{errors.sections[sectionIndex].links[index].label.message}</p>
                                            )}
                                        </div>
                                        <div className="space-y-1">
                                            <Label className="text-xs">URL</Label>
                                            <Input
                                                {...register(`sections.${sectionIndex}.links.${index}.url`)}
                                                placeholder="/path or https://"
                                            />
                                            {errors.sections?.[sectionIndex]?.links?.[index]?.url && (
                                                <p className="text-xs text-red-500">{errors.sections[sectionIndex].links[index].url.message}</p>
                                            )}
                                        </div>
                                        <div className="flex gap-6 col-span-1 md:col-span-2">
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id={`external-${field.id}`}
                                                    checked={watch(`sections.${sectionIndex}.links.${index}.isExternal`)}
                                                    onCheckedChange={(checked) => setValue(`sections.${sectionIndex}.links.${index}.isExternal`, checked, { shouldDirty: true })}
                                                />
                                                <Label htmlFor={`external-${field.id}`} className="text-xs">External Link</Label>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <Switch
                                                    id={`newtab-${field.id}`}
                                                    checked={watch(`sections.${sectionIndex}.links.${index}.newTab`)}
                                                    onCheckedChange={(checked) => setValue(`sections.${sectionIndex}.links.${index}.newTab`, checked, { shouldDirty: true })}
                                                />
                                                <Label htmlFor={`newtab-${field.id}`} className="text-xs">Open in New Tab</Label>
                                            </div>
                                        </div>
                                    </div>
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="text-destructive mt-4"
                                        onClick={() => remove(index)}
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            )}
                        </Draggable>
                    ))}
                    {provided.placeholder}
                </div>
            )}
        </Droppable>
    );
}
