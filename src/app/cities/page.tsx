"use client";

import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { SelectionContext } from "../../context/SelectionContext";
import { CityCard } from "@/components/CityCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, MapPin } from "lucide-react";
import { CustomInputCard } from "@/components/CustomInputCard";

interface City {
  name: string;
  isHot: boolean;
}

export default function Cities() {
  const { country, setCity } = useContext(SelectionContext);
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const citiesByCountry: { [key: string]: City[] } = {
    // 🌍 Europe
    Portugal: [
      { name: "Lisbon", isHot: true },
      { name: "Porto", isHot: true },
      { name: "Coimbra", isHot: false },
      { name: "Faro", isHot: false },
      { name: "Braga", isHot: false },
      { name: "Aveiro", isHot: false },
      { name: "Setúbal", isHot: false },
      { name: "Sintra", isHot: true },
      { name: "Funchal", isHot: false },
      { name: "Guimarães", isHot: false },
    ],
    France: [
      { name: "Paris", isHot: true },
      { name: "Marseille", isHot: true },
      { name: "Lyon", isHot: true },
      { name: "Nice", isHot: true },
      { name: "Toulouse", isHot: false },
      { name: "Bordeaux", isHot: true },
      { name: "Lille", isHot: false },
      { name: "Strasbourg", isHot: false },
      { name: "Montpellier", isHot: false },
      { name: "Nantes", isHot: false },
      { name: "Rennes", isHot: false },
      { name: "Grenoble", isHot: false },
      { name: "Dijon", isHot: false },
    ],
    Spain: [
      { name: "Madrid", isHot: true },
      { name: "Barcelona", isHot: true },
      { name: "Valencia", isHot: true },
      { name: "Seville", isHot: true },
      { name: "Zaragoza", isHot: false },
      { name: "Malaga", isHot: true },
      { name: "Bilbao", isHot: false },
      { name: "Granada", isHot: false },
      { name: "Palma", isHot: false },
      { name: "Murcia", isHot: false },
      { name: "Alicante", isHot: false },
    ],
    Italy: [
      { name: "Rome", isHot: true },
      { name: "Milan", isHot: true },
      { name: "Naples", isHot: true },
      { name: "Turin", isHot: false },
      { name: "Palermo", isHot: false },
      { name: "Genoa", isHot: false },
      { name: "Bologna", isHot: true },
      { name: "Florence", isHot: true },
      { name: "Venice", isHot: true },
      { name: "Verona", isHot: false },
      { name: "Bari", isHot: false },
      { name: "Catania", isHot: false },
      { name: "Trieste", isHot: false },
      { name: "Padua", isHot: false },
      { name: "Messina", isHot: false },
    ],
    Germany: [
      { name: "Berlin", isHot: true },
      { name: "Hamburg", isHot: true },
      { name: "Munich", isHot: true },
      { name: "Cologne", isHot: false },
      { name: "Frankfurt", isHot: true },
      { name: "Stuttgart", isHot: false },
      { name: "Düsseldorf", isHot: false },
      { name: "Dortmund", isHot: false },
      { name: "Essen", isHot: false },
      { name: "Bremen", isHot: false },
      { name: "Leipzig", isHot: false },
      { name: "Dresden", isHot: false },
      { name: "Hannover", isHot: false },
      { name: "Nuremberg", isHot: false },
    ],
    "United Kingdom": [
      { name: "London", isHot: true },
      { name: "Manchester", isHot: true },
      { name: "Birmingham", isHot: false },
      { name: "Liverpool", isHot: false },
      { name: "Leeds", isHot: false },
      { name: "Glasgow", isHot: false },
      { name: "Edinburgh", isHot: false },
      { name: "Bristol", isHot: false },
      { name: "Cardiff", isHot: false },
      { name: "Belfast", isHot: false },
    ],
    Netherlands: [
      { name: "Amsterdam", isHot: true },
      { name: "Rotterdam", isHot: true },
      { name: "The Hague", isHot: false },
      { name: "Utrecht", isHot: false },
      { name: "Eindhoven", isHot: false },
      { name: "Groningen", isHot: false },
      { name: "Maastricht", isHot: false },
    ],
    Belgium: [
      { name: "Brussels", isHot: true },
      { name: "Antwerp", isHot: true },
      { name: "Ghent", isHot: false },
      { name: "Bruges", isHot: false },
      { name: "Liège", isHot: false },
      { name: "Charleroi", isHot: false },
    ],
    Switzerland: [
      { name: "Zurich", isHot: true },
      { name: "Geneva", isHot: true },
      { name: "Basel", isHot: false },
      { name: "Lausanne", isHot: false },
      { name: "Bern", isHot: false },
      { name: "Lucerne", isHot: false },
      { name: "St. Gallen", isHot: false },
      { name: "Lugano", isHot: false },
    ],
    Austria: [
      { name: "Vienna", isHot: true },
      { name: "Salzburg", isHot: false },
      { name: "Graz", isHot: false },
      { name: "Linz", isHot: false },
      { name: "Innsbruck", isHot: false },
      { name: "Klagenfurt", isHot: false },
      { name: "Bregenz", isHot: false },
    ],
    Greece: [
      { name: "Athens", isHot: true },
      { name: "Thessaloniki", isHot: false },
      { name: "Patras", isHot: false },
      { name: "Heraklion", isHot: false },
      { name: "Larissa", isHot: false },
      { name: "Volos", isHot: false },
      { name: "Ioannina", isHot: false },
    ],
    Sweden: [
      { name: "Stockholm", isHot: true },
      { name: "Gothenburg", isHot: true },
      { name: "Malmö", isHot: false },
      { name: "Uppsala", isHot: false },
      { name: "Västerås", isHot: false },
      { name: "Örebro", isHot: false },
      { name: "Linköping", isHot: false },
      { name: "Helsingborg", isHot: false },
    ],
    Norway: [
      { name: "Oslo", isHot: true },
      { name: "Bergen", isHot: false },
      { name: "Trondheim", isHot: false },
      { name: "Stavanger", isHot: false },
      { name: "Tromsø", isHot: false },
    ],
    Denmark: [
      { name: "Copenhagen", isHot: true },
      { name: "Aarhus", isHot: false },
      { name: "Odense", isHot: false },
      { name: "Aalborg", isHot: false },
      { name: "Esbjerg", isHot: false },
      { name: "Randers", isHot: false },
    ],
    Finland: [
      { name: "Helsinki", isHot: true },
      { name: "Espoo", isHot: false },
      { name: "Tampere", isHot: false },
      { name: "Vantaa", isHot: false },
      { name: "Turku", isHot: false },
      { name: "Oulu", isHot: false },
    ],
    Poland: [
      { name: "Warsaw", isHot: true },
      { name: "Krakow", isHot: true },
      { name: "Łódź", isHot: false },
      { name: "Wrocław", isHot: false },
      { name: "Poznań", isHot: false },
      { name: "Gdańsk", isHot: false },
      { name: "Szczecin", isHot: false },
      { name: "Bydgoszcz", isHot: false },
      { name: "Lublin", isHot: false },
      { name: "Katowice", isHot: false },
    ],
    "Czech Republic": [
      { name: "Prague", isHot: true },
      { name: "Brno", isHot: false },
      { name: "Ostrava", isHot: false },
      { name: "Plzeň", isHot: false },
      { name: "Liberec", isHot: false },
    ],
    Hungary: [
      { name: "Budapest", isHot: true },
      { name: "Debrecen", isHot: false },
      { name: "Szeged", isHot: false },
      { name: "Miskolc", isHot: false },
      { name: "Pécs", isHot: false },
      { name: "Győr", isHot: false },
    ],
    Romania: [
      { name: "Bucharest", isHot: true },
      { name: "Cluj-Napoca", isHot: false },
      { name: "Timișoara", isHot: false },
      { name: "Iași", isHot: false },
      { name: "Constanța", isHot: false },
      { name: "Brașov", isHot: false },
      { name: "Craiova", isHot: false },
      { name: "Sibiu", isHot: false },
    ],
    Ukraine: [
      { name: "Kyiv", isHot: true },
      { name: "Kharkiv", isHot: false },
      { name: "Odesa", isHot: false },
      { name: "Dnipro", isHot: false },
      { name: "Lviv", isHot: false },
      { name: "Zaporizhia", isHot: false },
      { name: "Kryvyi Rih", isHot: false },
      { name: "Mykolaiv", isHot: false },
    ],
    Ireland: [
      { name: "Dublin", isHot: true },
      { name: "Cork", isHot: false },
      { name: "Limerick", isHot: false },
      { name: "Galway", isHot: false },
      { name: "Waterford", isHot: false },
      { name: "Sligo", isHot: false },
    ],

    // 🌎 North America
    "United States": [
      { name: "New York", isHot: true },
      { name: "Los Angeles", isHot: true },
      { name: "Chicago", isHot: true },
      { name: "Houston", isHot: true },
      { name: "Phoenix", isHot: true },
      { name: "Philadelphia", isHot: true },
      { name: "San Antonio", isHot: true },
      { name: "San Diego", isHot: true },
      { name: "Dallas", isHot: true },
      { name: "San Jose", isHot: true },
      { name: "Austin", isHot: true },
      { name: "Jacksonville", isHot: false },
      { name: "Fort Worth", isHot: false },
      { name: "Columbus", isHot: false },
      { name: "San Francisco", isHot: true },
      { name: "Charlotte", isHot: false },
      { name: "Indianapolis", isHot: false },
      { name: "Seattle", isHot: true },
      { name: "Denver", isHot: false },
      { name: "Washington DC", isHot: true },
      { name: "Boston", isHot: true },
      { name: "Nashville", isHot: false },
      { name: "Detroit", isHot: false },
      { name: "Memphis", isHot: false },
      { name: "Portland", isHot: false },
      { name: "Las Vegas", isHot: true },
      { name: "Oklahoma City", isHot: false },
    ],
    Canada: [
      { name: "Toronto", isHot: true },
      { name: "Montreal", isHot: true },
      { name: "Vancouver", isHot: true },
      { name: "Calgary", isHot: false },
      { name: "Edmonton", isHot: false },
      { name: "Ottawa", isHot: false },
      { name: "Quebec City", isHot: false },
      { name: "Winnipeg", isHot: false },
      { name: "Hamilton", isHot: false },
      { name: "Kitchener", isHot: false },
      { name: "London", isHot: false },
      { name: "Victoria", isHot: false },
      { name: "Halifax", isHot: false },
      { name: "Saskatoon", isHot: false },
      { name: "Regina", isHot: false },
      { name: "Kelowna", isHot: false },
    ],
    Mexico: [
      { name: "Mexico City", isHot: true },
      { name: "Guadalajara", isHot: true },
      { name: "Monterrey", isHot: true },
      { name: "Puebla", isHot: false },
      { name: "Tijuana", isHot: false },
      { name: "Cancún", isHot: false },
      { name: "Mérida", isHot: false },
      { name: "Querétaro", isHot: false },
      { name: "San Luis Potosí", isHot: false },
      { name: "Toluca", isHot: false },
      { name: "Culiacán", isHot: false },
      { name: "Hermosillo", isHot: false },
    ],
    Cuba: [
      { name: "Havana", isHot: true },
      { name: "Santiago de Cuba", isHot: false },
      { name: "Camagüey", isHot: false },
      { name: "Holguín", isHot: false },
      { name: "Santa Clara", isHot: false },
      { name: "Guantánamo", isHot: false },
    ],
    Jamaica: [
      { name: "Kingston", isHot: true },
      { name: "Montego Bay", isHot: true },
      { name: "Ocho Rios", isHot: false },
      { name: "Negril", isHot: false },
    ],
    "Dominican Republic": [
      { name: "Santo Domingo", isHot: true },
      { name: "Santiago de los Caballeros", isHot: false },
      { name: "La Romana", isHot: false },
      { name: "Punta Cana", isHot: false },
      { name: "Puerto Plata", isHot: false },
    ],

    // 🌎 South America
    Brazil: [
      { name: "Rio de Janeiro", isHot: true },
      { name: "São Paulo", isHot: true },
      { name: "Brasília", isHot: true },
      { name: "Salvador", isHot: true },
      { name: "Fortaleza", isHot: false },
      { name: "Belo Horizonte", isHot: true },
      { name: "Manaus", isHot: false },
      { name: "Curitiba", isHot: false },
      { name: "Recife", isHot: false },
      { name: "Porto Alegre", isHot: false },
      { name: "Florianópolis", isHot: false },
      { name: "Natal", isHot: false },
      { name: "Goiânia", isHot: false },
      { name: "Campinas", isHot: false },
    ],
    Argentina: [
      { name: "Buenos Aires", isHot: true },
      { name: "Rosario", isHot: false },
      { name: "Mendoza", isHot: true },
      { name: "La Plata", isHot: false },
      { name: "Mar del Plata", isHot: false },
      { name: "Salta", isHot: false },
      { name: "San Miguel de Tucumán", isHot: false },
      { name: "Santa Fe", isHot: false },
      { name: "Posadas", isHot: false },
      { name: "Corrientes", isHot: false },
    ],
    Chile: [
      { name: "Santiago", isHot: true },
      { name: "Valparaíso", isHot: true },
      { name: "La Serena", isHot: false },
      { name: "Antofagasta", isHot: false },
      { name: "Temuco", isHot: false },
      { name: "Iquique", isHot: false },
      { name: "Rancagua", isHot: false },
      { name: "Talca", isHot: false },
      { name: "Arica", isHot: false },
      { name: "Punta Arenas", isHot: false },
    ],
    Colombia: [
      { name: "Bogotá", isHot: true },
      { name: "Medellín", isHot: true },
      { name: "Cali", isHot: true },
      { name: "Barranquilla", isHot: false },
      { name: "Cartagena", isHot: true },
      { name: "Cúcuta", isHot: false },
      { name: "Bucaramanga", isHot: false },
      { name: "Pereira", isHot: false },
      { name: "Manizales", isHot: false },
      { name: "Santa Marta", isHot: false },
      { name: "Ibagué", isHot: false },
      { name: "Pasto", isHot: false },
    ],
    Peru: [
      { name: "Lima", isHot: true },
      { name: "Arequipa", isHot: true },
      { name: "Trujillo", isHot: false },
      { name: "Chiclayo", isHot: false },
      { name: "Piura", isHot: false },
      { name: "Cusco", isHot: true },
      { name: "Iquitos", isHot: false },
      { name: "Huancayo", isHot: false },
      { name: "Puno", isHot: false },
      { name: "Tacna", isHot: false },
    ],
    Venezuela: [
      { name: "Caracas", isHot: true },
      { name: "Maracaibo", isHot: true },
      { name: "Valencia", isHot: false },
      { name: "Barquisimeto", isHot: false },
      { name: "Maracay", isHot: false },
      { name: "Ciudad Guayana", isHot: false },
      { name: "Puerto La Cruz", isHot: false },
    ],
    Ecuador: [
      { name: "Quito", isHot: true },
      { name: "Guayaquil", isHot: true },
      { name: "Cuenca", isHot: false },
      { name: "Santo Domingo", isHot: false },
      { name: "Machala", isHot: false },
      { name: "Loja", isHot: false },
      { name: "Ambato", isHot: false },
      { name: "Portoviejo", isHot: false },
      { name: "Manta", isHot: false },
    ],
    Paraguay: [
      { name: "Asunción", isHot: true },
      { name: "Ciudad del Este", isHot: false },
      { name: "San Lorenzo", isHot: false },
      { name: "Pedro Juan Caballero", isHot: false },
    ],
    Uruguay: [
      { name: "Montevideo", isHot: true },
      { name: "Salto", isHot: false },
      { name: "Punta del Este", isHot: true },
      { name: "Maldonado", isHot: false },
      { name: "Rivera", isHot: false },
      { name: "Colonia del Sacramento", isHot: false },
    ],

    // 🌏 Asia
    Japan: [
      { name: "Tokyo", isHot: true },
      { name: "Osaka", isHot: true },
      { name: "Kyoto", isHot: true },
      { name: "Yokohama", isHot: true },
      { name: "Nagoya", isHot: true },
      { name: "Sapporo", isHot: false },
      { name: "Fukuoka", isHot: true },
      { name: "Kobe", isHot: false },
      { name: "Hiroshima", isHot: false },
      { name: "Sendai", isHot: false },
      { name: "Kawasaki", isHot: false },
      { name: "Niigata", isHot: false },
      { name: "Okayama", isHot: false },
      { name: "Kanazawa", isHot: false },
      { name: "Kumamoto", isHot: false },
    ],
    China: [
      { name: "Beijing", isHot: true },
      { name: "Shanghai", isHot: true },
      { name: "Guangzhou", isHot: true },
      { name: "Shenzhen", isHot: true },
      { name: "Chengdu", isHot: true },
      { name: "Chongqing", isHot: true },
      { name: "Wuhan", isHot: true },
      { name: "Xi'an", isHot: true },
      { name: "Hangzhou", isHot: true },
      { name: "Nanjing", isHot: false },
      { name: "Tianjin", isHot: false },
      { name: "Suzhou", isHot: false },
      { name: "Qingdao", isHot: false },
      { name: "Shenyang", isHot: false },
      { name: "Dalian", isHot: false },
    ],
    "South Korea": [
      { name: "Seoul", isHot: true },
      { name: "Busan", isHot: true },
      { name: "Incheon", isHot: false },
      { name: "Daegu", isHot: false },
      { name: "Daejeon", isHot: false },
      { name: "Gwangju", isHot: false },
      { name: "Suwon", isHot: false },
      { name: "Ulsan", isHot: false },
      { name: "Changwon", isHot: false },
      { name: "Seongnam", isHot: false },
    ],
    India: [
      { name: "Mumbai", isHot: true },
      { name: "Delhi", isHot: true },
      { name: "Bangalore", isHot: true },
      { name: "Hyderabad", isHot: true },
      { name: "Chennai", isHot: true },
      { name: "Kolkata", isHot: true },
      { name: "Pune", isHot: false },
      { name: "Jaipur", isHot: false },
      { name: "Ahmedabad", isHot: false },
      { name: "Surat", isHot: false },
      { name: "Lucknow", isHot: false },
      { name: "Kanpur", isHot: false },
      { name: "Nagpur", isHot: false },
      { name: "Indore", isHot: false },
      { name: "Bhopal", isHot: false },
      { name: "Patna", isHot: false },
      { name: "Vadodara", isHot: false },
      { name: "Coimbatore", isHot: false },
    ],
    Thailand: [
      { name: "Bangkok", isHot: true },
      { name: "Chiang Mai", isHot: true },
      { name: "Pattaya", isHot: false },
      { name: "Phuket", isHot: true },
      { name: "Hat Yai", isHot: false },
      { name: "Udon Thani", isHot: false },
      { name: "Surat Thani", isHot: false },
      { name: "Nakhon Ratchasima", isHot: false },
    ],
    Vietnam: [
      { name: "Ho Chi Minh City", isHot: true },
      { name: "Hanoi", isHot: true },
      { name: "Da Nang", isHot: false },
      { name: "Haiphong", isHot: false },
      { name: "Hue", isHot: false },
      { name: "Can Tho", isHot: false },
      { name: "Bien Hoa", isHot: false },
      { name: "Nha Trang", isHot: false },
      { name: "Vinh", isHot: false },
    ],
    Malaysia: [
      { name: "Kuala Lumpur", isHot: true },
      { name: "George Town", isHot: false },
      { name: "Johor Bahru", isHot: true },
      { name: "Ipoh", isHot: false },
      { name: "Malacca", isHot: false },
      { name: "Kota Kinabalu", isHot: false },
      { name: "Kuching", isHot: false },
      { name: "Shah Alam", isHot: false },
    ],
    Indonesia: [
      { name: "Jakarta", isHot: true },
      { name: "Surabaya", isHot: true },
      { name: "Bandung", isHot: true },
      { name: "Medan", isHot: false },
      { name: "Semarang", isHot: false },
      { name: "Makassar", isHot: false },
      { name: "Palembang", isHot: false },
      { name: "Denpasar", isHot: true },
      { name: "Balikpapan", isHot: false },
      { name: "Batam", isHot: false },
    ],
    "Saudi Arabia": [
      { name: "Riyadh", isHot: true },
      { name: "Jeddah", isHot: true },
      { name: "Mecca", isHot: true },
      { name: "Medina", isHot: false },
      { name: "Dammam", isHot: false },
      { name: "Taif", isHot: false },
    ],
    "United Arab Emirates": [
      { name: "Dubai", isHot: true },
      { name: "Abu Dhabi", isHot: true },
      { name: "Sharjah", isHot: false },
      { name: "Ajman", isHot: false },
      { name: "Ras Al Khaimah", isHot: false },
      { name: "Fujairah", isHot: false },
      { name: "Umm Al Quwain", isHot: false },
    ],
    Turkey: [
      { name: "Istanbul", isHot: true },
      { name: "Ankara", isHot: true },
      { name: "Izmir", isHot: true },
      { name: "Bursa", isHot: false },
      { name: "Adana", isHot: false },
      { name: "Gaziantep", isHot: false },
      { name: "Konya", isHot: false },
      { name: "Antalya", isHot: false },
      { name: "Kayseri", isHot: false },
      { name: "Mersin", isHot: false },
    ],
    Israel: [
      { name: "Tel Aviv", isHot: true },
      { name: "Jerusalem", isHot: true },
      { name: "Haifa", isHot: false },
      { name: "Beersheba", isHot: false },
      { name: "Netanya", isHot: false },
      { name: "Eilat", isHot: false },
      { name: "Ashdod", isHot: false },
    ],

    // 🌍 Africa
    "South Africa": [
      { name: "Cape Town", isHot: true },
      { name: "Johannesburg", isHot: true },
      { name: "Durban", isHot: true },
      { name: "Pretoria", isHot: false },
      { name: "Port Elizabeth", isHot: false },
      { name: "Bloemfontein", isHot: false },
      { name: "East London", isHot: false },
    ],
    Egypt: [
      { name: "Cairo", isHot: true },
      { name: "Alexandria", isHot: true },
      { name: "Giza", isHot: false },
      { name: "Shubra El-Kheima", isHot: false },
      { name: "Port Said", isHot: false },
      { name: "Suez", isHot: false },
      { name: "Luxor", isHot: false },
      { name: "Aswan", isHot: false },
    ],
    Nigeria: [
      { name: "Lagos", isHot: true },
      { name: "Abuja", isHot: true },
      { name: "Kano", isHot: false },
      { name: "Ibadan", isHot: false },
      { name: "Port Harcourt", isHot: false },
      { name: "Benin City", isHot: false },
      { name: "Maiduguri", isHot: false },
      { name: "Kaduna", isHot: false },
      { name: "Enugu", isHot: false },
    ],
    Kenya: [
      { name: "Nairobi", isHot: true },
      { name: "Mombasa", isHot: true },
      { name: "Kisumu", isHot: false },
      { name: "Nakuru", isHot: false },
      { name: "Eldoret", isHot: false },
      { name: "Thika", isHot: false },
      { name: "Machakos", isHot: false },
    ],
    Morocco: [
      { name: "Marrakesh", isHot: true },
      { name: "Casablanca", isHot: true },
      { name: "Rabat", isHot: false },
      { name: "Fes", isHot: false },
      { name: "Tangier", isHot: false },
      { name: "Agadir", isHot: false },
      { name: "Ouarzazate", isHot: false },
      { name: "Meknes", isHot: false },
    ],
    Algeria: [
      { name: "Algiers", isHot: true },
      { name: "Oran", isHot: true },
      { name: "Constantine", isHot: false },
      { name: "Annaba", isHot: false },
      { name: "Blida", isHot: false },
      { name: "Batna", isHot: false },
    ],
    Tunisia: [
      { name: "Tunis", isHot: true },
      { name: "Sfax", isHot: false },
      { name: "Sousse", isHot: false },
      { name: "Kairouan", isHot: false },
      { name: "Bizerte", isHot: false },
      { name: "Gabès", isHot: false },
    ],
    Ghana: [
      { name: "Accra", isHot: true },
      { name: "Kumasi", isHot: true },
      { name: "Tamale", isHot: false },
      { name: "Sekondi-Takoradi", isHot: false },
      { name: "Ashaiman", isHot: false },
      { name: "Sunyani", isHot: false },
    ],
    Ethiopia: [
      { name: "Addis Ababa", isHot: true },
      { name: "Mekelle", isHot: false },
      { name: "Gondar", isHot: false },
      { name: "Bahir Dar", isHot: false },
      { name: "Hawassa", isHot: false },
      { name: "Dire Dawa", isHot: false },
      { name: "Adama", isHot: false },
      { name: "Jimma", isHot: false },
    ],

    // 🌏 Oceania
    Australia: [
      { name: "Sydney", isHot: true },
      { name: "Melbourne", isHot: true },
      { name: "Brisbane", isHot: true },
      { name: "Perth", isHot: false },
      { name: "Adelaide", isHot: false },
      { name: "Canberra", isHot: false },
      { name: "Gold Coast", isHot: false },
      { name: "Newcastle", isHot: false },
      { name: "Wollongong", isHot: false },
      { name: "Hobart", isHot: false },
    ],
    "New Zealand": [
      { name: "Auckland", isHot: true },
      { name: "Wellington", isHot: true },
      { name: "Christchurch", isHot: false },
      { name: "Hamilton", isHot: false },
      { name: "Tauranga", isHot: false },
      { name: "Dunedin", isHot: false },
      { name: "Palmerston North", isHot: false },
      { name: "Nelson", isHot: false },
    ],
    Fiji: [
      { name: "Suva", isHot: true },
      { name: "Nadi", isHot: false },
      { name: "Lautoka", isHot: false },
    ],
    "Papua New Guinea": [
      { name: "Port Moresby", isHot: true },
      { name: "Lae", isHot: false },
      { name: "Wewak", isHot: false },
    ],

    // Landmarks: 20 iconic global landmarks
    Landmarks: [
      { name: "Great Wall of China", isHot: false },
      { name: "Taj Mahal", isHot: false },
      { name: "Colosseum", isHot: false },
      { name: "Big Ben", isHot: false },
      { name: "Sydney Opera House", isHot: false },
      { name: "Machu Picchu", isHot: false },
      { name: "Burj Khalifa", isHot: false },
      { name: "Angkor Wat", isHot: false },
      { name: "Leaning Tower of Pisa", isHot: false },
      { name: "Mount Rushmore", isHot: false },
      { name: "Palace of Versailles", isHot: false },
      { name: "Neuschwanstein Castle", isHot: false },
      { name: "Acropolis of Athens", isHot: false },
      { name: "Brandenburg Gate", isHot: false },
    ],

    // Beautiful Nature Scenes: 20 breathtaking natural wonders
    "Beautiful Nature Scenes": [
      { name: "Grand Canyon", isHot: false },
      { name: "Niagara Falls", isHot: false },
      { name: "Banff National Park", isHot: false },
      { name: "Yosemite National Park", isHot: false },
      { name: "Antelope Canyon", isHot: false },
      { name: "Iguazu Falls", isHot: false },
      { name: "Victoria Falls", isHot: false },
      { name: "Milford Sound", isHot: false },
      { name: "Zhangjiajie National Forest", isHot: false },
      { name: "Torres del Paine", isHot: false },
    ],

    // City-Specific Icons: 20 urban icons synonymous with their cities
    "City-Specific Icons": [
      { name: "Golden Gate Bridge", isHot: false },
      { name: "CN Tower", isHot: false },
      { name: "Sydney Harbour Bridge", isHot: false },
      { name: "Shibuya Crossing", isHot: false },
      { name: "Space Needle", isHot: false },
      { name: "La Sagrada Familia", isHot: false },
      { name: "Brandenburg Gate", isHot: false },
      { name: "Piazza San Marco", isHot: false },
      { name: "Burj Al Arab", isHot: false },
      { name: "Dubai Fountain", isHot: false },
      { name: "Times Square", isHot: false },
      { name: "Louvre Pyramid", isHot: false },
      { name: "Rialto Bridge", isHot: false },
      { name: "Arc de Triomphe", isHot: false },
      { name: "Gateway of India", isHot: false },
      { name: "Puente de la Mujer", isHot: false },
    ],
  };

  const cities = citiesByCountry[country] || [];

  const filteredCities = cities.filter((city) =>
    city.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCitySelect = (city: string) => {
    setCity(city);
    router.push("/styles");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-teal-400 to-green-400 p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-7xl mx-auto"
      >
        <h1 className="text-5xl font-bold text-white text-center mb-2">
          Explore {country}
        </h1>
        <p className="text-2xl text-white text-center mb-8">
          Choose a city for your GeoArt masterpiece
        </p>

        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-8 shadow-2xl">
          <div className="relative mb-8">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/70" />
            <Input
              type="text"
              placeholder="Search for a city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-white/20 border-white/30 text-white placeholder-white/70"
            />
          </div>

          <AnimatePresence>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              variants={{
                hidden: { opacity: 0 },
                show: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.1,
                  },
                },
              }}
              initial="hidden"
              animate="show"
            >
              {/* Custom Input Card */}
              <CustomInputCard
                placeholder="Can't find your city?"
                onSubmit={handleCitySelect}
              />
              {filteredCities.map((cityObj) => (
                <motion.div
                  key={cityObj.name}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    show: { opacity: 1, y: 0 },
                  }}
                >
                  <CityCard
                    city={cityObj.name}
                    country={country}
                    isHot={cityObj.isHot}
                    onSelect={handleCitySelect}
                  />
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>

          {filteredCities.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-white mt-8"
            >
              <MapPin className="mx-auto mb-4 w-16 h-16" />
              <p className="text-xl">
                No cities found. Try a different search.
              </p>
            </motion.div>
          )}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="mt-8 text-center"
        >
          <Button
            onClick={() => router.push("/countries")}
            variant="outline"
            className="bg-white/20 text-white hover:bg-white/30"
          >
            Back to Countries
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
