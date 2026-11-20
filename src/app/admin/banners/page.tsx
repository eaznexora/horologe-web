import { redirect } from "next/navigation";

export default function AdminBannersRedirectPage() {
  redirect("/admin/banners/home");
}

