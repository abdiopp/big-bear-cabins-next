"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import {
    DragDropContext,
    Droppable,
    Draggable,
    DropResult,
} from "@hello-pangea/dnd";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import ImagePicker from "@/components/admin/ImagePicker";
import RichTextEditor from "@/components/RichTextEditor";
import {
    GripVertical,
    Plus,
    Trash2,
    ChevronDown,
    ChevronUp,
    Loader2,
} from "lucide-react";
import { toast } from "sonner";

/* ─── Zod Schemas ─── */

const fieldSchema = z.object({
    id: z.string(),
    label: z.string().min(1, "Label required"),
    name: z.string().min(1, "Name required"),
    type: z.enum([
        "text",
        "textarea",
        "email",
        "phone",
        "select",
        "checkbox",
        "radio",
        "date",
    ]),
    placeholder: z.string().optional(),
    required: z.boolean(),
    options: z.array(z.string()),
    order: z.number(),
});

const formCardSchema = z.object({
    id: z.string(),
    title: z.string().min(1, "Title required"),
    image: z.string().min(1, "Image required"),
    subtitle: z.string().optional(),
    cost: z.string().optional(),
    date: z.string().optional(),
    time: z.string().optional(),
    includes: z.array(z.string()),
    description: z.string().optional(),
    isPopular: z.boolean(),
    isActive: z.boolean(),
    order: z.number(),
    fields: z.array(fieldSchema),
});

const pageSchema = z.object({
    heroTitle: z.string().min(1, "Title required").max(120, "Max 120 chars"),
    heroSubtitle: z.string().max(200, "Max 200 chars").optional().or(z.literal("")),
    heroTagline: z.string().max(120, "Max 120 chars").optional().or(z.literal("")),
    heroDescription: z.string().optional().or(z.literal("")),
    heroImage: z.string().min(1, "Hero image required"),
    heroCtaText: z.string().optional().or(z.literal("")),
    heroCtaLink: z
        .string()
        .optional()
        .or(z.literal(""))
        .refine(
            (val) => !val || /^(\/|https?:\/\/)/.test(val),
            "Must be a valid URL or internal path"
        ),
    heroIsActive: z.boolean(),
    formCards: z.array(formCardSchema),
    isPublished: z.boolean(),
});

type PageFormValues = z.infer<typeof pageSchema>;

const FIELD_TYPES = [
    { value: "text", label: "Text" },
    { value: "textarea", label: "Textarea" },
    { value: "email", label: "Email" },
    { value: "phone", label: "Phone" },
    { value: "select", label: "Select" },
    { value: "checkbox", label: "Checkbox" },
    { value: "radio", label: "Radio" },
    { value: "date", label: "Date" },
];

/* ─── Helpers ─── */

const generateId = () => Math.random().toString(36).substring(2, 9);

function slugify(text: string): string {
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "_")
        .replace(/^_|_$/g, "");
}

/* ─── Responses Viewer ─── */

