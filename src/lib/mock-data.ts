export type College = {
  id: string;
  name: string;
  location: string;
  type: "Engineering" | "Medical" | "Arts & Science" | "Management" | "Law";
  rating: number;
  fees: string;
  established: number;
  highlights: string[];
};

export type Course = {
  id: string;
  name: string;
  category: "Engineering" | "Medical" | "Commerce" | "Arts" | "Design" | "Law";
  duration: string;
  avgSalary: string;
  description: string;
  eligibility: string;
};

export const colleges: College[] = [
  { id: "iitp", name: "IIT Palakkad", location: "Palakkad, Kerala", type: "Engineering", rating: 4.8, fees: "₹2.5L/yr", established: 2015, highlights: ["IIT Brand", "Top Faculty", "Research Hub"] },
  { id: "nitc", name: "NIT Calicut", location: "Kozhikode, Kerala", type: "Engineering", rating: 4.7, fees: "₹1.8L/yr", established: 1961, highlights: ["NIRF Top 25", "Strong Alumni", "Placements"] },
  { id: "aims", name: "AIIMS New Delhi", location: "New Delhi", type: "Medical", rating: 4.9, fees: "₹6K/yr", established: 1956, highlights: ["#1 Medical", "Govt", "Research"] },
  { id: "cmc", name: "Christian Medical College", location: "Vellore, TN", type: "Medical", rating: 4.8, fees: "₹50K/yr", established: 1900, highlights: ["Heritage", "Hospital", "Mission"] },
  { id: "stxm", name: "St. Xavier's College", location: "Mumbai", type: "Arts & Science", rating: 4.6, fees: "₹35K/yr", established: 1869, highlights: ["Autonomous", "Heritage", "Diverse"] },
  { id: "iimk", name: "IIM Kozhikode", location: "Kozhikode, Kerala", type: "Management", rating: 4.8, fees: "₹20L total", established: 1996, highlights: ["IIM Brand", "Hilltop Campus", "Top MBA"] },
  { id: "nls", name: "NLSIU Bangalore", location: "Bengaluru", type: "Law", rating: 4.9, fees: "₹3L/yr", established: 1987, highlights: ["#1 Law", "CLAT Top", "Moot Champions"] },
  { id: "cusat", name: "CUSAT", location: "Kochi, Kerala", type: "Engineering", rating: 4.5, fees: "₹40K/yr", established: 1971, highlights: ["State Univ", "Marine Sciences", "Affordable"] },
];

export const courses: Course[] = [
  { id: "btech-cs", name: "B.Tech Computer Science", category: "Engineering", duration: "4 years", avgSalary: "₹12 LPA", description: "Software engineering, AI/ML, systems & data — the most in-demand engineering track.", eligibility: "12th PCM + JEE/KEAM" },
  { id: "mbbs", name: "MBBS", category: "Medical", duration: "5.5 years", avgSalary: "₹10 LPA", description: "Become a licensed physician. India's most respected professional path.", eligibility: "12th PCB + NEET" },
  { id: "bcom", name: "B.Com (Hons)", category: "Commerce", duration: "3 years", avgSalary: "₹6 LPA", description: "Accounting, finance, taxation — gateway to CA, CFA, MBA.", eligibility: "12th any stream" },
  { id: "bba", name: "BBA", category: "Commerce", duration: "3 years", avgSalary: "₹7 LPA", description: "Business management foundation, perfect for MBA aspirants & entrepreneurs.", eligibility: "12th any stream" },
  { id: "bdes", name: "B.Des", category: "Design", duration: "4 years", avgSalary: "₹9 LPA", description: "Product, UX, communication design — at the intersection of art and tech.", eligibility: "12th + NID/UCEED" },
  { id: "ba-psy", name: "BA Psychology", category: "Arts", duration: "3 years", avgSalary: "₹5 LPA", description: "Human behaviour, counselling, neuroscience — booming wellness industry.", eligibility: "12th any stream" },
  { id: "llb", name: "BA LLB (5yr)", category: "Law", duration: "5 years", avgSalary: "₹10 LPA", description: "Integrated law degree opening litigation, corporate, judicial careers.", eligibility: "12th + CLAT" },
  { id: "bsc-ds", name: "B.Sc Data Science", category: "Engineering", duration: "3 years", avgSalary: "₹11 LPA", description: "Statistics + Python + ML — the fastest-growing science discipline.", eligibility: "12th PCM" },
];

export const testimonials = [
  { name: "Aiswarya Nair", course: "B.Tech CSE, NIT Calicut", quote: "Dr ACE's mentoring helped me crack KEAM with a top rank. The Eduvo expo introduced me to colleges I'd never even considered." },
  { name: "Rahul Menon", course: "MBBS, Govt Medical College", quote: "Personalised counselling, honest advice and zero pressure. Totally changed how I thought about my career." },
  { name: "Fathima Beevi", course: "BBA, Christ University", quote: "The aptitude test pinpointed exactly what I'm good at. I'm now studying what I love — not what others wanted." },
];

export const stats = [
  { value: 12000, suffix: "+", label: "Students Guided" },
  { value: 350, suffix: "+", label: "Partner Colleges" },
  { value: 96, suffix: "%", label: "Admission Success" },
  { value: 14, suffix: "", label: "Years of Expertise" },
];

export const districts = [
  "Thiruvananthapuram", "Kollam", "Pathanamthitta", "Alappuzha", "Kottayam",
  "Idukki", "Ernakulam", "Thrissur", "Palakkad", "Malappuram",
  "Kozhikode", "Wayanad", "Kannur", "Kasaragod",
];
