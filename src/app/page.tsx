"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import {
  Activity, CalendarDays, Check, ChevronDown,
  CircleAlert, Clock3, FilePlus2, Filter, LayoutDashboard, LoaderCircle,
  MoreHorizontal, Pencil, Plus, RefreshCw, Search, ShieldCheck, Trash2,
  Users, X,
} from "lucide-react";

type Employee = {
  id: string;
  firstName: string;
  lastName: string;
  nationalCode: string;
  birthDate: string;
};
type FormValues = Omit<Employee, "id">;
const emptyForm: FormValues = { firstName: "", lastName: "", nationalCode: "", birthDate: "" };

async function readError(response: Response) {
  const data = await response.json().catch(() => null);
  return data?.message || "در انجام درخواست مشکلی پیش آمد.";
}

export default function Home() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState<"create" | "edit" | null>(null);
  const [selected, setSelected] = useState<Employee | null>(null);
  const [form, setForm] = useState<FormValues>(emptyForm);
  const [notice, setNotice] = useState<{ kind: "success" | "error"; text: string } | null>(null);

  const loadEmployees = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/employees", { cache: "no-store" });
      if (!response.ok) throw new Error(await readError(response));
      setEmployees(await response.json());
    } catch (error) {
      setNotice({ kind: "error", text: error instanceof Error ? error.message : "ارتباط با سرور برقرار نشد." });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { void loadEmployees(); }, [loadEmployees]);

  const filtered = useMemo(() => {
    const term = search.trim().toLocaleLowerCase("fa");
    if (!term) return employees;
    return employees.filter((employee) =>
      [employee.firstName, employee.lastName, employee.nationalCode]
        .some((value) => value.toLocaleLowerCase("fa").includes(term)),
    );
  }, [employees, search]);

  function openCreate() {
    setSelected(null);
    setForm(emptyForm);
    setModal("create");
  }

  function openEdit(employee: Employee) {
    setSelected(employee);
    setForm({
      firstName: employee.firstName,
      lastName: employee.lastName,
      nationalCode: employee.nationalCode,
      birthDate: employee.birthDate,
    });
    setModal("edit");
  }

  async function submitForm(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    try {
      const response = await fetch(selected && modal === "edit" ? `/api/employees/${selected.id}` : "/api/employees", {
        method: selected && modal === "edit" ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error(await readError(response));
      setNotice({ kind: "success", text: modal === "edit" ? "اطلاعات کارمند به‌روزرسانی شد." : "کارمند جدید با موفقیت ثبت شد." });
      setModal(null);
      await loadEmployees();
    } catch (error) {
      setNotice({ kind: "error", text: error instanceof Error ? error.message : "ثبت اطلاعات انجام نشد." });
    } finally {
      setSaving(false);
    }
  }

  async function deleteEmployee(employee: Employee) {
    if (!window.confirm(`کارمند «${employee.firstName} ${employee.lastName}» حذف شود؟`)) return;
    try {
      const response = await fetch(`/api/employees/${employee.id}`, { method: "DELETE" });
      if (!response.ok) throw new Error(await readError(response));
      setNotice({ kind: "success", text: "کارمند حذف شد." });
      await loadEmployees();
    } catch (error) {
      setNotice({ kind: "error", text: error instanceof Error ? error.message : "حذف کارمند انجام نشد." });
    }
  }

  useEffect(() => {
    if (!notice) return;
    const timer = window.setTimeout(() => setNotice(null), 4500);
    return () => window.clearTimeout(timer);
  }, [notice]);

  return (
    <main className="app-shell">
      <aside className="sidebar">
        <div className="brand"><div className="brand-mark">R</div><div><strong>ریرا</strong><span>سامانه منابع انسانی</span></div></div>
        <div className="nav-caption">منوی اصلی</div>
        <a className="nav-link active" href="#"><LayoutDashboard size={18} /><span>داشبورد</span></a>
        <a className="nav-link" href="#employees"><Users size={18} /><span>مدیریت کارکنان</span><span className="nav-count">{employees.length}</span></a>
        <div className="sidebar-bottom">
          <div className="connection-card"><span className="connection-dot" /><div><b>وضعیت سرویس</b><small>اتصال از طریق gRPC</small></div><ShieldCheck size={17} /></div>
          <div className="profile"><div className="avatar">ر</div><div><b>مدیر سیستم</b><small>پنل آزمایشی ریرا</small></div><MoreHorizontal size={19} /></div>
        </div>
      </aside>

      <section className="main-area">
        <header className="topbar">
          <div className="breadcrumb">خانه <span>/</span> داشبورد</div>
          <div className="top-actions"><span className="live-indicator"><i /> محیط توسعه</span><div className="top-avatar">ر</div></div>
        </header>

        <div className="content">
          <section className="welcome-row">
            <div><div className="eyebrow"><Activity size={14} /> مرکز مدیریت منابع انسانی</div><h1>داشبورد کارکنان</h1><p>نمای کلی اطلاعات و مدیریت اعضای سازمان</p></div>
            <button className="primary-button" onClick={openCreate}><Plus size={18} /> افزودن کارمند</button>
          </section>

          <section className="stats-grid">
            <article className="stat-card featured"><div className="stat-top"><span>کل کارکنان</span><div className="stat-icon"><Users size={19} /></div></div><strong>{loading ? "—" : employees.length.toLocaleString("fa-IR")}</strong><small><span className="trend"><Activity size={13} /> زنده</span> تعداد ثبت‌شده در سامانه</small><div className="stat-decoration" /></article>
            <article className="stat-card"><div className="stat-top"><span>نتایج جست‌وجو</span><div className="stat-icon soft-purple"><Search size={19} /></div></div><strong>{filtered.length.toLocaleString("fa-IR")}</strong><small>کارمند مطابق فیلتر فعلی</small></article>
            <article className="stat-card"><div className="stat-top"><span>آخرین به‌روزرسانی</span><div className="stat-icon soft-blue"><Clock3 size={19} /></div></div><strong className="stat-word">همین لحظه</strong><small>داده‌ها مستقیماً از سرور دریافت می‌شوند</small></article>
          </section>

          <section className="table-panel" id="employees">
            <div className="panel-heading"><div><h2>فهرست کارکنان</h2><p>اطلاعات ثبت‌شده در پایگاه داده</p></div><button className="icon-button" onClick={() => void loadEmployees()} aria-label="بروزرسانی" title="بروزرسانی"><RefreshCw size={17} className={loading ? "spin" : ""} /></button></div>
            <div className="table-toolbar"><div className="search-box"><Search size={17} /><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="جست‌وجو بر اساس نام یا کد ملی..." /><kbd>⌘ K</kbd></div><button className="filter-button" onClick={() => setSearch("")}><Filter size={16} /> پاک‌کردن فیلتر <ChevronDown size={14} /></button><span className="result-count">{filtered.length.toLocaleString("fa-IR")} نتیجه</span></div>
            <div className="table-wrap"><table><thead><tr><th>کارمند</th><th>کد ملی</th><th>تاریخ تولد</th><th>شناسه</th><th>عملیات</th></tr></thead><tbody>
              {loading ? <tr><td colSpan={5}><div className="table-state"><LoaderCircle className="spin" size={22} /> در حال دریافت اطلاعات...</div></td></tr>
                : filtered.length === 0 ? <tr><td colSpan={5}><div className="table-state empty-state"><div className="empty-icon"><Users size={24} /></div><b>{employees.length ? "نتیجه‌ای پیدا نشد" : "هنوز کارمندی ثبت نشده است"}</b><span>{employees.length ? "عبارت جست‌وجو را تغییر دهید." : "اولین کارمند را به سامانه اضافه کنید."}</span>{!employees.length && <button className="primary-button small" onClick={openCreate}><Plus size={16} /> افزودن کارمند</button>}</div></td></tr>
                : filtered.map((employee, index) => <tr key={employee.id}><td><div className="employee-cell"><div className={`employee-avatar avatar-${index % 5}`}>{employee.firstName.charAt(0)}</div><div><b>{employee.firstName} {employee.lastName}</b><small>کارمند سازمان</small></div></div></td><td className="numeric">{employee.nationalCode}</td><td><span className="date-cell"><CalendarDays size={15} />{employee.birthDate}</span></td><td><span className="id-chip" title={employee.id}>{employee.id.slice(0, 8)}…</span></td><td><div className="row-actions"><button className="action-edit" onClick={() => openEdit(employee)} title="ویرایش"><Pencil size={16} /></button><button className="action-delete" onClick={() => void deleteEmployee(employee)} title="حذف"><Trash2 size={16} /></button></div></td></tr>)}
            </tbody></table></div>
            <div className="table-footer"><span>نمایش {filtered.length.toLocaleString("fa-IR")} از {employees.length.toLocaleString("fa-IR")} کارمند</span><span className="secure-note"><ShieldCheck size={14} /> همگام با سرویس gRPC</span></div>
          </section>

          <footer className="page-footer"><span>© ۱۴۰۵ سامانه مدیریت کارکنان ریرا</span><span><span className="footer-dot" /> اتصال امن در محیط توسعه</span></footer>
        </div>
      </section>

      {notice && <div className={`toast ${notice.kind}`}>{notice.kind === "success" ? <Check size={18} /> : <CircleAlert size={18} />}{notice.text}<button onClick={() => setNotice(null)} aria-label="بستن"><X size={16} /></button></div>}

      {modal && <div className="modal-backdrop" onMouseDown={(event) => { if (event.target === event.currentTarget) setModal(null); }}><section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title"><div className="modal-header"><div><span className="modal-kicker">{modal === "edit" ? "ویرایش اطلاعات" : "ثبت اطلاعات جدید"}</span><h2 id="modal-title">{modal === "edit" ? "ویرایش کارمند" : "افزودن کارمند جدید"}</h2></div><button className="icon-button" onClick={() => setModal(null)} aria-label="بستن"><X size={19} /></button></div><form onSubmit={submitForm}><div className="form-grid"><label>نام<input required maxLength={100} value={form.firstName} onChange={(event) => setForm({ ...form, firstName: event.target.value })} placeholder="مثلاً علی" /></label><label>نام خانوادگی<input required maxLength={100} value={form.lastName} onChange={(event) => setForm({ ...form, lastName: event.target.value })} placeholder="مثلاً رضایی" /></label><label>کد ملی<input required maxLength={20} value={form.nationalCode} onChange={(event) => setForm({ ...form, nationalCode: event.target.value })} placeholder="کد ملی یا شناسه ملی" /></label><label>تاریخ تولد<input required type="date" value={form.birthDate} onChange={(event) => setForm({ ...form, birthDate: event.target.value })} /></label></div><div className="form-hint"><ShieldCheck size={15} /> کد ملی باید در سامانه یکتا باشد. تاریخ با قالب استاندارد میلادی ذخیره می‌شود.</div><div className="modal-actions"><button type="button" className="secondary-button" onClick={() => setModal(null)}>انصراف</button><button className="primary-button" disabled={saving}>{saving ? <LoaderCircle className="spin" size={17} /> : <FilePlus2 size={17} />}{modal === "edit" ? "ذخیره تغییرات" : "ثبت کارمند"}</button></div></form></section></div>}
    </main>
  );
}