function ResponsesViewer() {
    const [responses, setResponses] = useState<any[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState("");
    const [loading, setLoading] = useState(true);
    const [expandedId, setExpandedId] = useState<string | null>(null);

    const fetchResponses = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams({ page: String(page), limit: "20" });
            if (statusFilter) params.set("status", statusFilter);
            const res = await fetch(`/api/experiences-page/responses?${params}`);
            if (res.ok) {
                const data = await res.json();
                setResponses(data.responses);
                setTotal(data.total);
            }
        } catch {
            toast.error("Failed to load responses");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchResponses();
    }, [page, statusFilter]);

    const updateStatus = async (id: string, status: string) => {
        try {
            const res = await fetch("/api/experiences-page/responses", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status }),
            });
            if (res.ok) {
                toast.success("Status updated");
                fetchResponses();
            }
        } catch {
            toast.error("Failed to update status");
        }
    };

    const statusBadge = (status: string) => {
        const colors: Record<string, string> = {
            new: "bg-blue-100 text-blue-800",
            reviewed: "bg-yellow-100 text-yellow-800",
            contacted: "bg-green-100 text-green-800",
        };
        return (
            <span
                className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[status] || "bg-gray-100"}`}
            >
                {status}
            </span>
        );
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">Form Responses</h2>
                <select
                    value={statusFilter}
                    onChange={(e) => {
                        setStatusFilter(e.target.value);
                        setPage(1);
                    }}
                    className="border rounded px-3 py-1.5 text-sm"
                >
                    <option value="">All Statuses</option>
                    <option value="new">New</option>
                    <option value="reviewed">Reviewed</option>
                    <option value="contacted">Contacted</option>
                </select>
                <span className="text-sm text-muted-foreground">
                    {total} total
                </span>
            </div>

            {loading ? (
                <div className="flex items-center justify-center p-8">
                    <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
                </div>
            ) : responses.length === 0 ? (
                <p className="text-muted-foreground text-sm italic p-4">
                    No responses yet.
                </p>
            ) : (
                <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-muted/50">
                            <tr>
                                <th className="text-left p-3 font-medium">Date</th>
                                <th className="text-left p-3 font-medium">Card ID</th>
                                <th className="text-left p-3 font-medium">Status</th>
                                <th className="text-left p-3 font-medium">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {responses.map((r: any) => (
                                <>
                                    <tr
                                        key={r.id}
                                        className="border-t hover:bg-muted/30 cursor-pointer"
                                        onClick={() =>
                                            setExpandedId(
                                                expandedId === r.id ? null : r.id
                                            )
                                        }
                                    >
                                        <td className="p-3">
                                            {new Date(r.submittedAt).toLocaleString()}
                                        </td>
                                        <td className="p-3 font-mono text-xs">
                                            {r.formCardId}
                                        </td>
                                        <td className="p-3">{statusBadge(r.status)}</td>
                                        <td className="p-3">
                                            <select
                                                value={r.status}
                                                onChange={(e) => {
                                                    e.stopPropagation();
                                                    updateStatus(r.id, e.target.value);
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                                className="border rounded px-2 py-1 text-xs"
                                            >
                                                <option value="new">New</option>
                                                <option value="reviewed">Reviewed</option>
                                                <option value="contacted">
                                                    Contacted
                                                </option>
                                            </select>
                                        </td>
                                    </tr>
                                    {expandedId === r.id && (
                                        <tr key={`${r.id}-detail`} className="border-t">
                                            <td colSpan={4} className="p-4 bg-muted/20">
                                                <pre className="text-xs whitespace-pre-wrap overflow-auto max-h-64">
                                                    {JSON.stringify(
                                                        r.responses,
                                                        null,
                                                        2
                                                    )}
                                                </pre>
                                                {r.ip && (
                                                    <p className="text-xs text-muted-foreground mt-2">
                                                        IP: {r.ip}
                                                    </p>
                                                )}
                                            </td>
                                        </tr>
                                    )}
                                </>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {total > 20 && (
                <div className="flex items-center gap-2 justify-center">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1}
                        onClick={() => setPage((p) => p - 1)}
                    >
                        Previous
                    </Button>
                    <span className="text-sm text-muted-foreground">
                        Page {page}
                    </span>
                    <Button
                        variant="outline"
                        size="sm"
                        disabled={page * 20 >= total}
                        onClick={() => setPage((p) => p + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}

/* ─── Card Fields Editor ─── */

function CardFieldsEditor({
    cardIndex,
    control,
    register,
    watch,
    setValue,
    errors,
}: any) {
    const { fields, remove, append, move } = useFieldArray({
        control,
        name: `formCards.${cardIndex}.fields`,
    });

    const [collapsed, setCollapsed] = useState<Record<number, boolean>>({});

    const addField = () => {
        append({
            id: generateId(),
            label: "",
            name: "",
            type: "text",
            placeholder: "",
            required: false,
            options: [],
            order: fields.length,
        });
    };

    return (
        <div className="space-y-3">
            <div className="flex justify-between items-center">
                <Label className="text-muted-foreground">Form Fields</Label>
                <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={addField}
                >
                    <Plus className="w-3 h-3 mr-1" />
                    Add Field
                </Button>
            </div>

            {fields.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">
                    No form fields. Add default booking fields above.
                </p>
            ) : (
                <Droppable
                    droppableId={`fields-${cardIndex}`}
                    type={`field-${cardIndex}`}
                >
                    {(provided) => (
                        <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            className="space-y-2"
                        >
                            {fields.map((field: any, fieldIndex: number) => {
                                const fieldType = watch(
                                    `formCards.${cardIndex}.fields.${fieldIndex}.type`
                                );
                                const isCollapsed = collapsed[fieldIndex];

                                return (
                                    <Draggable
                                        key={field.id}
                                        draggableId={field.id}
                                        index={fieldIndex}
                                    >
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                className="border rounded bg-background p-3"
                                            >
                                                <div className="flex items-center gap-2 mb-2">
                                                    <div
                                                        {...provided.dragHandleProps}
                                                        className="cursor-grab"
                                                    >
                                                        <GripVertical className="w-4 h-4 text-muted-foreground" />
                                                    </div>
                                                    <span className="flex-1 text-sm font-medium truncate">
                                                        {watch(
                                                            `formCards.${cardIndex}.fields.${fieldIndex}.label`
                                                        ) || "Untitled Field"}
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6"
                                                        onClick={() =>
                                                            setCollapsed((c) => ({
                                                                ...c,
                                                                [fieldIndex]:
                                                                    !c[fieldIndex],
                                                            }))
                                                        }
                                                    >
                                                        {isCollapsed ? (
                                                            <ChevronDown className="w-3 h-3" />
                                                        ) : (
                                                            <ChevronUp className="w-3 h-3" />
                                                        )}
                                                    </Button>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        className="h-6 w-6 text-destructive"
                                                        onClick={() =>
                                                            remove(fieldIndex)
                                                        }
                                                    >
                                                        <Trash2 className="w-3 h-3" />
                                                    </Button>
                                                </div>

                                                {!isCollapsed && (
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <div className="space-y-1">
                                                            <Label className="text-xs">
                                                                Label
                                                            </Label>
                                                            <Input
                                                                {...register(
                                                                    `formCards.${cardIndex}.fields.${fieldIndex}.label`
                                                                )}
                                                                placeholder="Field label"
                                                                onChange={(e) => {
                                                                    const val =
                                                                        e.target.value;
                                                                    setValue(
                                                                        `formCards.${cardIndex}.fields.${fieldIndex}.label`,
                                                                        val
                                                                    );
                                                                    // Auto-slugify name
                                                                    setValue(
                                                                        `formCards.${cardIndex}.fields.${fieldIndex}.name`,
                                                                        slugify(val)
                                                                    );
                                                                }}
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <Label className="text-xs">
                                                                Name (slug)
                                                            </Label>
                                                            <Input
                                                                {...register(
                                                                    `formCards.${cardIndex}.fields.${fieldIndex}.name`
                                                                )}
                                                                placeholder="field_name"
                                                            />
                                                        </div>
                                                        <div className="space-y-1">
                                                            <Label className="text-xs">
                                                                Type
                                                            </Label>
                                                            <select
                                                                {...register(
                                                                    `formCards.${cardIndex}.fields.${fieldIndex}.type`
                                                                )}
                                                                className="w-full border rounded px-3 py-2 text-sm"
                                                            >
                                                                {FIELD_TYPES.map(
                                                                    (t) => (
                                                                        <option
                                                                            key={t.value}
                                                                            value={
                                                                                t.value
                                                                            }
                                                                        >
                                                                            {t.label}
                                                                        </option>
                                                                    )
                                                                )}
                                                            </select>
                                                        </div>
                                                        <div className="space-y-1">
                                                            <Label className="text-xs">
                                                                Placeholder
                                                            </Label>
                                                            <Input
                                                                {...register(
                                                                    `formCards.${cardIndex}.fields.${fieldIndex}.placeholder`
                                                                )}
                                                                placeholder="Placeholder text"
                                                            />
                                                        </div>
                                                        <div className="flex items-center space-x-2 col-span-2">
                                                            <Switch
                                                                checked={watch(
                                                                    `formCards.${cardIndex}.fields.${fieldIndex}.required`
                                                                )}
                                                                onCheckedChange={(v) =>
                                                                    setValue(
                                                                        `formCards.${cardIndex}.fields.${fieldIndex}.required`,
                                                                        v,
                                                                        {
                                                                            shouldDirty:
                                                                                true,
                                                                        }
                                                                    )
                                                                }
                                                            />
                                                            <Label className="text-xs">
                                                                Required
                                                            </Label>
                                                        </div>
                                                        {(fieldType === "select" ||
                                                            fieldType === "radio") && (
                                                                <div className="col-span-2 space-y-1">
                                                                    <Label className="text-xs">
                                                                        Options (one per line)
                                                                    </Label>
                                                                    <Textarea
                                                                        value={(
                                                                            watch(
                                                                                `formCards.${cardIndex}.fields.${fieldIndex}.options`
                                                                            ) || []
                                                                        ).join("\n")}
                                                                        onChange={(e) =>
                                                                            setValue(
                                                                                `formCards.${cardIndex}.fields.${fieldIndex}.options`,
                                                                                e.target.value
                                                                                    .split(
                                                                                        "\n"
                                                                                    )
                                                                                    .filter(
                                                                                        Boolean
                                                                                    ),
                                                                                {
                                                                                    shouldDirty:
                                                                                        true,
                                                                                }
                                                                            )
                                                                        }
                                                                        rows={3}
                                                                        placeholder={
                                                                            "Option 1\nOption 2\nOption 3"
                                                                        }
                                                                    />
                                                                </div>
                                                            )}
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </div>
                    )}
                </Droppable>
            )}
        </div>
    );
}

/* ─── Includes Array Editor ─── */

function IncludesEditor({
    cardIndex,
    watch,
    setValue,
}: {
    cardIndex: number;
    watch: any;
    setValue: any;
}) {
    const includes: string[] =
        watch(`formCards.${cardIndex}.includes`) || [];

    return (
        <div className="space-y-2">
            <Label className="text-xs">Includes (one per line)</Label>
            <Textarea
                value={includes.join("\n")}
                onChange={(e) =>
                    setValue(
                        `formCards.${cardIndex}.includes`,
                        e.target.value.split("\n").filter(Boolean),
                        { shouldDirty: true }
                    )
                }
                rows={4}
                placeholder={"Item 1\nItem 2\nItem 3"}
            />
        </div>
    );
}

/* ─── Main Form Component ─── */

export default function ExperiencesPageForm() {
    const [isLoading, setIsLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [activeSection, setActiveSection] = useState<
        "hero" | "cards" | "responses"
    >("hero");
    const [expandedCards, setExpandedCards] = useState<Record<number, boolean>>(
        {}
    );

    const {
        register,
        control,
        handleSubmit,
        setValue,
        watch,
        formState: { errors },
        reset,
    } = useForm<PageFormValues>({
        resolver: zodResolver(pageSchema),
        defaultValues: {
            heroTitle: "",
            heroSubtitle: "",
            heroTagline: "",
            heroDescription: "",
            heroImage: "",
            heroCtaText: "",
            heroCtaLink: "",
            heroIsActive: true,
            formCards: [],
            isPublished: false,
        },
    });

    const {
        fields: cards,
        append: appendCard,
        remove: removeCard,
        move: moveCard,
    } = useFieldArray({ control, name: "formCards" });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch("/api/experiences-page");
                if (res.ok) {
                    const data = await res.json();
                    reset({
                        heroTitle: data.heroTitle || "",
                        heroSubtitle: data.heroSubtitle || "",
                        heroTagline: data.heroTagline || "",
                        heroDescription: data.heroDescription || "",
                        heroImage: data.heroImage || "",
                        heroCtaText: data.heroCtaText || "",
                        heroCtaLink: data.heroCtaLink || "",
                        heroIsActive: data.heroIsActive ?? true,
                        formCards: data.formCards || [],
                        isPublished: data.isPublished ?? false,
                    });
                }
            } catch {
                toast.error("Failed to load data");
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [reset]);

    const onSubmit = async (data: PageFormValues) => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/experiences-page", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || "Failed to save");
            }

            toast.success("Experiences page saved!");
            const updated = await res.json();
            reset(updated);
        } catch (error: any) {
            toast.error(error.message || "Failed to save");
        } finally {
            setIsSaving(false);
        }
    };

    const handleDragEnd = (result: DropResult) => {
        if (!result.destination) return;
        const { source, destination, type } = result;

        if (type === "card") {
            moveCard(source.index, destination.index);
        } else if (type.startsWith("field-")) {
            const cardIndex = parseInt(type.split("-")[1], 10);
            const items =
                watch(`formCards.${cardIndex}.fields`) || [];
            const newItems = Array.from(items);
            const [moved] = newItems.splice(source.index, 1);
            newItems.splice(destination.index, 0, moved);
            setValue(`formCards.${cardIndex}.fields`, newItems, {
                shouldDirty: true,
            });
        }
    };

    const addCard = () => {
        appendCard({
            id: generateId(),
            title: "",
            image: "",
            subtitle: "",
            cost: "",
            date: "",
            time: "",
            includes: [],
            description: "",
            isPopular: false,
            isActive: true,
            order: cards.length,
            fields: [
                {
                    id: generateId(),
                    label: "Name",
                    name: "name",
                    type: "text",
                    placeholder: "Your full name",
                    required: true,
                    options: [],
                    order: 0,
                },
                {
                    id: generateId(),
                    label: "Email",
                    name: "email",
                    type: "email",
                    placeholder: "your.email@example.com",
                    required: true,
                    options: [],
                    order: 1,
                },
                {
                    id: generateId(),
                    label: "Reservation Number",
                    name: "reservation_number",
                    type: "text",
                    placeholder: "Your cabin reservation number",
                    required: true,
                    options: [],
                    order: 2,
                },
                {
                    id: generateId(),
                    label: "Special Request",
                    name: "special_request",
                    type: "text",
                    placeholder: "Any special requirements",
                    required: false,
                    options: [],
                    order: 3,
                },
            ],
        });

        setExpandedCards((prev) => ({ ...prev, [cards.length]: true }));
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-5xl">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">Experiences Page</h1>
                <div className="flex items-center gap-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={watch("isPublished")}
                            onCheckedChange={(v) =>
                                setValue("isPublished", v, { shouldDirty: true })
                            }
                        />
                        <Label className="text-sm">Published</Label>
                    </div>
                    <Button type="submit" disabled={isSaving}>
                        {isSaving ? "Saving..." : "Save Changes"}
                    </Button>
                </div>
            </div>

            {/* Section Tabs */}
            <div className="flex border-b">
                {(
                    [
                        { key: "hero", label: "Hero Section" },
                        { key: "cards", label: "Experience Cards" },
                        { key: "responses", label: "Responses" },
                    ] as const
                ).map((tab) => (
                    <button
                        key={tab.key}
                        type="button"
                        className={`px-4 py-2 text-sm font-medium border-b-2 transition-colors ${activeSection === tab.key
                            ? "border-primary text-primary"
                            : "border-transparent text-muted-foreground hover:text-foreground"
                            }`}
                        onClick={() => setActiveSection(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* ─── Hero Section ─── */}
            {activeSection === "hero" && (
                <div className="space-y-6 border rounded-lg p-6 bg-card">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold">Hero Section</h2>
                        <div className="flex items-center space-x-2">
                            <Switch
                                checked={watch("heroIsActive")}
                                onCheckedChange={(v) =>
                                    setValue("heroIsActive", v, {
                                        shouldDirty: true,
                                    })
                                }
                            />
                            <Label className="text-sm">Active</Label>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="space-y-1">
                            <Label>
                                Heading Line 1 (60px) <span className="text-red-500">*</span>
                            </Label>
                            <Input
                                {...register("heroTitle")}
                                placeholder="e.g. We've got the"
                                maxLength={120}
                            />
                            <p className="text-xs text-muted-foreground">
                                {(watch("heroTitle") || "").length}/120
                            </p>
                            {errors.heroTitle && (
                                <p className="text-xs text-red-500">
                                    {errors.heroTitle.message}
                                </p>
                            )}
                        </div>
                        <div className="space-y-1">
                            <Label>Heading Line 2 (48px)</Label>
                            <Input
                                {...register("heroSubtitle")}
                                placeholder="e.g. Custom Experiences in Big Bear"
                                maxLength={200}
                            />
                            <p className="text-xs text-muted-foreground">
                                {(watch("heroSubtitle") || "").length}/200
                            </p>
                        </div>
                        <div className="space-y-1">
                            <Label>Heading Line 3 (35px, italic)</Label>
                            <Input
                                {...register("heroTagline")}
                                placeholder="e.g. you're looking for!"
                                maxLength={120}
                            />
                            <p className="text-xs text-muted-foreground">
                                {(watch("heroTagline") || "").length}/120
                            </p>
                        </div>
                    </div>

                    <div className="space-y-1">
                        <Label>Description (Rich Text)</Label>
                        <RichTextEditor
                            value={watch("heroDescription") || ""}
                            onChange={(v) =>
                                setValue("heroDescription", v, {
                                    shouldDirty: true,
                                })
                            }
                            minHeight="200px"
                        />
                    </div>

                    <ImagePicker
                        label="Hero Background Image"
                        value={watch("heroImage") || ""}
                        onChange={(v) =>
                            setValue("heroImage", v, { shouldDirty: true })
                        }
                    />
                    {errors.heroImage && (
                        <p className="text-xs text-red-500">
                            {errors.heroImage.message}
                        </p>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-1">
                            <Label>CTA Button Text</Label>
                            <Input
                                {...register("heroCtaText")}
                                placeholder="e.g. Book Now"
                            />
                        </div>
                        <div className="space-y-1">
                            <Label>CTA Link</Label>
                            <Input
                                {...register("heroCtaLink")}
                                placeholder="/path or https://..."
                            />
                            {errors.heroCtaLink && (
                                <p className="text-xs text-red-500">
                                    {errors.heroCtaLink.message}
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ─── Experience Cards (Form Cards) ─── */}
            {activeSection === "cards" && (
                <DragDropContext onDragEnd={handleDragEnd}>
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <h2 className="text-xl font-semibold">
                                Experience Cards ({cards.length})
                            </h2>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={addCard}
                            >
                                <Plus className="w-4 h-4 mr-2" />
                                Add Card
                            </Button>
                        </div>

                        <Droppable droppableId="cards" type="card">
                            {(provided) => (
                                <div
                                    {...provided.droppableProps}
                                    ref={provided.innerRef}
                                    className="space-y-4"
                                >
                                    {cards.map((card, cardIndex) => {
                                        const isExpanded =
                                            expandedCards[cardIndex];

                                        return (
                                            <Draggable
                                                key={card.id}
                                                draggableId={card.id}
                                                index={cardIndex}
                                            >
                                                {(provided) => (
                                                    <div
                                                        ref={
                                                            provided.innerRef
                                                        }
                                                        {...provided.draggableProps}
                                                        className="border rounded-lg bg-card shadow-sm overflow-hidden"
                                                    >
                                                        {/* Card Header */}
                                                        <div className="flex items-center gap-3 bg-muted/50 p-4 border-b">
                                                            <div
                                                                {...provided.dragHandleProps}
                                                                className="cursor-grab"
                                                            >
                                                                <GripVertical className="w-5 h-5 text-muted-foreground" />
                                                            </div>
                                                            <div className="flex-1 flex items-center gap-3">
                                                                <span className="font-medium truncate">
                                                                    {watch(
                                                                        `formCards.${cardIndex}.title`
                                                                    ) ||
                                                                        "Untitled Card"}
                                                                </span>
                                                                {watch(
                                                                    `formCards.${cardIndex}.isPopular`
                                                                ) && (
                                                                        <span className="bg-amber-100 text-amber-800 text-xs px-2 py-0.5 rounded-full">
                                                                            Popular
                                                                        </span>
                                                                    )}
                                                                {!watch(
                                                                    `formCards.${cardIndex}.isActive`
                                                                ) && (
                                                                        <span className="bg-gray-100 text-gray-500 text-xs px-2 py-0.5 rounded-full">
                                                                            Inactive
                                                                        </span>
                                                                    )}
                                                            </div>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                onClick={() =>
                                                                    setExpandedCards(
                                                                        (
                                                                            prev
                                                                        ) => ({
                                                                            ...prev,
                                                                            [cardIndex]:
                                                                                !prev[
                                                                                cardIndex
                                                                                ],
                                                                        })
                                                                    )
                                                                }
                                                            >
                                                                {isExpanded ? (
                                                                    <ChevronUp className="w-4 h-4" />
                                                                ) : (
                                                                    <ChevronDown className="w-4 h-4" />
                                                                )}
                                                            </Button>
                                                            <Button
                                                                type="button"
                                                                variant="ghost"
                                                                size="icon"
                                                                className="text-destructive"
                                                                onClick={() =>
                                                                    removeCard(
                                                                        cardIndex
                                                                    )
                                                                }
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        </div>

                                                        {/* Card Body */}
                                                        {isExpanded && (
                                                            <div className="p-4 space-y-4">
                                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                                    <div className="space-y-1">
                                                                        <Label>
                                                                            Title{" "}
                                                                            <span className="text-red-500">
                                                                                *
                                                                            </span>
                                                                        </Label>
                                                                        <Input
                                                                            {...register(
                                                                                `formCards.${cardIndex}.title`
                                                                            )}
                                                                            placeholder="Experience title"
                                                                        />
                                                                        {errors
                                                                            .formCards?.[
                                                                            cardIndex
                                                                        ]
                                                                            ?.title && (
                                                                                <p className="text-xs text-red-500">
                                                                                    {
                                                                                        errors
                                                                                            .formCards[
                                                                                            cardIndex
                                                                                        ]
                                                                                            ?.title
                                                                                            ?.message
                                                                                    }
                                                                                </p>
                                                                            )}
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <Label>
                                                                            Subtitle
                                                                        </Label>
                                                                        <Input
                                                                            {...register(
                                                                                `formCards.${cardIndex}.subtitle`
                                                                            )}
                                                                            placeholder="e.g. Experience Package"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <ImagePicker
                                                                    label="Card Image"
                                                                    value={
                                                                        watch(
                                                                            `formCards.${cardIndex}.image`
                                                                        ) || ""
                                                                    }
                                                                    onChange={(
                                                                        v
                                                                    ) =>
                                                                        setValue(
                                                                            `formCards.${cardIndex}.image`,
                                                                            v,
                                                                            {
                                                                                shouldDirty:
                                                                                    true,
                                                                            }
                                                                        )
                                                                    }
                                                                />

                                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                                    <div className="space-y-1">
                                                                        <Label>
                                                                            Cost
                                                                        </Label>
                                                                        <Input
                                                                            {...register(
                                                                                `formCards.${cardIndex}.cost`
                                                                            )}
                                                                            placeholder="$95.00"
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <Label>
                                                                            Date
                                                                        </Label>
                                                                        <Input
                                                                            {...register(
                                                                                `formCards.${cardIndex}.date`
                                                                            )}
                                                                            placeholder="Available Daily"
                                                                        />
                                                                    </div>
                                                                    <div className="space-y-1">
                                                                        <Label>
                                                                            Time
                                                                        </Label>
                                                                        <Input
                                                                            {...register(
                                                                                `formCards.${cardIndex}.time`
                                                                            )}
                                                                            placeholder="9:00 am – 2:00 pm"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-1">
                                                                    <Label>
                                                                        Description
                                                                    </Label>
                                                                    <Textarea
                                                                        {...register(
                                                                            `formCards.${cardIndex}.description`
                                                                        )}
                                                                        placeholder="Describe this experience..."
                                                                        rows={3}
                                                                    />
                                                                </div>

                                                                <IncludesEditor
                                                                    cardIndex={
                                                                        cardIndex
                                                                    }
                                                                    watch={watch}
                                                                    setValue={
                                                                        setValue
                                                                    }
                                                                />

                                                                <div className="flex gap-6">
                                                                    <div className="flex items-center space-x-2">
                                                                        <Switch
                                                                            checked={watch(
                                                                                `formCards.${cardIndex}.isPopular`
                                                                            )}
                                                                            onCheckedChange={(
                                                                                v
                                                                            ) =>
                                                                                setValue(
                                                                                    `formCards.${cardIndex}.isPopular`,
                                                                                    v,
                                                                                    {
                                                                                        shouldDirty:
                                                                                            true,
                                                                                    }
                                                                                )
                                                                            }
                                                                        />
                                                                        <Label className="text-sm">
                                                                            Popular
                                                                        </Label>
                                                                    </div>
                                                                    <div className="flex items-center space-x-2">
                                                                        <Switch
                                                                            checked={watch(
                                                                                `formCards.${cardIndex}.isActive`
                                                                            )}
                                                                            onCheckedChange={(
                                                                                v
                                                                            ) =>
                                                                                setValue(
                                                                                    `formCards.${cardIndex}.isActive`,
                                                                                    v,
                                                                                    {
                                                                                        shouldDirty:
                                                                                            true,
                                                                                    }
                                                                                )
                                                                            }
                                                                        />
                                                                        <Label className="text-sm">
                                                                            Active
                                                                        </Label>
                                                                    </div>
                                                                </div>

                                                                <hr />

                                                                <CardFieldsEditor
                                                                    cardIndex={
                                                                        cardIndex
                                                                    }
                                                                    control={
                                                                        control
                                                                    }
                                                                    register={
                                                                        register
                                                                    }
                                                                    watch={watch}
                                                                    setValue={
                                                                        setValue
                                                                    }
                                                                    errors={
                                                                        errors
                                                                    }
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </Draggable>
                                        );
                                    })}
                                    {provided.placeholder}
                                </div>
                            )}
                        </Droppable>
                    </div>
                </DragDropContext>
            )}

            {/* ─── Responses ─── */}
            {activeSection === "responses" && <ResponsesViewer />}
        </form>
    );
}
