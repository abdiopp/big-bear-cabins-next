import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { Card, CardContent } from "./ui/card";
import { getBlogs, getBlogCategories } from "@/actions/blogs";

type Blog = {
  id: string;
  categoryId: string;
  slug: string;
  title: string;
  subtitle: string | null;
  heroImage: string;
};

type BlogCategory = {
  id: string;
  slug: string;
  title: string;
};

export async function ThingsToDo() {
  const [blogs, categories] = await Promise.all([
    getBlogs(),
    getBlogCategories(),
  ]);

  const getCategorySlug = (categoryId: string) => {
    const cat = (categories as BlogCategory[]).find((c) => c.id === categoryId);
    return cat?.slug || "";
  };

  const displayBlogs = (blogs as Blog[]).slice(0, 6);

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl text-black mb-4">Things To Do In Big Bear</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Discover amazing activities and attractions just minutes from your cabin
          </p>
        </div>

        {/* Blog Cards Grid */}
        {displayBlogs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {displayBlogs.map((blog) => {
              const categorySlug = getCategorySlug(blog.categoryId);
              return (
                <Link key={blog.id} href={`/${categorySlug}/${blog.slug}`}>
                  <Card className="group cursor-pointer hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={blog.heroImage}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>

                    <CardContent className="p-4">
                      <h3 className="text-lg font-medium text-black line-clamp-1">{blog.title}</h3>
                      {blog.subtitle && (
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                          {blog.subtitle}
                        </p>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            <p>No activities available yet.</p>
          </div>
        )}

        {/* View All Button */}
        {displayBlogs.length > 0 && (
          <div className="text-center">
            <Link
              href="/activities"
              className="inline-flex items-center space-x-2 text-black hover:text-primary transition-colors"
            >
              <span>View all activities</span>
              <ChevronRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}