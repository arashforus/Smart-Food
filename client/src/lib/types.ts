export interface Restaurant {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  hours: string;
  logo?: string;
}

export interface Category {
  id: string;
  name: string;
  nameEs: string;
  nameFr: string;
  order: number;
}

export interface MenuItem {
  id: string;
  name: string;
  nameEs: string;
  nameFr: string;
  description: string;
  descriptionEs: string;
  descriptionFr: string;
  price: number;
  categoryId: string;
  image?: string;
  available: boolean;
}

export type Language = 'en' | 'es' | 'fr';

export const translations = {
  en: {
    menu: 'Menu',
    categories: 'Categories',
    all: 'All',
    hours: 'Hours',
    address: 'Address',
    phone: 'Phone',
    aboutUs: 'About Us',
    selectLanguage: 'Select Language',
    english: 'English',
    spanish: 'Spanish',
    french: 'French',
  },
  es: {
    menu: 'Menú',
    categories: 'Categorías',
    all: 'Todos',
    hours: 'Horario',
    address: 'Dirección',
    phone: 'Teléfono',
    aboutUs: 'Sobre Nosotros',
    selectLanguage: 'Seleccionar Idioma',
    english: 'Inglés',
    spanish: 'Español',
    french: 'Francés',
  },
  fr: {
    menu: 'Menu',
    categories: 'Catégories',
    all: 'Tout',
    hours: 'Horaires',
    address: 'Adresse',
    phone: 'Téléphone',
    aboutUs: 'À Propos',
    selectLanguage: 'Choisir la Langue',
    english: 'Anglais',
    spanish: 'Espagnol',
    french: 'Français',
  },
};
