"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { templateThumbnail } from "@/lib/invoice/templates";
import type { InvoiceTemplate } from "@/lib/invoice/types";
import { ArrowBackIos, Close, Search } from "@mui/icons-material";

export default function TemplateGallery({
  templates,
}: {
  templates: readonly InvoiceTemplate[];
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  const categories = useMemo(
    () => ["All", ...new Set(templates.map((t) => t.category))],
    [templates],
  );

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase();
    return templates
      .filter((t) => category === "All" || t.category === category)
      .filter(
        (t) =>
          !keyword ||
          `${t.name} ${t.category} ${t.description}`
            .toLowerCase()
            .includes(keyword),
      )
      .sort((a, b) => Number(b.isFree) - Number(a.isFree));
  }, [templates, category, search]);

  const resetFilters = () => {
    setSearch("");
    setCategory("All");
  };

  return (
    <>
      <section className="mx-auto mb-3 flex w-full max-w-[1440px] flex-col gap-1 md:mb-5 lg:mb-8 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
        <div>
          <Link
            href="/"
            className="-ml-2 inline-flex min-h-10 items-center rounded-lg px-2 text-[11px] font-bold tracking-[0.1em] text-blue-600 uppercase transition hover:bg-blue-50 motion-reduce:transition-none md:text-xs"
          >
            <ArrowBackIos
              className="mr-0.5 !h-3 !w-3 md:!h-3.5 md:!w-3.5"
              aria-hidden
            />
            Invoice Generator
          </Link>
          <h1 className="text-[clamp(22px,5.5vw,46px)] leading-[1.15] font-bold tracking-[-0.03em] text-balance text-ink">
            Choose your invoice design
          </h1>
          <p className="mt-1 max-w-[660px] text-[13px] leading-snug text-slate-500 md:mt-2 md:text-[15px] md:leading-[1.7]">
            Pick a template, fill in your details, download a PDF.
            <span className="hidden lg:inline">
              {" "}
              Everything runs in your browser, so your invoice data never leaves
              your device.
            </span>
          </p>
        </div>
        <div className="relative hidden lg:block lg:w-[min(100%,360px)]">
          <SearchField value={search} onChange={setSearch} />
        </div>
      </section>

      {/* Sticky below lg so search + filters stay reachable while scrolling */}
      <div className="sticky top-0 z-20 -mx-4 mb-3 border-b border-slate-200/70 bg-canvas/90 px-4 py-2 backdrop-blur-md md:mb-5 lg:static lg:mx-auto lg:mb-7 lg:max-w-[1440px] lg:border-0 lg:bg-transparent lg:p-0 lg:backdrop-blur-none">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-3 lg:block">
          <div className="relative md:w-64 md:shrink-0 lg:hidden">
            <SearchField value={search} onChange={setSearch} />
          </div>
          <nav
            aria-label="Template categories"
            className="-mx-4 flex min-w-0 items-center gap-1.5 overflow-x-auto scroll-px-4 px-4 [scrollbar-width:none] md:mx-0 md:flex-1 md:px-0 [&::-webkit-scrollbar]:hidden"
          >
            {categories.map((item) => (
              <button
                type="button"
                key={item}
                aria-pressed={category === item}
                className={`min-h-6 shrink-0 rounded-full border px-3.5 text-xs font-semibold transition active:scale-[0.97] motion-reduce:transition-none md:text-[13px] ${
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
        </div>
      </div>
      <p
        aria-live="polite"
        className="mx-auto mb-3 w-full max-w-[1440px] text-xs font-medium text-slate-500 md:mb-4"
      >
        {filtered.length} {filtered.length === 1 ? "template" : "templates"}
      </p>

      {filtered.length === 0 ? (
        <div className="mx-auto flex max-w-[1440px] flex-col items-center gap-3 py-16 text-center">
          <p className="text-sm text-slate-500">
            {search.trim() ? (
              <>No templates match &ldquo;{search.trim()}&rdquo;.</>
            ) : (
              "No templates in this category."
            )}
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="min-h-10 rounded-full border border-slate-200 bg-white px-4 text-[13px] font-semibold text-ink transition hover:border-slate-300 motion-reduce:transition-none"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <section className="mx-auto grid w-full max-w-[1440px] grid-cols-2 gap-3 sm:gap-4 md:grid-cols-[repeat(auto-fill,minmax(260px,1fr))] md:gap-6">
          {filtered.map((template, index) => {
            const href = `/invoice/editor/${template.id}`;
            return (
              <article
                key={template.id}
                className="group relative flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-1.5 shadow-card transition duration-[220ms] active:scale-[0.985] motion-reduce:transition-none sm:p-2 md:rounded-[18px] md:p-0 md:active:scale-100 md:hover:-translate-y-1 md:hover:border-blue-600/25 md:hover:shadow-card-hover"
              >
                <div className="relative aspect-[210/297] w-full overflow-hidden rounded-xl bg-[linear-gradient(145deg,#eef2f7,#f8fafc)]">
                  <Image
                    src={templateThumbnail(template.id)}
                    alt={`${template.name} invoice template preview`}
                    fill
                    priority={index < 4}
                    sizes="(max-width: 768px) 50vw, 300px"
                    className="object-cover transition-transform duration-300 motion-reduce:transition-none md:group-hover:scale-[1.015]"
                  />
                  {template.isFree && (
                    <span className="absolute top-2 right-2 rounded-full bg-green-100 px-2 py-1 text-[10px] font-bold text-green-700 shadow-sm md:hidden">
                      Free
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-col px-1 pb-1 md:px-2.5 md:pb-2.5">
                  <div className="flex items-center justify-between gap-3 pt-2 pb-1 md:px-1 md:pt-2.5 md:pb-2.5">
                    <div className="flex min-w-0 flex-col gap-0.5 md:gap-[3px]">
                      <h2 className="truncate text-[13px] font-bold text-ink md:text-[15px]">
                        {/* Stretched link: whole card is the tap target */}
                        <Link
                          href={href}
                          aria-label={`Use the ${template.name} template`}
                          className="after:absolute after:inset-0 after:rounded-2xl after:content-[''] focus-visible:outline-none focus-visible:after:ring-2 focus-visible:after:ring-blue-600"
                        >
                          {template.name}
                        </Link>
                      </h2>
                      <span className="truncate text-[11px] text-slate-500 md:text-xs">
                        {template.category}
                      </span>
                    </div>
                    {template.isFree && (
                      <span className="hidden shrink-0 rounded-full bg-green-100 px-[9px] py-[5px] text-[11px] font-bold text-green-700 md:inline">
                        Free
                      </span>
                    )}
                  </div>
                  <p className="mb-3 line-clamp-2 min-h-[2.6em] text-xs leading-[1.3] text-slate-500 max-md:hidden md:px-1">
                    {template.description}
                  </p>
                  <span
                    aria-hidden
                    className="mt-auto hidden w-full rounded-xl bg-ink px-3.5 py-[11px] text-center text-[13px] font-bold text-white transition group-hover:bg-blue-600 motion-reduce:transition-none md:block"
                  >
                    Use template
                  </span>
                </div>
              </article>
            );
          })}
        </section>
      )}
    </>
  );
}

function SearchField({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <>
      <Search
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-3.5 !h-5 !w-5 -translate-y-1/2 text-slate-400"
      />
      <input
        type="search"
        inputMode="search"
        enterKeyHint="search"
        aria-label="Search templates"
        // text-base on mobile prevents iOS auto-zoom on focus
        className="h-10 w-full appearance-none rounded-xl border border-slate-200 bg-white pr-11 pl-11 text-md text-ink shadow-card outline-none transition placeholder:text-slate-400 focus:border-blue-600 focus:shadow-[0_0_0_3px_rgba(37,99,235,0.12)] motion-reduce:transition-none md:text-[15px] [&::-webkit-search-cancel-button]:hidden"
        placeholder="Search templates..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
      {value && (
        <button
          type="button"
          aria-label="Clear search"
          onClick={() => onChange("")}
          className="absolute top-1/2 right-1.5 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-ink motion-reduce:transition-none"
        >
          <Close className="!h-[18px] !w-[18px]" />
        </button>
      )}
    </>
  );
}
