"use client";

import { useForm, useFieldArray, Controller } from "react-hook-form";
import { updateHomeHero } from "@/actions/cms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { Trash2, Plus } from "lucide-react";
import ImagePicker from "./ImagePicker";

type HomeHeroFormData = {
    heading: string;
    images: { url: string }[];
    links: { text: string; url: string; icon: string }[];
};

export default function HomeHeroForm({ defaultValues }: { defaultValues: HomeHeroFormData }) {
    const { register, control, handleSubmit } = useForm<HomeHeroFormData>({
        defaultValues: defaultValues || { heading: "", images: [], links: [] },
    });

    const { fields: imageFields, append: appendImage, remove: removeImage } = useFieldArray({
        control,
        name: "images",
    });

    const { fields: linkFields, append: appendLink, remove: removeLink } = useFieldArray({
        control,
        name: "links",
    });

    const onSubmit = async (data: HomeHeroFormData) => {
        try {
            await updateHomeHero(data);
            toast.success("Home Hero updated successfully!");
        } catch (e) {
            console.error(e);
            toast.error("Failed to update Home Hero.");
        }
    };

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">
            <div className="space-y-2">
                <Label htmlFor="heading">Heading</Label>
                <Input id="heading" {...register("heading")} placeholder="Main Heading" />
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold">Images</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendImage({ url: "" })}>
                        <Plus className="w-4 h-4 mr-2" /> Add Image
                    </Button>
                </div>
                {imageFields.map((field, index) => (
                    <Card key={field.id}>
                        <CardContent className="flex gap-4 p-4 items-end">
                            <div className="flex-1">
                                <Controller
                                    control={control}
                                    name={`images.${index}.url`}
                                    render={({ field }) => (
                                        <ImagePicker
                                            label="Image"
                                            value={field.value}
                                            onChange={field.onChange}
                                        />
                                    )}
                                />
                            </div>
                            <Button type="button" variant="destructive" size="icon" onClick={() => removeImage(index)}>
                                <Trash2 className="w-4 h-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Label className="text-lg font-semibold">Links</Label>
                    <Button type="button" variant="outline" size="sm" onClick={() => appendLink({ text: "", url: "", icon: "" })}>
                        <Plus className="w-4 h-4 mr-2" /> Add Link
                    </Button>
                </div>
                {linkFields.map((field, index) => (
                    <Card key={field.id}>
                        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 items-end">
                            <div className="space-y-2">
                                <Label>Text</Label>
                                <Input {...register(`links.${index}.text`)} placeholder="Button Text" />
                            </div>
                            <div className="space-y-2">
                                <Label>URL</Label>
                                <Input {...register(`links.${index}.url`)} placeholder="/path or https://..." />
                            </div>
                            <div className="flex gap-2 items-end">
                                <div className="space-y-2 flex-1">
                                    <Label>Icon URL</Label>
                                    <Input {...register(`links.${index}.icon`)} placeholder="Icon URL" />
                                </div>
                                <Button type="button" variant="destructive" size="icon" onClick={() => removeLink(index)}>
                                    <Trash2 className="w-4 h-4" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <Button type="submit" size="lg">Save Changes</Button>
        </form>
    );
}
