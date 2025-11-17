// src/app/page.tsx
import { redirect } from "next/navigation";

export default function HomePage() {
  // Redireciona permanentemente o usuário da raiz ("/")
  // para a nossa página de dashboard ("/dashboard")
  console.log("Pagina Principal...");
  redirect("/dashboard");

  // A gente nem precisa retornar nada aqui,
  // o redirect cuida de tudo.
}
