import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";
import temp1 from "../../../assets/template/temp1.webp";

const temp = {
  modern: temp1,
};

import toolsService from "../../../services/toolsService";

import "./invoice.scss";

export default function TemplateSelectionPage() {
  const navigate = useNavigate();

  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");

  useEffect(() => {
    let mounted = true;

    async function loadTemplates() {
      try {
        const response = await toolsService.getInvoiceTemplates();

        if (!mounted) return;

        setTemplates(response?.data?.templates || []);
      } catch (error) {
        console.error("Unable to load templates:", error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadTemplates();

    return () => {
      mounted = false;
    };
  }, []);

  const categories = useMemo(() => {
    return ["All", ...new Set(templates.map((template) => template.category))];
  }, [templates]);

  const filteredTemplates = useMemo(() => {
    const keyword = search.trim().toLowerCase();

    return (
      templates
        .filter((template) => {
          if (category !== "All" && template.category !== category) {
            return false;
          }

          if (keyword && !template.name.toLowerCase().includes(keyword)) {
            return false;
          }

          return true;
        })

        // Free templates first.
        .sort((a, b) => Number(b.isFree) - Number(a.isFree))
    );
  }, [templates, category, search]);

  const selectTemplate = (template) => {
    navigate(`/invoice/editor/${template.id}`);
  };

  if (loading) {
    return (
      <main className="template-page">
        <div className="template-loading">Loading templates...</div>
      </main>
    );
  }

  return (
    <main className="template-page">
      <section className="template-hero">
        <div>
          <span className="eyebrow">Invoice Generator</span>

          <h1>Choose your invoice design</h1>

          <p>
            Pick a template first. You can customize fonts, colors and invoice
            information afterwards.
          </p>
        </div>

        <input
          className="template-search"
          placeholder="Search templates..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </section>

      <nav className="category-filter">
        {categories.map((item) => (
          <button
            type="button"
            key={item}
            className={category === item ? "active" : ""}
            onClick={() => setCategory(item)}
          >
            {item}
          </button>
        ))}
      </nav>

      <section className="template-grid">
        {filteredTemplates.map((template) => (
          <article key={template.id} className="template-card">
            <button
              type="button"
              className="template-preview"
              onClick={() => selectTemplate(template)}
            >
              <img
                // src={template.thumbnail || temp[template.id]}
                src={temp[template.id]}
                alt={template.name}
                loading="lazy"
              />
            </button>

            <div className="template-footer">
              <div className="template-card-footer">
                <div>
                  <strong>{template.name}</strong>

                  <span>{template.category}</span>
                </div>

                {template.isFree && <span className="free-badge">Free</span>}
              </div>
              <button
                type="button"
                className="use-template-btn"
                onClick={() => selectTemplate(template)}
              >
                Use template
              </button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
