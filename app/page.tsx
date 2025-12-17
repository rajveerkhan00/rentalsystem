import { redirect } from "next/navigation";

export default function Home() {
  redirect("/Home");
  
  // This won't be rendered, but needs to be returned
  return null;
}