"use client";
import type { Language } from "@/data/translations";

export type Filters = {
  gradeLevel: string;
  interest: string;
  identity: string;
  location: string;
  type: string;
  search: string;
};

type Props = {
  filters: Filters;
  onChange: (filters: Filters) => void;
  language: Language;
};

const labels: Record<Language, {
  search: string; grade: string; allGrades: string; highSchool: string; college: string;
  interest: string; allInterests: string; identity: string; allIdentities: string;
  location: string; allLocations: string; type: string; allTypes: string;
}> = {
  en: {
    search: "Search opportunities...", grade: "Grade Level", allGrades: "All grades",
    highSchool: "High School", college: "College", interest: "Interest", allInterests: "All interests",
    identity: "Identity", allIdentities: "All", location: "Location", allLocations: "All locations",
    type: "Type", allTypes: "All types",
  },
  es: {
    search: "Buscar oportunidades...", grade: "Nivel Escolar", allGrades: "Todos",
    highSchool: "Preparatoria", college: "Universidad", interest: "Interés", allInterests: "Todos",
    identity: "Identidad", allIdentities: "Todos", location: "Ubicación", allLocations: "Todos",
    type: "Tipo", allTypes: "Todos",
  },
  vi: {
    search: "Tìm kiếm cơ hội...", grade: "Cấp học", allGrades: "Tất cả",
    highSchool: "Trung học", college: "Đại học", interest: "Lĩnh vực", allInterests: "Tất cả",
    identity: "Danh tính", allIdentities: "Tất cả", location: "Địa điểm", allLocations: "Tất cả",
    type: "Loại", allTypes: "Tất cả",
  },
  so: {
    search: "Raadi fursadaha...", grade: "Heerka Dugsiga", allGrades: "Dhammaan",
    highSchool: "Dugsiga Sare", college: "Jaamacadda", interest: "Xiisaha", allInterests: "Dhammaan",
    identity: "Aqoonsiga", allIdentities: "Dhammaan", location: "Goobta", allLocations: "Dhammaan",
    type: "Nooca", allTypes: "Dhammaan",
  },
  ru: {
    search: "Поиск возможностей...", grade: "Уровень обучения", allGrades: "Все уровни",
    highSchool: "Старшая школа", college: "Колледж/Университет", interest: "Направление", allInterests: "Все",
    identity: "Категория", allIdentities: "Все", location: "Местоположение", allLocations: "Все",
    type: "Тип", allTypes: "Все типы",
  },
};

export default function FilterBar({ filters, onChange, language }: Props) {
  const l = labels[language] ?? labels.en;
  const set = (key: keyof Filters, value: string) => onChange({ ...filters, [key]: value });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-4 flex flex-col gap-3">
      <input
        type="text"
        placeholder={l.search}
        value={filters.search}
        onChange={(e) => set("search", e.target.value)}
        className="w-full border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
        aria-label="Search opportunities"
      />
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
        <select value={filters.gradeLevel} onChange={(e) => set("gradeLevel", e.target.value)}
          className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          aria-label={l.grade}>
          <option value="">{l.allGrades}</option>
          <option value="high-school">{l.highSchool}</option>
          <option value="college">{l.college}</option>
        </select>

        <select value={filters.interest} onChange={(e) => set("interest", e.target.value)}
          className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          aria-label={l.interest}>
          <option value="">{l.allInterests}</option>
          {["computer science", "engineering", "biology", "math", "neuroscience", "chemistry", "physics"].map((i) => (
            <option key={i} value={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</option>
          ))}
        </select>

        <select value={filters.identity} onChange={(e) => set("identity", e.target.value)}
          className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          aria-label={l.identity}>
          <option value="">{l.allIdentities}</option>
          {["first-gen", "low-income", "underrepresented"].map((i) => (
            <option key={i} value={i}>{i.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
          ))}
        </select>

        <select value={filters.location} onChange={(e) => set("location", e.target.value)}
          className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          aria-label={l.location}>
          <option value="">{l.allLocations}</option>
          <option value="remote">🌐 Remote</option>
          <option value="washington">🏔️ Washington</option>
          <option value="national">🇺🇸 National</option>
        </select>

        <select value={filters.type} onChange={(e) => set("type", e.target.value)}
          className="border border-gray-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-400"
          aria-label={l.type}>
          <option value="">{l.allTypes}</option>
          {["scholarship", "internship", "program", "mentorship", "college-prep"].map((tp) => (
            <option key={tp} value={tp}>{tp.replace("-", " ").replace(/\b\w/g, (c) => c.toUpperCase())}</option>
          ))}
        </select>
      </div>
    </div>
  );
}
