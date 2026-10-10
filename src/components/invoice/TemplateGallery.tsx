"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { templateThumbnail } from "@/lib/invoice/templates";
import type { InvoiceTemplate } from "@/lib/invoice/types";

export default function TemplateGallery({ templates }: { templates: readonly InvoiceTemplate[] }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(() => ["All", ...new Set(templates.map((t) => t.category))], [templates]);

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return templates
      .filter((t) => category === "All" || t.category === category)
      .filter((t) => !keyword || `${t.name} ${t.category} ${t.description}`.toLowerCase().includes(keyword))
      .sort((a, b) => Number(b.isFree) - Number(a.isFree));
  }, [templates, category, search]);

  return (
    <>
      <section className="mx-auto mb-8 flex w-full max-w-[1440px] flex-col items-stretch gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
        <div>
          <span className="inline-flex text-xs font-bold tracking-[0.12em] text-blue-600 uppercase">
            Invoice Generator
          </span>
          <h1 className="mt-2 mb-2.5 text-[clamp(28px,4vw,46px)] leading-[1.08] font-bold tracking-[-0.035em] text-ink">
            Choose your invoice design
          </h1>
          <p className="max-w-[660px] text-[15px] leading-[1.7] text-slate-500">
            Pick a template, fill in your details and download a print-ready PDF. Everything runs in your browser —
            your invoice data never leaves your device.
          </p>
        </div>
        <input
          type="search"
          aria-label="Search templates"
          className="h-12 w-full rounded-xl border border-slate-200 bg-white px-4 text-ink shadow-card outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] motion-reduce:transition-none lg:w-[min(100%,360px)]"
          placeholder="Search templates..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </section>

      <nav
        aria-label="Template categories"
        className="mx-auto mb-7 flex w-full max-w-[1440px] items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {categories.map((item) => (
          <button
            type="button"
            key={item}
            aria-pressed={category === item}
            className={`shrink-0 rounded-full border px-3.5 py-[9px] text-[13px] font-semibold transition active:scale-[0.97] motion-reduce:transition-none ${
              category === item
                ? "border-ink bg-ink text-white"
                : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-ink"
            }`}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </nav>

      {filtered.length === 0 ? (
        <p className="mx-auto max-w-[1440px] py-16 text-center text-sm text-slate-500">
          No templates match &ldquo;{search}&rdquo;.
        </p>
      ) : (
        <section className="mx-auto grid w-full max-w-[1440px] grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] md:gap-6">
          {filtered.map((template, index) => {
            const href = `/invoice/editor/${template.id}`;
            return (
              <article
                key={template.id}
                className="mx-auto w-full max-w-[340px] min-w-0 rounded-[18px] border border-slate-200 bg-white p-2 shadow-card transition duration-[220ms] hover:-translate-y-1 hover:border-blue-600/25 hover:shadow-card-hover motion-reduce:transition-none sm:max-w-none md:p-0"
              >
                <Link
                  href={href}
                  aria-label={`Use the ${template.name} template`}
                  className="group relative block aspect-[210/297] w-full overflow-hidden rounded-xl bg-[linear-gradient(145deg,#eef2f7,#f8fafc)]"
                >
                  <Image
                    src={templateThumbnail(template.id)}
                    alt={`${template.name} invoice template preview`}
                    fill
                    priority={index < 4}
                    sizes="(max-width: 640px) 340px, (max-width: 768px) 50vw, 300px"
                    className="object-cover transition-transform duration-300 group-hover:scale-[1.015] motion-reduce:transition-none"
                  />
                </Link>
                <div className="px-2.5 pb-2.5">
                  <div className="flex items-center justify-between gap-3 px-0.5 pt-2.5 pb-2 md:px-1 md:pb-2.5">
                    <div className="flex min-w-0 flex-col gap-[3px]">
                      <h2 className="truncate text-[15px] font-bold text-ink">{template.name}</h2>
                      <span className="text-xs text-slate-500">{template.category}</span>
                    </div>
                    {template.isFree && (
                      <span className="shrink-0 rounded-full bg-green-100 px-[9px] py-[5px] text-[11px] font-bold text-green-700">
                        Free
                      </span>
                    )}
                  </div>
                  <p className="mb-3 line-clamp-2 min-h-[2.6em] px-0.5 text-xs leading-[1.3] text-slate-500 md:px-1">
                    {template.description}
                  </p>
                  <Link
                    href={href}
                    className="block w-full rounded-xl bg-ink px-3.5 py-[11px] text-center text-[13px] font-bold text-white transition hover:bg-blue-600 active:scale-[0.98] motion-reduce:transition-none"
                  >
                    Use template
                  </Link>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </>
  );
}
