import Link from 'next/link';
import { Facebook, Instagram, Linkedin, Mail, MapPin, Phone } from 'lucide-react';

export function ExevoFooter() {
  return (
    <footer id="contact" className="border-t bg-slate-50/80 px-4 py-12 md:px-6 dark:bg-slate-950/80">
      <div className="mx-auto grid w-full max-w-7xl gap-10 md:grid-cols-4">
        <div className="space-y-3 md:col-span-2">
          <h3 className="text-2xl font-black text-exevo-blue dark:text-white">Exevo</h3>
          <p className="max-w-md text-sm text-slate-600 dark:text-slate-300">
            Exevo est une plateforme éducative congolaise moderne dédiée à la préparation intelligente
            à l’Exetat en République Démocratique du Congo.
          </p>
          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-300">
            <MapPin className="h-4 w-4" />
            <span className="text-sm">Kinshasa, RDC</span>
          </div>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-exevo-blue dark:text-white">Liens rapides</h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li>
              <Link href="#accueil" className="hover:text-exevo-orange">
                Accueil
              </Link>
            </li>
            <li>
              <Link href="#fonctionnalites" className="hover:text-exevo-orange">
                Fonctionnalités
              </Link>
            </li>
            <li>
              <Link href="#sections" className="hover:text-exevo-orange">
                Sections
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-exevo-orange">
                Connexion
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="mb-3 font-semibold text-exevo-blue dark:text-white">Contact</h4>
          <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <li className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-exevo-orange" />
              contact@exevo.cd
            </li>
            <li className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-exevo-orange" />
              +243 000 000 000
            </li>
          </ul>
          <div className="mt-4 flex items-center gap-3">
            <Link href="#" aria-label="Facebook" className="rounded-full bg-white p-2 shadow hover:text-exevo-orange dark:bg-slate-800">
              <Facebook className="h-4 w-4" />
            </Link>
            <Link href="#" aria-label="Instagram" className="rounded-full bg-white p-2 shadow hover:text-exevo-orange dark:bg-slate-800">
              <Instagram className="h-4 w-4" />
            </Link>
            <Link href="#" aria-label="LinkedIn" className="rounded-full bg-white p-2 shadow hover:text-exevo-orange dark:bg-slate-800">
              <Linkedin className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
      <div className="mx-auto mt-8 w-full max-w-7xl border-t pt-4 text-center text-xs text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} Exevo. Tous droits réservés.
      </div>
    </footer>
  );
}
